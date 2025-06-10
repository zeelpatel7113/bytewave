"use client";
import React, { useState, useEffect } from "react";
import CareerCard from "./CareerCard";
import { getCareerPostings } from "@/utils/career-api";

const CareerGrid = ({ onApply, onJobsUpdate }) => {
  const [jobs, setJobs] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("View all");
  const [filters, setFilters] = useState(["View all"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await getCareerPostings();
        
        if (response.success && Array.isArray(response.data)) {
          const jobsData = response.data.map(job => ({
            ...job,
            coreSkills: job.coreSkills || [], // Ensure coreSkills exists
            careerType: job.careerType || 'Other', // Ensure careerType exists
            experienceRange: job.experienceRange || `${job.experienceLevel} level`, // Use virtual field or fallback
            // Format the existing fields properly
            projectType: job.projectType?.toLowerCase() || 'full-time',
            jobLocation: job.jobLocation?.toLowerCase() || 'onsite',
            experienceLevel: job.experienceLevel?.toLowerCase() || 'mid'
          }));

          setJobs(jobsData);
          onJobsUpdate?.(jobsData);

          // Extract unique career types
          const types = jobsData
            .map(job => job.careerType)
            .filter(Boolean);
          const uniqueTypes = Array.from(new Set(types));
          setFilters(["View all", ...uniqueTypes]);
        } else {
          setError("Invalid data format received from server");
          setJobs([]);
          onJobsUpdate?.([]);
        }
      } catch (error) {
        console.error("Failed to fetch career postings:", error);
        setError("Failed to load career postings");
        setJobs([]);
        onJobsUpdate?.([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [onJobsUpdate]);

  // Filter jobs based on career type
  const filteredJobs = jobs.filter(job => 
    selectedFilter === "View all" || job.careerType === selectedFilter
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center text-red-600">
          {error}
        </div>
      </div>
    );
  }

return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-12">
        {filters.map((filter, index) => (
          <button
            key={`${filter}-${index}`}
            onClick={() => setSelectedFilter(filter)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedFilter === filter
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Job Listings */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
          {filteredJobs.map((job, index) => (
            <CareerCard
              key={job._id || `job-${index}`}
              job={job}
              index={index}
              onApply={onApply}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          No career opportunities available at the moment.
        </div>
      )}
    </div>
  );
};

export default CareerGrid;