import { NextResponse } from "next/server";
import connectDB from "@/db/connect";
import TrainingRequest from "@/db/models/TrainingRequest";
// import TrainingCourse from '@/db/models/Training';
import mongoose from "mongoose";

// Helper function to format date
const formatDate = (date) => {
  if (!date) return null;
  try {
    return new Date(date).toISOString().slice(0, 19).replace("T", " ");
  } catch (error) {
    console.error("Date formatting error:", error);
    return null;
  }
};

// Helper function to format training request data
const formatTrainingRequestData = (request) => {
  const requestObj = request.toObject();
  return {
    ...requestObj,
    createdAt: formatDate(requestObj.createdAt),
    updatedAt: formatDate(requestObj.updatedAt),
    statusHistory: requestObj.statusHistory.map((history) => ({
      ...history,
      updatedAt: formatDate(history.updatedAt),
    })),
  };
};

// Helper function to generate requestId
const generateRequestId = async () => {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, "");
  const count = await TrainingRequest.countDocuments();
  const randomSuffix = Math.random().toString(36).substring(2, 5);
  return `TR-${timestamp}-${(count + 1)
    .toString()
    .padStart(3, "0")}-${randomSuffix}`;
};

// GET all training requests
export async function GET() {
  await connectDB();

  try {
    const requests = await TrainingRequest.find({})
      .populate({
        path: "courseId",
        // Update these field names to match your TrainingCourse model
        select: "title trainingId",
        model: "TrainingCourse", // Make sure this matches your model name
      })
      .sort({ createdAt: -1 });

    const formattedRequests = requests.map((request) => {
      const requestObj = request.toObject();

      // Check if courseId exists and was populated
      const courseData = request.courseId
        ? {
            _id: request.courseId._id.toString(),
            title: request.courseId.title || "Untitled Course",
            trainingId: request.courseId.trainingId || "No ID",
          }
        : null;

      return {
        ...requestObj,
        // Include the populated course data
        courseId: courseData,
        createdAt: formatDate(requestObj.createdAt),
        updatedAt: formatDate(requestObj.updatedAt),
        statusHistory: requestObj.statusHistory.map((history) => ({
          ...history,
          updatedAt: formatDate(history.updatedAt),
        })),
      };
    });

    return NextResponse.json(
      {
        success: true,
        data: formattedRequests,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get training requests error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch training requests",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST new training request
export async function POST(request) {
  await connectDB();

  try {
    const data = await request.json();
    const now = new Date();

    // Check for duplicate submission by submission ID
    if (data.submissionId) {
      // Look for a submission with this ID in the last 30 seconds
      const thirtySecondsAgo = new Date(now.getTime() - 30000);
      const existingSubmission = await TrainingRequest.findOne({
        submissionId: data.submissionId,
      });

      if (existingSubmission) {
        console.log(
          "Duplicate training submission detected by ID:",
          data.submissionId
        );
        return NextResponse.json(
          {
            success: true, // Return success to avoid client retries
            data: formatTrainingRequestData(existingSubmission),
            message: "Request already processed",
          },
          { status: 200 }
        );
      }
    }

    // Generate requestId
    const requestId = await generateRequestId();

    // Handle courseId conversion if needed
    let courseIdToUse = undefined;
    if (data.courseId) {
      try {
        // Handle different formats of courseId
        if (typeof data.courseId === "string") {
          courseIdToUse = new mongoose.Types.ObjectId(data.courseId);
        } else if (data.courseId._id) {
          courseIdToUse = new mongoose.Types.ObjectId(data.courseId._id);
        }
      } catch (error) {
        console.warn(
          "Invalid courseId format, continuing without courseId:",
          error
        );
      }
    }

    // Create training request with initial status
    const trainingRequest = await TrainingRequest.create({
      ...data,
      requestId,
      submissionId: data.submissionId, // Store the submission ID
      courseId: courseIdToUse,
      statusHistory: [
        {
          status: "pending",
          notes: "Training request submitted",
          updatedAt: now,
          updatedBy: "Bytewave Admin",
        },
      ],
    });

    await trainingRequest.populate(
      "courseId",
      "courseName courseType level duration location"
    );
    const formattedRequest = formatTrainingRequestData(trainingRequest);

    return NextResponse.json(
      {
        success: true,
        data: formattedRequest,
        message: "Training request submitted successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create training request error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to submit training request",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
