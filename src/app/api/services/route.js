import { NextResponse } from 'next/server';
import connectDB from '@/db/connect';
import Service from '@/db/models/Service';

// Helper function to format date
const formatDate = () => {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
};

// Helper function to generate serviceId
const generateServiceId = async () => {
  const count = await Service.countDocuments();
  return `SRV-${(count + 1).toString().padStart(3, '0')}`;
};

// GET all services
export async function GET() {
  await connectDB();

  try {
    const services = await Service.find({ isActive: true })
      .sort({ createdAt: -1 });

    return NextResponse.json(
      { 
        success: true, 
        data: services 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get services error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch services',
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// POST new service
export async function POST(request) {
  await connectDB();

  try {
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'overview', 'keyBenefits', 'approach', 'imageUrl'];
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

    // Validate keyBenefits
    if (!Array.isArray(data.keyBenefits) || 
        data.keyBenefits.length < 1 || 
        data.keyBenefits.length > 4) {
      return NextResponse.json(
        {
          success: false,
          message: 'Key benefits must have between 1 and 4 points'
        },
        { status: 400 }
      );
    }

    // Generate serviceId
    const serviceId = await generateServiceId();
    const currentDateTime = formatDate();

    const service = await Service.create({
      ...data,
      serviceId,
      createdBy: 'Bytewave Admin',
      createdAt: currentDateTime,
      updatedAt: currentDateTime
    });

    return NextResponse.json(
      { 
        success: true, 
        data: service,
        message: 'Service created successfully' 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create service error:', error);
    
    // Handle duplicate title error
    if (error.code === 11000 && error.keyPattern?.title) {
      return NextResponse.json(
        {
          success: false,
          message: 'A service with this title already exists'
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create service',
        error: error.message 
      },
      { status: 500 }
    );
  }
}