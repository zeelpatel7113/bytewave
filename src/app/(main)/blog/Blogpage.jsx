"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Blogbar from "@/components/Blog/Blogbar";
import BlogCard from "@/components/Blog/BlogCard";

const Page = () => {
  const [blogs, setBlogs] = useState([]); // ✅ hold blogs fetched from API
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/blogs");
        const data = await res.json();
        console.log(data);
        
        setBlogs(data.blogs || []);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    }
    fetchData();
  }, []);

  // ✅ Use fetched blogs instead of static import
  const filteredPosts = blogs.filter((post) => {
    const matchesSearch =
      [post.title, post.category, post.author]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesFilter = filter === "All" || post.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      {/* Hero Section */}
      <motion.div
        className="bg-gray-900 text-white py-40 px-4 sm:px-6 lg:px-8 rounded-b-[40px]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h1
            className="text-5xl sm:text-6xl lg:text-8xl font-bold mb-16 mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Blogs
          </motion.h1>
          <motion.p
            className="text-xl sm:text-2xl max-w-3xl opacity-80 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Discover insights, trends, and ideas with the Bytewave Blog — your
            source for growth and inspiration.
          </motion.p>
        </div>
      </motion.div>

      {/* Blogbar (Search + Filter) */}
      <Blogbar onSearch={setSearch} onFilter={setFilter} />

      {/* Blog Cards */}
      <br />
      <br />
      <br />
      <div className="p-6 space-y-8">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, index) => (
            <BlogCard key={index} data={post} reverse={index % 2 !== 0} />
          ))
        ) : (
          <p className="text-center text-gray-600 mt-10">No blogs found.</p>
        )}
      </div>
    </div>
  );
};

export default Page;
