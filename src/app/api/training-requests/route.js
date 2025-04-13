import { NextResponse } from 'next/server';
import connectDB from '@/db/connect';
import TrainingRequest from '@/db/models/TrainingRequest';

export async function POST(request) {
  await connectDB();

  try {
    const data = await request.json();
    const currentDateTime = new Date().toDateString(); 

    const trainingRequest = await TrainingRequest.create({
      ...data,
      lastModified: currentDateTime,
      statusHistory: [
        {
          status: 'pending',
          note: 'Training request submitted',
          updatedAt: currentDateTime,
          updatedBy: 'Bytewave Admin',
        },
      ],
    });

    return NextResponse.json(
      { 
        success: true, 
        data: trainingRequest,
        message: 'Training request submitted successfully' 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create training request error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to submit training request',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  await connectDB();

  try {
    const requests = await TrainingRequest.find({})
      .sort({ createdAt: -1 });

    return NextResponse.json(
      { 
        success: true, 
        data: requests 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get training requests error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch training requests',
        error: error.message 
      },
      { status: 500 }
    );
  }
}