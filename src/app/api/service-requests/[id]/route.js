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

// GET single service request
export async function GET(request) {
  await connectDB();

  try {
    const id = request.url.split('/').pop();
    const serviceRequest = await ServiceRequest.findOne({ requestId: id })
      .populate('serviceId', 'title serviceId');

    if (!serviceRequest) {
      return NextResponse.json(
        { success: false, message: 'Service request not found' },
        { status: 404 }
      );
    }

    const formattedRequest = formatServiceRequestData(serviceRequest);

    return NextResponse.json(
      { success: true, data: formattedRequest },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get service request error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PUT update service request
export async function PUT(request) {
  await connectDB();

  try {
    const id = request.url.split('/').pop();
    const data = await request.json();

    // Validate status if provided
    if (data.status) {
      const validStatuses = ['draft', 'pending', 'followup1', 'followup2', 'approved', 'rejected'];
      if (!validStatuses.includes(data.status)) {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid status. Status must be one of: ${validStatuses.join(', ')}`,
            validStatuses
          },
          { status: 400 }
        );
      }
    }

    const serviceRequest = await ServiceRequest.findOne({ requestId: id });
    if (!serviceRequest) {
      return NextResponse.json(
        { success: false, message: 'Service request not found' },
        { status: 404 }
      );
    }

    // Add new status to history if status is provided
    if (data.status) {
      serviceRequest.statusHistory.push({
        status: data.status,
        note: data.note || `Status updated to ${data.status}`,
        updatedAt: new Date(),
        updatedBy: 'Bytewave Admin'
      });
    }

    // Update other fields if provided
    if (data.name) serviceRequest.name = data.name;
    if (data.email) serviceRequest.email = data.email;
    if (data.phone) serviceRequest.phone = data.phone;
    if (data.message) serviceRequest.message = data.message;

    await serviceRequest.save();
    await serviceRequest.populate('serviceId', 'title serviceId');

    const formattedRequest = formatServiceRequestData(serviceRequest);

    return NextResponse.json(
      { 
        success: true, 
        data: formattedRequest,
        message: 'Service request updated successfully' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update service request error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}

// DELETE service request
export async function DELETE(request) {
  await connectDB();

  try {
    const id = request.url.split('/').pop();
    const serviceRequest = await ServiceRequest.findOneAndDelete({ requestId: id });
    
    if (!serviceRequest) {
      return NextResponse.json(
        { success: false, message: 'Service request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'Service request deleted successfully',
        data: {
          requestId: serviceRequest.requestId,
          name: serviceRequest.name,
          email: serviceRequest.email,
          deletedAt: formatDate(new Date()),
          deletedBy: 'Bytewave Admin'
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete service request error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}