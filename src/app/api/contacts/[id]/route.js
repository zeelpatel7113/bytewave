import { NextResponse } from 'next/server';
import connectDB from '@/db/connect';
import Contact from '@/db/models/Contact';

const CURRENT_USER = "Bytewave Admin";
const CURRENT_DATETIME = new Date().toDateString();

export async function PUT(request, { params: rawParams }) {
  await connectDB();
  const params = await Promise.resolve(rawParams);

  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Contact ID is required' 
        },
        { status: 400 }
      );
    }

    const data = await request.json();

    const contact = await Contact.findByIdAndUpdate(
      id,
      {
        $set: {
          status: data.status,
        },
        $push: {
          statusHistory: {
            status: data.status,
            note: data.note || `Status updated to ${data.status}`,
            updatedAt: CURRENT_DATETIME,
            updatedBy: CURRENT_USER
          }
        }
      },
      { new: true }
    );

    if (!contact) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Contact request not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        data: contact,
        message: 'Contact request updated successfully' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update contact error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update contact request',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params: rawParams }) {
  await connectDB();
  const params = await Promise.resolve(rawParams);

  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Contact ID is required' 
        },
        { status: 400 }
      );
    }

    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Contact request not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'Contact request deleted successfully',
        deletionDetails: {
          timestamp: CURRENT_DATETIME,
          deletedBy: CURRENT_USER,
          contactDetails: {
            name: contact.name,
            email: contact.email,
            subject: contact.subject
          }
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete contact error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to delete contact request',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET(request, { params: rawParams }) {
  await connectDB();
  const params = await Promise.resolve(rawParams);

  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Contact ID is required' 
        },
        { status: 400 }
      );
    }

    const contact = await Contact.findById(id);

    if (!contact) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Contact request not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        data: contact 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get contact error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch contact request',
        error: error.message 
      },
      { status: 500 }
    );
  }
}