import { NextResponse } from 'next/server';
import connectDB from '@/db/connect';
import TrainingCourse from '@/db/models/Training';

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

// Helper function to format training course data
const formatTrainingData = (course) => {
  const courseObj = course.toObject();
  return {
    ...courseObj,
    createdAt: formatDate(courseObj.createdAt),
    updatedAt: formatDate(courseObj.updatedAt)
  };
};

// GET single training course
export async function GET(request) {
  await connectDB();

  try {
    const id = request.url.split('/').pop();
    const course = await TrainingCourse.findOne({ trainingId: id });

    if (!course) {
      return NextResponse.json(
        { success: false, message: 'Training course not found' },
        { status: 404 }
      );
    }

    const formattedCourse = formatTrainingData(course);

    return NextResponse.json(
      { success: true, data: formattedCourse },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get training course error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PUT update training course
export async function PUT(request) {
  await connectDB();

  try {
    const id = request.url.split('/').pop();
    const data = await request.json();

    // Validate whatYouWillLearn if provided
    if (data.whatYouWillLearn && data.whatYouWillLearn.length > 4) {
      return NextResponse.json(
        {
          success: false,
          message: 'Learning points cannot exceed 4 items'
        },
        { status: 400 }
      );
    }

    const course = await TrainingCourse.findOneAndUpdate(
      { trainingId: id },
      { 
        ...data,
        updatedAt: new Date()
      },
      { 
        new: true,
        runValidators: true
      }
    );

    if (!course) {
      return NextResponse.json(
        { success: false, message: 'Training course not found' },
        { status: 404 }
      );
    }

    const formattedCourse = formatTrainingData(course);

    return NextResponse.json(
      { 
        success: true, 
        data: formattedCourse,
        message: 'Training course updated successfully' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update training course error:', error);
    
    // Handle duplicate title error
    if (error.code === 11000 && error.keyPattern?.title) {
      return NextResponse.json(
        {
          success: false,
          message: 'A course with this title already exists'
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}

// DELETE training course (soft delete)
export async function DELETE(request) {
  await connectDB();

  try {
    const id = request.url.split('/').pop();
    
    // Soft delete by setting isActive to false
    const course = await TrainingCourse.findOneAndUpdate(
      { trainingId: id },
      { 
        isActive: false,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!course) {
      return NextResponse.json(
        { success: false, message: 'Training course not found' },
        { status: 404 }
      );
    }

    const formattedCourse = formatTrainingData(course);

    return NextResponse.json(
      { 
        success: true,
        message: 'Training course deleted successfully',
        data: {
          trainingId: formattedCourse.trainingId,
          title: formattedCourse.title,
          deletedAt: formatDate(new Date()),
          deletedBy: 'Bytewave Admin'
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete training course error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}