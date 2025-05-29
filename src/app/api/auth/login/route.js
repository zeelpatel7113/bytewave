import { NextResponse } from 'next/server';
import connectDB from '@/db/connect';
import User from '@/db/models/User';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    await connectDB();
    
    const { email, password } = await req.json();

    const admin = await User.findOne({ email, isAdmin: true });
    if (!admin) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create token
    const token = jwt.sign(
      { userId: admin._id, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const response = NextResponse.json({
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
      },
      message: 'Login successful',
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, 
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}