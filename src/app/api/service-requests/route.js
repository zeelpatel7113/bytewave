// This is for GET all service requests (/api/service-requests)
import { NextResponse } from 'next/server';
import connectDB from '@/db/connect';
import ServiceRequest from '@/db/models/ServiceRequest';

export async function GET() {
  await connectDB();

  try {
    const serviceRequests = await ServiceRequest.find({})
      .populate('serviceId', 'title')
      .sort({ createdAt: -1 }); // Sort by creation date, newest first

    return NextResponse.json(
      { 
        success: true, 
        data: serviceRequests 
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

// POST for creating new service requests
export async function POST(request) {
  await connectDB();

  try {
    const data = await request.json();
    const currentDateTime = new Date().toDateString();

    const serviceRequest = await ServiceRequest.create({
      ...data,
      createdAt: currentDateTime,
      lastModified: currentDateTime,
      status: 'draft',
      statusHistory: [{
        status: 'draft',
        note: 'Service request created',
        updatedAt: currentDateTime,
        updatedBy: 'Bytewave Admin'
      }]
    });

    await serviceRequest.populate('serviceId', 'title');

    return NextResponse.json(
      { 
        success: true, 
        data: serviceRequest,
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