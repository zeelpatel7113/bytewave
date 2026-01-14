import Blog from '@/db/models/Blog';
import connectDB from '@/db/connect';
import { NextResponse } from "next/server";

// for validate create/update blog data
const validateBlogData = (data) => {
  const requiredFields = ["title", "subtitle", "author", "content", "imageUrl", "category"];
  const missing = requiredFields.filter((field) => !data[field] || data[field].toString().trim() === "");
  if (missing.length > 0) {
    return `Missing required field(s): ${missing.join(", ")}`;
  }
  return null;
};

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 5;
    const search = searchParams.get("search") || "";

    const query = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { content: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      blogs,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.log("Error fetching blogs:", error);
    return NextResponse.json(
      { message: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();

    const validationError = validateBlogData(data);
    if (validationError) {
      return Response.json({ message: validationError }, { status: 400 });
    }

    const newBlog = await Blog.create(data);
    return Response.json(newBlog, { status: 201 });
  } catch (err) {
    console.log("Error creating blog:", err);
    return Response.json({ message: "Failed to create blog" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const data = await req.json();

// ✅ Validate
    const validationError = validateBlogData(data);
    if (validationError) {
      return Response.json({ message: validationError }, { status: 400 });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, data, { new: true });
    if (!updatedBlog) {
      return Response.json({ message: "Blog not found" }, { status: 404 });
    }

    return Response.json(updatedBlog, { status: 200 });
  } catch (err) {
    console.error("Error updating blog:", err);
    return Response.json({ message: "Failed to update blog" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) {
      return Response.json({ message: "Blog not found" }, { status: 404 });
    }

    return Response.json({ message: "Blog deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("Error deleting blog:", err);
    return Response.json({ message: "Failed to delete blog" }, { status: 500 });
  }
}