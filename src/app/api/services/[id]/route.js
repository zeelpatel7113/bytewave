import { NextResponse } from 'next/server';
import connectDB from '@/db/connect';
import Service from '@/db/models/Service';

// Helper function to format date
const formatDate = () => {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
};

// GET single service
export async function GET(request) {
  await connectDB();

  try {
    const id = request.url.split('/').pop();
    const service = await Service.findOne({ 
      $or: [
        { serviceId: id },
        { slug: id }
      ]
    });

    if (!service) {
      return NextResponse.json(
        { success: false, message: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: service },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get service error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PUT update service
export async function PUT(request) {
  await connectDB();

  try {
    const id = request.url.split('/').pop();
    const data = await request.json();

    // Find service first
    const service = await Service.findOne({ serviceId: id });
    if (!service) {
      return NextResponse.json(
        { success: false, message: 'Service not found' },
        { status: 404 }
      );
    }

    // Validate keyBenefits if provided
    if (data.keyBenefits) {
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
    }

    // Update service
    const updatedService = await Service.findOneAndUpdate(
      { serviceId: id },
      { 
        ...data,
        updatedAt: formatDate()
      },
      { 
        new: true,
        runValidators: true
      }
    );

    return NextResponse.json(
      { 
        success: true, 
        data: updatedService,
        message: 'Service updated successfully' 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update service error:', error);
    
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
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}

// DELETE service (soft delete)
export async function DELETE(request) {
  await connectDB();

  try {
    const id = request.url.split('/').pop();
    
    // Soft delete by setting isActive to false
    const service = await Service.findOneAndUpdate(
      { serviceId: id },
      { 
        isActive: false,
        updatedAt: formatDate()
      },
      { new: true }
    );

    if (!service) {
      return NextResponse.json(
        { success: false, message: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'Service deleted successfully',
        data: service
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete service error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}