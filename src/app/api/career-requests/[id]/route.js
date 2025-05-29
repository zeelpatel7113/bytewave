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

// GET single career request
export async function GET(request) {
  await connectDB();

  try {
    const id = request.url.split('/').pop();
    const careerRequest = await Career.findOne({ requestId: id })
      .populate('careerId', 'careerType position experienceLevel projectType jobLocation');

    if (!careerRequest) {
      return NextResponse.json(
        { success: false, message: 'Career application not found' },
        { status: 404 }
      );
    }

    const formattedRequest = formatCareerRequestData(careerRequest);

    return NextResponse.json(
      { success: true, data: formattedRequest },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get career request error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PUT update career request
export async function PUT(request) {
  await connectDB();

  try {
    const id = request.url.split('/').pop();
    const data = await request.json();

    // Validate status if provided
    if (data.status) {
      const validStatuses = ['pending', 'reviewing', 'interviewed', 'selected', 'rejected'];
      if (!validStatuses.includes(data.status)) {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
            validStatuses
          },
          { status: 400 }
        );
      }
    }

    const careerRequest = await Career.findOne({ requestId: id });
    if (!careerRequest) {
      return NextResponse.json(
        { success: false, message: 'Career application not found' },
        { status: 404 }
      );
    }

    // Add new status to history if status is provided
    if (data.status) {
      careerRequest.statusHistory.push({
        status: data.status,
        note: data.note || `Status updated to ${data.status}`,
        updatedAt: new Date(),
        updatedBy: 'Bytewave Admin'
      });
    }

    // Update other fields if provided
    if (data.name) careerRequest.name = data.name;
    if (data.email) careerRequest.email = data.email;
    if (data.phone) careerRequest.phone = data.phone;
    if (data.experience) {
      if (isNaN(data.experience) || data.experience < 0) {
        return NextResponse.json(
          {
            success: false,
            message: 'Experience must be a positive number'
          },
          { status: 400 }
        );
      }
      careerRequest.experience = data.experience;
    }
    if (data.resumeUrl) careerRequest.resumeUrl = data.resumeUrl;
    if (data.message) careerRequest.message = data.message;

    await careerRequest.save();
    await careerRequest.populate('careerId', 'careerType position experienceLevel projectType jobLocation');

    const formattedRequest = formatCareerRequestData(careerRequest);

    return NextResponse.json(
      { 
        success: true, 
        data: formattedRequest,
        message: 'Career application updated successfully' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update career request error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}

// DELETE career request
export async function DELETE(request) {
  await connectDB();

  try {
    const id = request.url.split('/').pop();
    const careerRequest = await Career.findOneAndDelete({ requestId: id });
    
    if (!careerRequest) {
      return NextResponse.json(
        { success: false, message: 'Career application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'Career application deleted successfully',
        data: {
          requestId: careerRequest.requestId,
          name: careerRequest.name,
          email: careerRequest.email,
          deletedAt: formatDate(new Date()),
          deletedBy: 'Bytewave Admin'
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete career request error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}