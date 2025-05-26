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

// GET single contact
export async function GET(request) {
  await connectDB();

  try {
    const id = request.url.split('/').pop();
    const contact = await Contact.findOne({ requestId: id });

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

// PUT update contact
export async function PUT(request) {
  await connectDB();

  try {
    const id = request.url.split('/').pop();
    const data = await request.json();

    // Validate status if provided
    if (data.status) {
      const validStatuses = ['draft', 'pending', 'followup1', 'followup2', 'approved', 'rejected'];
      if (!validStatuses.includes(data.status)) {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid status. Status must be one of: ${validStatuses.join(', ')}`,
            validStatuses
          },
          { status: 400 }
        );
      }
    }

    const contact = await Contact.findOne({ requestId: id });
    if (!contact) {
      return NextResponse.json(
        { success: false, message: 'Contact not found' },
        { status: 404 }
      );
    }

    // Add new status to history if status is provided
    if (data.status) {
      contact.statusHistory.push({
        status: data.status,
        note: data.note || `Status updated to ${data.status}`,
        updatedAt: new Date(),
        updatedBy: data.updatedBy || 'System'
      });
    }

    // Update other fields if provided
    if (data.name) contact.name = data.name;
    if (data.email) contact.email = data.email;
    if (data.phone) contact.phone = data.phone;
    if (data.message) contact.message = data.message;

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
      { status: 400 }
    );
  }
}

// DELETE contact
export async function DELETE(request) {
  await connectDB();

  try {
    const id = request.url.split('/').pop();
    const contact = await Contact.findOneAndDelete({ requestId: id });
    
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
        data: {
          requestId: contact.requestId,
          name: contact.name,
          email: contact.email,
          deletedAt: formatDate(new Date()),
          deletedBy: 'System'
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