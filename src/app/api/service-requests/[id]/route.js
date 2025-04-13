import { NextResponse } from 'next/server';
import connectDB from '@/db/connect';
import ServiceRequest from '@/db/models/ServiceRequest';

// DELETE service request
export async function DELETE(request) {
  await connectDB();

  try {
    // Get the ID from the URL instead of params
    const id = request.url.split('/').pop();
    
    const serviceRequest = await ServiceRequest.findByIdAndDelete(id);

    if (!serviceRequest) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Service request not found' 
        },
        { status: 404 }
      );
    }

    const deletionRecord = {
      timestamp: new Date().toDateString(),
      deletedBy: 'Bytewave Admin',
      requestDetails: {
        id: serviceRequest._id.toString(),
        name: serviceRequest.name,
        email: serviceRequest.email,
        service: serviceRequest.serviceId,
        status: serviceRequest.status
      }
    };

    return NextResponse.json(
      { 
        success: true, 
        message: 'Service request deleted successfully',
        deletionDetails: deletionRecord
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete service request error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to delete service request',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// GET single service request
export async function GET(request) {
  await connectDB();

  try {
    const id = request.url.split('/').pop();
    
    const serviceRequest = await ServiceRequest.findById(id)
      .populate('serviceId', 'title');

    if (!serviceRequest) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Service request not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        data: serviceRequest 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get service request error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch service request',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// PUT/UPDATE service request
export async function PUT(request) {
  await connectDB();

  try {
    const id = request.url.split('/').pop();
    const data = await request.json();
    const currentDateTime = new Date().toDateString();

    const serviceRequest = await ServiceRequest.findByIdAndUpdate(
      id,
      {
        ...data,
        lastModified: currentDateTime,
        $push: {
          statusHistory: {
            status: data.status,
            note: data.note,
            updatedAt: currentDateTime,
            updatedBy: 'Bytewave Admin'
          }
        }
      },
      { new: true, runValidators: true }
    ).populate('serviceId', 'title');

    if (!serviceRequest) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Service request not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        data: serviceRequest,
        message: 'Service request updated successfully' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update service request error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update service request',
        error: error.message 
      },
      { status: 500 }
    );
  }
}