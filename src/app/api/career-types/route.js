import { NextResponse } from 'next/server';
import connectDB from '@/db/connect';
import CareerPosting from '@/db/models/CareerPosting';

export async function GET() {
  await connectDB();

  try {
    // Fetch unique career types from existing postings
    const careerTypes = await CareerPosting.distinct('careerType');
    
    return NextResponse.json({
      success: true,
      data: careerTypes.filter(type => type)
    });
  } catch (error) {
    console.error('Get career types error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch career types' },
      { status: 500 }
    );
  }
}