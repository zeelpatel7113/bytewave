import connectDB from '@/db/connect';
import { NextResponse } from 'next/server';


export async function GET() {
  try {
    await connectDB();
    const response = NextResponse.json({
      message: 'Database connection successful',
    });
    return response;
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { message: 'Database connection failed' },
      { status: 500 }
    );
  }
}