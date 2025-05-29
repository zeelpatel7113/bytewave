import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import connectDB from '@/db/connect';
import User from '@/db/models/User';

export async function GET(req) {
  try {
    const token = req.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ admin: null });
    }

    const decoded = verifyToken(token);
    if (!decoded.isAdmin) {
      return NextResponse.json({ admin: null });
    }

    await connectDB();
    
    const admin = await User.findById(decoded.userId).select('-password');
    
    if (!admin || !admin.isAdmin) {
      return NextResponse.json({ admin: null });
    }

    return NextResponse.json({
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ admin: null });
  }
}