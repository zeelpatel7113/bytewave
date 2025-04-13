import { NextResponse } from 'next/server';
import connectDB from '@/db/connect';
import TrainingCourse from '@/db/models/TrainingCourse';

// GET single training course
export async function GET(request) {
  await connectDB();

  try {
    const id = request.url.split('/').pop();
    
    const course = await TrainingCourse.findById(id);

    if (!course) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Training course not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        data: course 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get training course error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch training course',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// PUT/UPDATE training course
export async function PUT(request) {
  await connectDB();

  try {
    const id = request.url.split('/').pop();
    const data = await request.json();
    const currentDateTime = new Date().toDateString(); // Using the provided UTC time

    const course = await TrainingCourse.findByIdAndUpdate(
      id,
      {
        ...data,
        lastModified: currentDateTime
      },
      { new: true, runValidators: true }
    );

    if (!course) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Training course not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        data: course,
        message: 'Training course updated successfully' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update training course error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update training course',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// DELETE training course
export async function DELETE(request) {
  await connectDB();

  try {
    const id = request.url.split('/').pop();
    
    const course = await TrainingCourse.findByIdAndDelete(id);

    if (!course) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Training course not found' 
        },
        { status: 404 }
      );
    }

    const deletionRecord = {
      timestamp: new Date().toDateString(),
      deletedBy: 'Bytewave Admin',
      courseDetails: {
        id: course._id.toString(),
        title: course.title,
        category: course.category
      }
    };

    return NextResponse.json(
      { 
        success: true, 
        message: 'Training course deleted successfully',
        deletionDetails: deletionRecord
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete training course error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to delete training course',
        error: error.message 
      },
      { status: 500 }
    );
  }
}