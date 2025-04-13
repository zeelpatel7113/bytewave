import { NextResponse } from 'next/server';
import connectDB from '@/db/connect';
import Career from '@/db/models/Career';

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
          message: 'Career ID is required' 
        },
        { status: 400 }
      );
    }

    const data = await request.json();

    const career = await Career.findByIdAndUpdate(
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

    if (!career) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Career application not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        data: career,
        message: 'Career application updated successfully' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update career error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update career application',
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
          message: 'Career ID is required' 
        },
        { status: 400 }
      );
    }

    const career = await Career.findByIdAndDelete(id);

    if (!career) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Career application not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'Career application deleted successfully',
        deletionDetails: {
          timestamp: CURRENT_DATETIME,
          deletedBy: CURRENT_USER,
          careerDetails: {
            position: career.position,
            applicantName: career.name,
            email: career.email
          }
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete career error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to delete career application',
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
          message: 'Career ID is required' 
        },
        { status: 400 }
      );
    }

    const career = await Career.findById(id);

    if (!career) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Career application not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        data: career 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get career error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch career application',
        error: error.message 
      },
      { status: 500 }
    );
  }
}