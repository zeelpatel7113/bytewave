import { NextResponse } from 'next/server';
import connectDB from '@/db/connect';
import TrainingRequest from '@/db/models/TrainingRequest';

export async function GET(request) {
  await connectDB();

  try {
    const id = request.url.split('/').pop();
    
    const trainingRequest = await TrainingRequest.findById(id);

    if (!trainingRequest) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Training request not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        data: trainingRequest 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get training request error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch training request',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  await connectDB();

  try {
    const id = request.url.split('/').pop();
    const data = await request.json();
    const currentDateTime = new Date().toDateString(); // Using the provided UTC time

    const trainingRequest = await TrainingRequest.findByIdAndUpdate(
      id,
      {
        ...data,
        lastModified: currentDateTime,
        $push: {
          statusHistory: {
            status: data.status,
            note: data.note || `Status updated to ${data.status}`,
            updatedAt: currentDateTime,
            updatedBy: "Bytewave Admin",
          },
        },
      },
      { new: true, runValidators: true }
    );

    if (!trainingRequest) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Training request not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        data: trainingRequest,
        message: 'Training request updated successfully' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update training request error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update training request',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  await connectDB();

  try {
    const id = request.url.split('/').pop();
    
    const trainingRequest = await TrainingRequest.findByIdAndDelete(id);

    if (!trainingRequest) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Training request not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Training request deleted successfully',
        deletionDetails: {
          timestamp: new Date().toDateString(),
          deletedBy: "Bytewave Admin",
          requestDetails: {
            id: trainingRequest._id.toString(),
            courseName: trainingRequest.courseName,
            studentName: trainingRequest.name
          }
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete training request error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to delete training request',
        error: error.message 
      },
      { status: 500 }
    );
  }
}