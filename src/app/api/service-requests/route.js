import { NextResponse } from "next/server";
import connectDB from "@/db/connect";
import ServiceRequest from "@/db/models/ServiceRequest";
import mongoose from "mongoose";

// Helper function to format date
const formatDate = (date) => {
  if (!date) return null;
  try {
    return new Date(date).toISOString().slice(0, 19).replace("T", " ");
  } catch (error) {
    console.warn("Date formatting error:", error);
    return null;
  }
};

// Helper function to format service request data
const formatServiceRequestData = (request) => {
  const requestObj = request.toObject({ virtuals: true, getters: true });

  // Handle null serviceId case
  const serviceData = request.serviceId
    ? {
        _id: request.serviceId._id.toString(),
        serviceId: request.serviceId.serviceId,
        title: request.serviceId.title,
      }
    : null;

  return {
    ...requestObj,
    _id: requestObj._id.toString(),
    serviceId: serviceData, // Will be null if no service was selected
    createdAt: formatDate(requestObj.createdAt),
    updatedAt: formatDate(requestObj.updatedAt),
    statusHistory: requestObj.statusHistory.map((history) => ({
      ...history,
      updatedAt: formatDate(history.updatedAt),
    })),
  };
};

// Helper function to generate requestId with retry mechanism
const generateRequestId = async (retryCount = 0) => {
  try {
    const timestamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[-:T]/g, "");
    const count = await ServiceRequest.countDocuments();
    const randomSuffix = Math.random().toString(36).substring(2, 5);
    const requestId = `REQ-${timestamp}-${(count + 1)
      .toString()
      .padStart(3, "0")}-${randomSuffix}`;

    // Check if this ID already exists
    const existing = await ServiceRequest.findOne({ requestId });
    if (existing && retryCount < 3) {
      // Retry with incremented count
      return generateRequestId(retryCount + 1);
    }

    return requestId;
  } catch (error) {
    console.error("Error generating requestId:", error);
    // Fallback to timestamp-based ID if all else fails
    return `REQ-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  }
};

// GET all service requests
export async function GET() {
  await connectDB();

  try {
    const serviceRequests = await ServiceRequest.find({})
      .populate({
        path: "serviceId",
        select: "title serviceId _id",
      })
      .sort({ createdAt: -1 });

    const formattedRequests = serviceRequests.map(formatServiceRequestData);

    return NextResponse.json(
      {
        success: true,
        data: formattedRequests,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get service requests error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch service requests",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST new service request
export async function POST(request) {
  await connectDB();

  try {
    const data = await request.json();
    const now = new Date();

    // Generate unique requestId
    const requestId = await generateRequestId();

    // Handle serviceId conversion
    let serviceIdToUse = undefined;
    if (data.serviceId) {
      try {
        serviceIdToUse =
          typeof data.serviceId === "string"
            ? new mongoose.Types.ObjectId(data.serviceId)
            : data.serviceId._id
            ? new mongoose.Types.ObjectId(data.serviceId._id)
            : undefined;
      } catch (error) {
        console.warn("Invalid serviceId format, continuing without serviceId");
      }
    }

    // Prepare the service request data
    const serviceRequestData = {
      requestId,
      name: data.name || "",
      email: data.email || "",
      phone: data.phone || "",
      message: data.message || "",
      serviceId: serviceIdToUse,
      isPartial: data.isPartial || false,
      submittedAt: data.submittedAt || formatDate(now),
      submittedBy: data.submittedBy || "Anonymous",
      statusHistory: [
        {
          status: data.isPartial ? "partial" : "draft",
          note: data.isPartial
            ? "Partial service request saved"
            : "Service request created",
          updatedAt: now,
          updatedBy: data.submittedBy || "Anonymous",
        },
      ],
    };

    // Create the service request
    const serviceRequest = await ServiceRequest.create(serviceRequestData);

    // Populate service details if serviceId exists
    if (serviceIdToUse) {
      await serviceRequest.populate("serviceId", "title serviceId");
    }

    const formattedRequest = formatServiceRequestData(serviceRequest);

    return NextResponse.json(
      {
        success: true,
        data: formattedRequest,
        message: data.isPartial
          ? "Partial service request saved successfully"
          : "Service request created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create service request error:", error);

    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "Duplicate request ID, please try again",
          error: "Duplicate key error",
        },
        { status: 409 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create service request",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
