import { NextResponse } from 'next/server';
import connectDB from '@/db/connect';
import Service from '@/db/models/Service';

// GET all services
export async function GET() {
  await connectDB();

  try {
    const services = await Service.find({})
      .sort({ createdAt: -1 }); // Sort by creation date, newest first

    return NextResponse.json(
      { 
        success: true, 
        data: services 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get services error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch services',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// POST new service
export async function POST(request) {
  await connectDB();

  try {
    const data = await request.json();
    const currentDateTime = new Date().toDateString(); // Using the provided UTC time

    const service = await Service.create({
      ...data,
      createdAt: currentDateTime,
      lastModified: currentDateTime
    });

    return NextResponse.json(
      { 
        success: true, 
        data: service,
        message: 'Service created successfully' 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create service error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create service',
        error: error.message 
      },
      { status: 500 }
    );
  }
}