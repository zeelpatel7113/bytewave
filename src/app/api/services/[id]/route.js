import { NextResponse } from 'next/server';
import connectDB from '@/db/connect';
import Service from '@/db/models/Service';

// GET single service
export async function GET(request) {
  await connectDB();

  try {
    const id = request.url.split('/').pop();
    
    const service = await Service.findById(id);

    if (!service) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Service not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        data: service 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get service error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch service',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// PUT/UPDATE service
export async function PUT(request) {
  await connectDB();

  try {
    const id = request.url.split('/').pop();
    const data = await request.json();
    const currentDateTime = new Date().toDateString(); // Using the provided UTC time

    const service = await Service.findByIdAndUpdate(
      id,
      {
        ...data,
        lastModified: currentDateTime
      },
      { new: true, runValidators: true }
    );

    if (!service) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Service not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        data: service,
        message: 'Service updated successfully' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update service error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update service',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// DELETE service
export async function DELETE(request) {
  await connectDB();

  try {
    const id = request.url.split('/').pop();
    
    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Service not found' 
        },
        { status: 404 }
      );
    }

    const deletionRecord = {
      timestamp: new Date().toDateString(), // Using the provided UTC time
      deletedBy: 'Bytewave Admin',
      serviceDetails: {
        id: service._id.toString(),
        title: service.title,
        category: service.category
      }
    };

    return NextResponse.json(
      { 
        success: true, 
        message: 'Service deleted successfully',
        deletionDetails: deletionRecord
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete service error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to delete service',
        error: error.message 
      },
      { status: 500 }
    );
  }
}