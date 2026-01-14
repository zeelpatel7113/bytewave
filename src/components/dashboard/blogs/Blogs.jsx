"use client";

import React, { useEffect, useState } from "react";
import BlogDialog from "./BlogDialog";
import { DeleteBlogDialog } from "./DeleteBlogDialog";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Plus,
  Search,
  Tag,
  Trash2,
  User,
} from "lucide-react";

const Blogs = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteBlogId, setDeleteBlogId] = useState(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/blogs?page=${page}&limit=5&search=${encodeURIComponent(search)}`
      );
      const data = await res.json();
      setBlogs(data.blogs || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [page, search]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setOpenDialog(true);
  };

  const handleCreate = () => {
    setSelectedBlog(null);
    setOpenDialog(true);
  };

  const handleDelete = (id) => {
    setDeleteBlogId(id);
    setDeleteDialog(true);
  };

  const handleDeleted = (id) => {
    setBlogs((prev) => prev.filter((b) => b._id !== id));
  };

  const handlePrev = () => setPage(Math.max(1, page - 1));
  const handleNext = () => setPage(Math.min(totalPages, page + 1));

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-5">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
            Blog Dashboard
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Manage and organize your content
          </p>
        </div>

        {/* Search and Add Section */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search blogs by title, author, or category..."
              value={search}
              onChange={handleSearchChange}
              className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
            />
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/30 whitespace-nowrap text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Add Blog</span>
          </button>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 text-lg">No blogs found.</p>
            <p className="text-gray-500 text-sm mt-2">
              Try adjusting your search or create a new blog.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Image Section */}
                {blog.imageUrl && (
                  <div className="relative h-44 sm:h-48 overflow-hidden bg-gray-200">
                    <img
                      src={blog.imageUrl}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 shadow-sm">
                        <Tag className="w-3 h-3" />
                        {blog.category}
                      </span>
                    </div>
                  </div>
                )}

                {/* Content Section */}
                <div className="flex flex-col flex-1 p-4 sm:p-5">
                  {/* Title and Subtitle */}
                  <div className="mb-3">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {blog.title}
                    </h3>
                    {blog.subtitle && (
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {blog.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center gap-2 mb-3 text-xs sm:text-sm text-gray-500">
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>{blog.author}</span>
                  </div>

                  {/* Content Preview */}
                  <div
                    className="text-sm text-gray-700 mb-4 line-clamp-3 flex-1"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />

                  {/* Dates */}
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Created: {formatDate(blog.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Updated: {formatDate(blog.updatedAt)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-lg font-medium transition-all text-sm"
                    >
                      <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors text-sm shadow-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {blogs.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-10">
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 border border-gray-300 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 disabled:hover:bg-white text-sm sm:text-base"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm">
              <span className="text-sm sm:text-base font-medium text-gray-700">
                Page <span className="text-blue-600">{page}</span> of{" "}
                {totalPages}
              </span>
            </div>
            <button
              onClick={handleNext}
              disabled={page === totalPages}
              className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 border border-gray-300 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 disabled:hover:bg-white text-sm sm:text-base"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Dialogs placeholders */}

      <BlogDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        blog={selectedBlog}
        fetchBlogs={fetchBlogs}
        setSelectedBlog={setSelectedBlog}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteBlogDialog
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        blogId={deleteBlogId}
        onDeleted={handleDeleted}
      />
    </div>
  );
};

export default Blogs;
