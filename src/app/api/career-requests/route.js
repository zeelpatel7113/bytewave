import { NextResponse } from 'next/server';
import connectDB from '@/db/connect';
import Career from '@/db/models/Career';

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

// Helper function to format career request data
const formatCareerRequestData = (request) => {
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
  const count = await Career.countDocuments();
  return `CAR-${timestamp}-${(count + 1).toString().padStart(3, '0')}`;
};

// GET all career requests
export async function GET() {
  await connectDB();

  try {
    const requests = await Career.find({})
      .populate('careerId', 'careerType position experienceLevel projectType jobLocation')
      .sort({ createdAt: -1 });

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
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// POST new career request
export async function POST(request) {
  await connectDB();

  try {
    const data = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'careerId', 'experience', 'resumeUrl', 'message'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Missing required fields: ${missingFields.join(', ')}`
        },
        { status: 400 }
      );
    }

    // Validate experience is a number
    if (isNaN(data.experience) || data.experience < 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Experience must be a positive number'
        },
        { status: 400 }
      );
    }

    // Generate requestId
    const requestId = await generateRequestId();
    const now = new Date();

    const careerRequest = await Career.create({
      ...data,
      requestId,
      statusHistory: [{
        status: 'pending',
        note: 'Career application submitted',
        updatedAt: now,
        updatedBy: 'Bytewave Admin'
      }]
    });

    await careerRequest.populate('careerId', 'careerType position experienceLevel projectType jobLocation');
    const formattedRequest = formatCareerRequestData(careerRequest);

    return NextResponse.json(
      { 
        success: true, 
        data: formattedRequest,
        message: 'Career application submitted successfully' 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create career request error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to submit career application',
        error: error.message 
      },
      { status: 500 }
    );
  }
}