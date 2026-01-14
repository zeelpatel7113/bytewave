import { NextResponse } from 'next/server';
import connectDB from '@/db/connect';
import Contact from '@/db/models/Contact';

// Helper function to format date
const formatDate = (date) => {
  if (!date) return null;
  try {
    return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
  } catch (error) {
    console.error('Date formatting error:', error);
    return null;
  }
};

// Helper function to format contact data
const formatContactData = (contact) => {
  const contactObj = contact.toObject();
  return {
    ...contactObj,
    createdAt: formatDate(contactObj.createdAt),
    updatedAt: formatDate(contactObj.updatedAt),
    statusHistory: contactObj.statusHistory.map(history => ({
      ...history,
      updatedAt: formatDate(history.updatedAt)
    }))
  };
};

// Helper function to generate contactId with retry mechanism
const generateContactId = async (retryCount = 0) => {
  try {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '');
    const count = await Contact.countDocuments();
    const randomSuffix = Math.random().toString(36).substring(2, 5);
    const requestId = `CON-${timestamp}-${(count + 1).toString().padStart(3, '0')}-${randomSuffix}`;

    // Check if this ID already exists
    const existing = await Contact.findOne({ requestId });
    if (existing && retryCount < 3) {
      // Retry with incremented count
      return generateContactId(retryCount + 1);
    }

    return requestId;
  } catch (error) {
    console.error('Error generating requestId:', error);
    // Fallback to timestamp-based ID if all else fails
    return `CON-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  }
};

// GET all contacts
export async function GET() {
  await connectDB();

  try {
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    const formattedContacts = contacts.map(formatContactData);

    return NextResponse.json(
      { 
        success: true, 
        data: formattedContacts 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get contacts error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch contacts',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// POST new contact
export async function POST(request) {
  await connectDB();

  try {
    const data = await request.json();
    const now = new Date();
    
    // Generate unique requestId
    const requestId = await generateContactId();

    // Prepare the contact data
    const contactData = {
      requestId,
      name: data.name || '',
      email: data.email || '',
      phone: data.phone || '',
      message: data.message || '',
      statusHistory: [{
        status: 'draft',
        note: 'Contact form submitted',
        updatedAt: now,
        updatedBy: 'System'
      }]
    };

    // Conditionally add date if provided
    if (data.date) {
      contactData.date = data.date;
    }

    // Create the contact
    const contact = await Contact.create(contactData);
    const formattedContact = formatContactData(contact);

    console.log("data:", formattedContact)

    return NextResponse.json(
      { 
        success: true, 
        data: formattedContact,
        message: 'Contact form submitted successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create contact error:', error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: 'Duplicate request ID, please try again',
          error: 'Duplicate key error'
        },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to submit contact form',
        error: error.message 
      },
      { status: 500 }
    );
  }
}