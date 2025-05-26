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

export async function POST(request) {
  await connectDB();

  try {
    const data = await request.json();
    
    // Generate requestId
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '');
    const requestId = `CON-${timestamp}`;

    const contact = await Contact.create({
      requestId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      statusHistory: [{
        status: 'draft',
        note: 'Contact request submitted',
        updatedAt: new Date(),
        updatedBy: 'Bytewave Admin'
      }]
    });

    const formattedContact = formatContactData(contact);

    return NextResponse.json(
      { 
        success: true, 
        data: formattedContact,
        message: 'Contact request submitted successfully' 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create contact error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to submit contact request',
        error: error.message 
      },
      { status: 500 }
    );
  }
}