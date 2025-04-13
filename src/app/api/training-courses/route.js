import { NextResponse } from 'next/server';
import connectDB from '@/db/connect';
import TrainingCourse from '@/db/models/TrainingCourse';

// GET all training courses
export async function GET() {
  await connectDB();

  try {
    const courses = await TrainingCourse.find({})
      .sort({ createdAt: -1 });

    return NextResponse.json(
      { 
        success: true, 
        data: courses 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get training courses error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch training courses',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// POST new training course
export async function POST(request) {
  await connectDB();

  try {
    const data = await request.json();
    const currentDateTime = new Date().toDateString(); // Using the provided UTC time

    const course = await TrainingCourse.create({
      ...data,
      createdAt: currentDateTime,
      lastModified: currentDateTime
    });

    return NextResponse.json(
      { 
        success: true, 
        data: course,
        message: 'Training course created successfully' 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create training course error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create training course',
        error: error.message 
      },
      { status: 500 }
    );
  }
}