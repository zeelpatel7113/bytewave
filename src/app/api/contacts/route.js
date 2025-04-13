import { NextResponse } from 'next/server';
import connectDB from '@/db/connect';
import Contact from '@/db/models/Contact';

export async function GET() {
  await connectDB();

  try {
    const contacts = await Contact.find({})
      .sort({ createdAt: -1 });

    return NextResponse.json(
      { 
        success: true, 
        data: contacts 
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

    const contact = await Contact.create({
      ...data,
      createdAt: new Date().toDateString(),
      status: "new",
      statusHistory: [
        {
          status: "new",
          note: "Contact request submitted",
          updatedAt: new Date().toDateString(),
          updatedBy: "Bytewave Admin"
        }
      ]
    });

    return NextResponse.json(
      { 
        success: true, 
        data: contact,
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