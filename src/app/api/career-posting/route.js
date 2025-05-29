import { NextResponse } from 'next/server';
import connectDB from '@/db/connect';
import CareerPosting from '@/db/models/CareerPosting';

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

// Helper function to format career posting data
const formatCareerData = (posting) => {
  const postingObj = posting.toObject({ virtuals: true }); // Include virtual fields
  return {
    ...postingObj,
    createdAt: formatDate(postingObj.createdAt),
    updatedAt: formatDate(postingObj.updatedAt)
  };
};

// GET all career postings
export async function GET(request) {
  await connectDB();

  try {
    // Get query parameters
    const url = new URL(request.url);
    const isActive = url.searchParams.get('isActive');
    const experienceLevel = url.searchParams.get('experienceLevel');
    const projectType = url.searchParams.get('projectType');
    const jobLocation = url.searchParams.get('jobLocation');

    // Build query
    const query = {};
    if (isActive !== null) query.isActive = isActive === 'true';
    if (experienceLevel) query.experienceLevel = experienceLevel;
    if (projectType) query.projectType = projectType;
    if (jobLocation) query.jobLocation = jobLocation;

    const postings = await CareerPosting.find(query)
      .sort({ createdAt: -1 });

    const formattedPostings = postings.map(formatCareerData);

    return NextResponse.json(
      { 
        success: true, 
        data: formattedPostings 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get career postings error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch career postings',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// POST new career posting
export async function POST(request) {
  await connectDB();

  try {
    const data = await request.json();

    // Validate required fields
    const requiredFields = ['careerType', 'position', 'description', 'experienceLevel', 'projectType', 'jobLocation'];
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

    // Validate enums
    const validExperienceLevels = ['senior', 'mid-senior', 'mid', 'entry-level', 'intern'];
    const validProjectTypes = ['full-time', 'contract', 'part-time', 'internship'];
    const validJobLocations = ['remote', 'hybrid', 'onsite'];

    if (!validExperienceLevels.includes(data.experienceLevel)) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid experience level. Must be one of: ${validExperienceLevels.join(', ')}`
        },
        { status: 400 }
      );
    }

    if (!validProjectTypes.includes(data.projectType)) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid project type. Must be one of: ${validProjectTypes.join(', ')}`
        },
        { status: 400 }
      );
    }

    if (!validJobLocations.includes(data.jobLocation)) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid job location. Must be one of: ${validJobLocations.join(', ')}`
        },
        { status: 400 }
      );
    }

    const posting = await CareerPosting.create({
      ...data,
      isActive: true
    });

    const formattedPosting = formatCareerData(posting);

    return NextResponse.json(
      { 
        success: true, 
        data: formattedPosting,
        message: 'Career posting created successfully' 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create career posting error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create career posting',
        error: error.message 
      },
      { status: 500 }
    );
  }
}