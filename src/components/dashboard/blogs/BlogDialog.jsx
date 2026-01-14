"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Tiptap from "./Tiptap";
import { DynamicSelect } from "./DynamicSelect";
import axios from "axios";
import { useToast } from "@/components/ui/toast";


const BlogDialog = ({
  open,
  onOpenChange,
  blog,
  fetchBlogs,
  setSelectedBlog,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    author: "",
    imageUrl: "",
    category: "",
    content: "",
    imageFile: null,
  });

  const [categories, setCategories] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Populate form data when editing
useEffect(() => {
  if (blog) {
    // Editing existing blog
    setFormData({
      title: blog.title || "",
      subtitle: blog.subtitle || "",
      author: blog.author || "",
      category: blog.category || "",
      content: blog.content || "",
      imageUrl: blog.imageUrl || "",
      imageFile: null,
    });
    setPreviewUrl(blog.imageUrl || "");
  } else {
    // Creating new blog
    setFormData({
      title: "",
      subtitle: "",
      author: "",
      category: "",
      content: "",
      imageUrl: "",
      imageFile: null,
    });
    setPreviewUrl("");
  }
}, [blog]);


  // Fetch categories from DB
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/blogs/categories");
        const opts = res.data.map((cat) => ({ value: cat, label: cat }));
        setCategories(opts);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    if (open) fetchCategories();
  }, [open]);

  const handleAddNewCategory = async (newCategory) => {
    const exists = categories.some((c) => c.value === newCategory);
    if (!exists) {
      setCategories((prev) => [
        ...prev,
        { value: newCategory, label: newCategory },
      ]);
    }
    setFormData((prev) => ({ ...prev, category: newCategory }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (content) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const validateFile = (file) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type))
      return "Only JPG, JPEG, PNG allowed.";
    if (file.size > 2 * 1024 * 1024) return "File size must be <2MB";
    return null;
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const error = validateFile(file);
    if (error) {
      setUploadError(error);
      setFormData((prev) => ({ ...prev, imageFile: null }));
      setPreviewUrl("");
      return;
    }
    setUploadError("");
    setFormData((prev) => ({ ...prev, imageFile: file }));
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target?.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({ ...prev, imageFile: null, imageUrl: "" }));
    setPreviewUrl("");
    setUploadError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadImage = async (file) => {
    const uploadForm = new FormData();
    uploadForm.append("file", file);
    uploadForm.append("bucket", process.env.NEXT_PUBLIC_CDN_BUCKET);

    const res = await fetch("https://cdn-uploads.vrugle.com/upload", {
      method: "POST",
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_CDN_API_KEY,
        "x-api-secret": process.env.NEXT_PUBLIC_CDN_API_SECRET,
      },
      body: uploadForm,
    });

    if (!res.ok) throw new Error("Image upload failed");
    const result = await res.json();
    return result.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      let imageUrl = formData.imageUrl || "";
      if (formData.imageFile) imageUrl = await uploadImage(formData.imageFile);

      const payload = { ...formData, imageUrl };
      delete payload.imageFile;

      let res;
      if (blog?._id) {
        // Update existing blog
        res = await axios.put(`/api/blogs?id=${blog._id}`, payload);
      } else {
        // Create new blog
        res = await axios.post("/api/blogs", payload);
      }

      if (res.status === 200 || res.status === 201) {
        toast({
          title: "Success",
          description: `Blog ${
            blog?._id ? "updated" : "created"
          } successfully!`,
        });
        fetchBlogs();
        setSelectedBlog(null);
        onOpenChange(false);
        setFormData({
          title: "",
          subtitle: "",
          author: "",
          category: "",
          content: "",
          imageUrl: "",
          imageFile: null,
        });
        setPreviewUrl("");
      }
    } catch (err) {
      console.log(err);
      const errorMessage =
        err.response?.data?.message ||
        err.message || // fallback
        "Something went wrong";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog modal={true} open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl max-h-[90vh] overflow-y-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {blog?._id ? "Edit Blog Post" : "Create New Blog"}
          </DialogTitle>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title Field */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Enter an engaging title..."
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400"
              />
            </div>

            {/* Subtitle Field */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Subtitle <span className="text-red-500">*</span>
              </Label>
              <Input
                name="subtitle"
                required
                value={formData.subtitle}
                onChange={handleInputChange}
                placeholder="Add a subtitle (optional)..."
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400"
              />
            </div>

            {/* Author Field */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Author <span className="text-red-500">*</span>
              </Label>
              <Input
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                required
                placeholder="Enter author name..."
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400"
              />
            </div>

            {/* Category Field */}
            <div className="space-y-2 w-full">
              <DynamicSelect
                label="category"
                value={formData.category}
                placeholder="Select or add category"
                options={categories}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
                onAddNew={handleAddNewCategory}
                required
              />
            </div>

            {/* Image Upload */}
            <div className="col-span-1 md:col-span-2 space-y-3">
              <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Featured Image <span className="text-red-500">*</span>
              </Label>

              {!previewUrl ? (
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    required
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload-enhanced"
                  />
                  <label
                    htmlFor="file-upload-enhanced"
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-300 group bg-gray-50"
                  >
                    <svg
                      className="w-12 h-12 text-gray-400 group-hover:text-blue-500 transition-colors mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Only JPG, JPEG, PNG allowed up to 2MB
                    </p>
                  </label>
                </div>
              ) : (
                <div className="relative group">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full max-w-md h-48 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center max-w-md">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={handleRemoveFile}
                      className="shadow-lg cursor-pointer"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Remove Image
                    </Button>
                  </div>
                </div>
              )}

              {uploadError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <svg
                    className="w-5 h-5 text-red-500 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-red-700 text-sm font-medium">
                    {uploadError}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <svg
                className="w-4 h-4 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Content <span className="text-red-500">*</span>
            </Label>
            <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200">
              <Tiptap value={formData.content} onChange={handleContentChange} />
            </div>
          </div>

          <DialogFooter className="border-t pt-2 mt-4 bg-gray-50 -mx-6 -mb-6 px-6 pb-2 rounded-b-lg flex flex-col-reverse sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="transition-all duration-200 hover:bg-gray-100 hover:border-gray-400 w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all duration-200 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {blog?._id ? "Updating..." : "Creating..."}
                </span>
              ) : blog?._id ? (
                "Update Blog"
              ) : (
                "Create Blog"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BlogDialog;
