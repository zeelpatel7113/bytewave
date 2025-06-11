import { NextResponse } from 'next/server';
import connectDB from '@/db/connect';
import Career from '@/db/models/Career';

// Helper function to format date (keep existing)
const formatDate = (date) => {
  if (!date) return null;
  try {
    return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
  } catch (error) {
    console.error('Date formatting error:', error);
    return null;
  }
};

// Helper function to format career request data
const formatCareerRequestData = (request) => {
  // Convert mongoose document to plain object if it isn't already
  const requestObj = request.toObject ? request.toObject() : request;
  
  return {
    ...requestObj,
    createdAt: formatDate(requestObj.createdAt),
    updatedAt: formatDate(requestObj.updatedAt),
    statusHistory: requestObj.statusHistory?.map(history => ({
      ...history,
      updatedAt: formatDate(history.updatedAt)
    })) || []
  };
};

// Helper function to generate requestId (keep existing)
const generateRequestId = async () => {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '');
  const count = await Career.countDocuments();
  return `CAR-${timestamp}-${(count + 1).toString().padStart(3, '0')}`;
};

// GET all career requests
export async function GET() {
  try {
    await connectDB();

    const requests = await Career.find({})
      .populate('careerId', 'careerType position experienceLevel projectType jobLocation')
      .sort({ createdAt: -1 })
      .lean(); // Use lean() for better performance since we don't need Mongoose methods

    const formattedRequests = requests.map(formatCareerRequestData);

    return NextResponse.json(
      { 
        success: true, 
        data: formattedRequests 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get career requests error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch career requests',
        error: error.message,
        data: [] // Always return an array even on error
      },
      { status: 500 }
    );
  }
}

// POST new career request
export async function POST(request) {
  await connectDB();
  
  try {
    const body = await request.json();
    
    // Generate requestId if not provided
    if (!body.requestId) {
      body.requestId = await generateRequestId();
    }

    // Initialize statusHistory if not provided
    if (!body.statusHistory || body.statusHistory.length === 0) {
      body.statusHistory = [{
        status: 'pending',
        note: 'New application submitted',
        updatedAt: new Date(),
        updatedBy: 'Bytewave Admin'
      }];
    }

    // Create the career request
    const careerRequest = await Career.create(body);

    // Populate the careerId field
    await careerRequest.populate('careerId', 'careerType position experienceLevel projectType jobLocation');

    // Format the response data
    const formattedRequest = formatCareerRequestData(careerRequest);

    return NextResponse.json({ 
      success: true, 
      message: "Application submitted successfully",
      data: formattedRequest 
    }, { status: 200 });

  } catch (error) {
    console.error('Create career request error:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message,
      data: null
    }, { status: 500 });
  }
}