import connectDB from '@/db/connect';
import Blog from "@/db/models/Blog";

export async function GET(params) {
    await connectDB();
    const categories = await Blog.distinct("category")
    return Response.json(categories || []);
}