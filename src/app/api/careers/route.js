import { NextResponse } from 'next/server';
import connectDB from '@/db/connect';
import Career from '@/db/models/Career';

export async function POST(request) {
  await connectDB();

  try {
    const data = await request.json();

    const career = await Career.create({
      ...data,
      createdAt: new Date().toDateString(),
      status: "pending",
      statusHistory: [
        {
          status: "pending",
          note: "Application submitted",
          updatedAt: new Date().toDateString(),
          updatedBy: "Bytewave Admin"
        }
      ]
    });

    return NextResponse.json(
      { 
        success: true, 
        data: career,
        message: 'Application submitted successfully' 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create career application error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to submit application',
        error: error.message 
      },
      { status: 500 }
    );
  }
}
export async function GET() {
    await connectDB();
  
    try {
      const applications = await Career.find({})
        .sort({ createdAt: -1 });
  
      return NextResponse.json(
        { 
          success: true, 
          data: applications 
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('Get career applications error:', error);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to fetch applications',
          error: error.message 
        },
        { status: 500 }
      );
    }
  }