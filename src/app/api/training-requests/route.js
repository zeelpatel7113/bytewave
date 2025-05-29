import { NextResponse } from 'next/server';
import connectDB from '@/db/connect';
import TrainingRequest from '@/db/models/TrainingRequest';

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

// Helper function to format training request data
const formatTrainingRequestData = (request) => {
  const requestObj = request.toObject();
  return {
    ...requestObj,
    createdAt: formatDate(requestObj.createdAt),
    updatedAt: formatDate(requestObj.updatedAt),
    statusHistory: requestObj.statusHistory.map(history => ({
      ...history,
      updatedAt: formatDate(history.updatedAt)
    }))
  };
};

// Helper function to generate requestId
const generateRequestId = async () => {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '');
  const count = await TrainingRequest.countDocuments();
  return `TR-${timestamp}-${(count + 1).toString().padStart(3, '0')}`;
};

// GET all training requests
export async function GET() {
  await connectDB();

  try {
    const requests = await TrainingRequest.find({})
      .populate('courseId', 'courseName courseType level duration location')
      .sort({ createdAt: -1 });

    const formattedRequests = requests.map(formatTrainingRequestData);

    return NextResponse.json(
      { 
        success: true, 
        data: formattedRequests 
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

// POST new training request
export async function POST(request) {
  await connectDB();

  try {
    const data = await request.json();
    
    // Generate requestId
    const requestId = await generateRequestId();
    const now = new Date('2025-05-26T08:52:02Z'); // Using the provided current time

    // Create training request with initial status
    const trainingRequest = await TrainingRequest.create({
      ...data,
      requestId,
      statusHistory: [{
        status: 'pending',
        notes: 'Training request submitted',
        updatedAt: now,
        updatedBy: 'Patil5913'  // Using the provided current user
      }]
    });

    await trainingRequest.populate('courseId', 'courseName courseType level duration location');
    const formattedRequest = formatTrainingRequestData(trainingRequest);

    return NextResponse.json(
      { 
        success: true, 
        data: formattedRequest,
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