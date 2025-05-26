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

// GET single training request
export async function GET(request) {
  await connectDB();

  try {
    const id = request.url.split('/').pop();
    const trainingRequest = await TrainingRequest.findOne({ requestId: id })
      .populate('courseId', 'trainingId title');

    if (!trainingRequest) {
      return NextResponse.json(
        { success: false, message: 'Training request not found' },
        { status: 404 }
      );
    }

    const formattedRequest = formatTrainingRequestData(trainingRequest);

    return NextResponse.json(
      { success: true, data: formattedRequest },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get training request error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PUT update training request
export async function PUT(request) {
  await connectDB();

  try {
    const id = request.url.split('/').pop();
    const data = await request.json();

    // Validate status if provided
    if (data.status) {
      const validStatuses = ['draft', 'pending', 'followup1', 'followup2', 'approved', 'rejected', 'completed'];
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

    const trainingRequest = await TrainingRequest.findOne({ requestId: id });
    if (!trainingRequest) {
      return NextResponse.json(
        { success: false, message: 'Training request not found' },
        { status: 404 }
      );
    }

    // Add new status to history if status is provided
    if (data.status) {
      trainingRequest.statusHistory.push({
        status: data.status,
        notes: data.notes || `Status updated to ${data.status}`,
        updatedAt: new Date(),
        updatedBy: 'Bytewave Admin'
      });
    }

    // Update other fields if provided
    if (data.name) trainingRequest.name = data.name;
    if (data.email) trainingRequest.email = data.email;
    if (data.phone) trainingRequest.phone = data.phone;
    if (data.experience) {
      const validExperienceLevels = ['beginner', 'intermediate', 'advanced'];
      if (!validExperienceLevels.includes(data.experience)) {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid experience level. Must be one of: ${validExperienceLevels.join(', ')}`
          },
          { status: 400 }
        );
      }
      trainingRequest.experience = data.experience;
    }
    if (data.message) trainingRequest.message = data.message;

    await trainingRequest.save();
    await trainingRequest.populate('courseId', 'trainingId title');

    const formattedRequest = formatTrainingRequestData(trainingRequest);

    return NextResponse.json(
      { 
        success: true, 
        data: formattedRequest,
        message: 'Training request updated successfully' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update training request error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}

// DELETE training request
export async function DELETE(request) {
  await connectDB();

  try {
    const id = request.url.split('/').pop();
    const trainingRequest = await TrainingRequest.findOneAndDelete({ requestId: id });
    
    if (!trainingRequest) {
      return NextResponse.json(
        { success: false, message: 'Training request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'Training request deleted successfully',
        data: {
          requestId: trainingRequest.requestId,
          name: trainingRequest.name,
          email: trainingRequest.email,
          deletedAt: formatDate(new Date()),
          deletedBy: 'Bytewave Admin'
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete training request error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}