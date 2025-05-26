import { NextResponse } from 'next/server';
import connectDB from '@/db/connect';
import CareerPosting from '@/db/models/CareerPosting';
import { ObjectId } from 'mongodb';

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

// GET single career posting
export async function GET(request) {
  await connectDB();

  try {
    const id = request.url.split('/').pop();
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid career posting ID' },
        { status: 400 }
      );
    }

    const posting = await CareerPosting.findById(id);

    if (!posting) {
      return NextResponse.json(
        { success: false, message: 'Career posting not found' },
        { status: 404 }
      );
    }

    const formattedPosting = formatCareerData(posting);

    return NextResponse.json(
      { success: true, data: formattedPosting },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get career posting error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PUT update career posting
export async function PUT(request) {
  await connectDB();

  try {
    const id = request.url.split('/').pop();
    const data = await request.json();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid career posting ID' },
        { status: 400 }
      );
    }

    // Validate enums if provided
    if (data.experienceLevel) {
      const validExperienceLevels = ['senior', 'mid-senior', 'mid', 'entry-level', 'intern'];
      if (!validExperienceLevels.includes(data.experienceLevel)) {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid experience level. Must be one of: ${validExperienceLevels.join(', ')}`
          },
          { status: 400 }
        );
      }
    }

    if (data.projectType) {
      const validProjectTypes = ['full-time', 'contract', 'part-time', 'internship'];
      if (!validProjectTypes.includes(data.projectType)) {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid project type. Must be one of: ${validProjectTypes.join(', ')}`
          },
          { status: 400 }
        );
      }
    }

    if (data.jobLocation) {
      const validJobLocations = ['remote', 'hybrid', 'onsite'];
      if (!validJobLocations.includes(data.jobLocation)) {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid job location. Must be one of: ${validJobLocations.join(', ')}`
          },
          { status: 400 }
        );
      }
    }

    const posting = await CareerPosting.findByIdAndUpdate(
      id,
      { ...data },
      { 
        new: true,
        runValidators: true
      }
    );

    if (!posting) {
      return NextResponse.json(
        { success: false, message: 'Career posting not found' },
        { status: 404 }
      );
    }

    const formattedPosting = formatCareerData(posting);

    return NextResponse.json(
      { 
        success: true, 
        data: formattedPosting,
        message: 'Career posting updated successfully' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update career posting error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(request) {
  await connectDB();

  try {
    const id = request.url.split('/').pop();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid career posting ID' },
        { status: 400 }
      );
    }

    // Hard delete the career posting
    const posting = await CareerPosting.findByIdAndDelete(id);

    if (!posting) {
      return NextResponse.json(
        { success: false, message: 'Career posting not found' },
        { status: 404 }
      );
    }

    const formattedPosting = formatCareerData(posting);

    return NextResponse.json(
      { 
        success: true,
        message: 'Career posting permanently deleted',
        data: {
          id: formattedPosting._id,
          position: formattedPosting.position,
          careerType: formattedPosting.careerType,
          deletedAt: formatDate(new Date()),
          deletedBy: 'Bytewave Admin' // hardcoded current user
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete career posting error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}