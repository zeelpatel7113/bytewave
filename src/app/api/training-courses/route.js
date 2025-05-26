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

// Helper function to generate trainingId
const generateTrainingId = async () => {
  const count = await TrainingCourse.countDocuments();
  return `TRN-${(count + 1).toString().padStart(3, '0')}`;
};

// GET all training courses
export async function GET() {
  await connectDB();

  try {
    const courses = await TrainingCourse.find({ isActive: true })
      .sort({ createdAt: -1 });

    const formattedCourses = courses.map(formatTrainingData);

    return NextResponse.json(
      { 
        success: true, 
        data: formattedCourses 
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
    
    // Validate required fields
    const requiredFields = ['title', 'overview', 'courseStructure', 'imageUrl', 'category'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Missing required fields: ${missingFields.join(', ')}`
        },
        { status: 400 }
      );
    }

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

    // Generate trainingId
    const trainingId = await generateTrainingId();

    const course = await TrainingCourse.create({
      ...data,
      trainingId,
      createdBy: 'Bytewave Admin'
    });

    const formattedCourse = formatTrainingData(course);

    return NextResponse.json(
      { 
        success: true, 
        data: formattedCourse,
        message: 'Training course created successfully' 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create training course error:', error);
    
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
      { 
        success: false, 
        message: 'Failed to create training course',
        error: error.message 
      },
      { status: 500 }
    );
  }
}