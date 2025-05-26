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

export async function GET(request) {
  await connectDB();

  try {
    const id = request.url.split('/').pop();
    const contact = await Contact.findById(id);
    if (!contact) {
      return NextResponse.json(
        { success: false, message: 'Contact not found' },
        { status: 404 }
      );
    }

    const formattedContact = formatContactData(contact);

    return NextResponse.json(
      { success: true, data: formattedContact },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get contact error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  await connectDB();

  try {
    const data = await request.json();
    
    // Validate status
    const validStatuses = ['draft', 'pending', 'followup1', 'followup2', 'approved', 'rejected'];
    if (!validStatuses.includes(data.status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status' },
        { status: 400 }
      );
    }
    const id = request.url.split('/').pop();

    const contact = await Contact.findById(id);
    if (!contact) {
      return NextResponse.json(
        { success: false, message: 'Contact not found' },
        { status: 404 }
      );
    }

    // Add new status to history
    contact.statusHistory.push({
      status: data.status,
      note: data.note || `Status updated to ${data.status}`,
      updatedAt: new Date(),
      updatedBy: 'Bytewave Admin'
    });

    await contact.save();
    const formattedContact = formatContactData(contact);

    return NextResponse.json(
      { 
        success: true, 
        data: formattedContact,
        message: 'Contact updated successfully' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update contact error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  await connectDB();

  try {
    const id = request.url.split('/').pop();
    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      return NextResponse.json(
        { success: false, message: 'Contact not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'Contact deleted successfully',
        deletionDetails: {
          timestamp: formatDate(new Date()),
          deletedBy: 'Bytewave Admin',
          contactDetails: {
            requestId: contact.requestId,
            name: contact.name,
            email: contact.email
          }
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete contact error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}