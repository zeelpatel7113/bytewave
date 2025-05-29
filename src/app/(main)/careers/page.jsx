"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CareerGrid from "@/components/careers/CareerGrid";
import CareerForm from "@/components/careers/CareerForm";

const CareersPage = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleApplyNow = (job) => {
    setSelectedJob(job);
    document.getElementById("application-form").scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-900 rounded-full animate-spin border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
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
            Career
          </motion.h1>
          <motion.p
            className="text-xl sm:text-2xl max-w-3xl opacity-80 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Connecting business audiences with business buyers and sellers through
            content solutions, lead generation, newsletters, print and online
            advertising, social media and content driven sponsorship.
          </motion.p>
        </div>
      </motion.div>

      <CareerGrid onApply={handleApplyNow} setJobs={setJobs} />
      <CareerForm selectedJob={selectedJob} availableJobs={jobs} />
    </div>
  );
};

export default CareersPage;