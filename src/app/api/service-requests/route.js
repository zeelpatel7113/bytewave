import { NextResponse } from 'next/server';
import connectDB from '@/db/connect';
import ServiceRequest from '@/db/models/ServiceRequest';

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

// Helper function to format service request data
const formatServiceRequestData = (request) => {
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
  const count = await ServiceRequest.countDocuments();
  return `REQ-${timestamp}-${(count + 1).toString().padStart(3, '0')}`;
};

// GET all service requests
export async function GET() {
  await connectDB();

  try {
    const serviceRequests = await ServiceRequest.find({})
      .populate('serviceId', 'title serviceId')
      .sort({ createdAt: -1 });

    const formattedRequests = serviceRequests.map(formatServiceRequestData);

    return NextResponse.json(
      { 
        success: true, 
        data: formattedRequests 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get service requests error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch service requests',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// POST new service request
export async function POST(request) {
  await connectDB();

  try {
    const data = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'serviceId', 'message'];
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

    const requestId = await generateRequestId();
    const now = new Date();

    const serviceRequest = await ServiceRequest.create({
      ...data,
      requestId,
      statusHistory: [{
        status: 'draft',
        note: 'Service request created',
        updatedAt: now,
        updatedBy: 'Bytewave Admin'
      }]
    });

    await serviceRequest.populate('serviceId', 'title serviceId');
    const formattedRequest = formatServiceRequestData(serviceRequest);

    return NextResponse.json(
      { 
        success: true, 
        data: formattedRequest,
        message: 'Service request created successfully' 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create service request error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create service request',
        error: error.message 
      },
      { status: 500 }
    );
  }
}