"use client";
import React from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Building } from "lucide-react";

const CareerCard = ({ job, index, onApply }) => {
  if (!job) return null;

  // Destructure job properties with proper names from schema
  const {
    careerType = '', // Changed from 'type'
    position = '', // Changed from 'title'
    description = '',
    experienceLevel = '', // Changed from 'level'
    experienceRange = '', // New virtual field
    coreSkills = [], // Changed from 'skills'
    projectType = '', // Changed from 'workType'
    jobLocation = '', // Changed from 'location'
  } = job;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white p-6 rounded-xl border border-gray-300 hover:shadow-sm transition-all duration-300"
    >
      <span className="text-blue-600 text-sm font-medium">
        {careerType}
      </span>
      <h3 className="text-xl font-bold text-gray-900 mt-2 mb-3">
        {position}
      </h3>
      <p className="text-gray-600 text-sm mb-6">{description}</p>

      <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-zinc-300">
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-900 font-medium text-lg">
            {experienceLevel.charAt(0).toUpperCase() + experienceLevel.slice(1).replace('-', ' ')}
          </span>
          <span className="text-blue-600 text-sm">
            {experienceRange}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.isArray(coreSkills) && coreSkills.map((skillObj, idx) => (
            <motion.span
              key={`${skillObj.skill}-${idx}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="px-3 py-1.5 bg-blue-50 text-zinc-600 rounded-lg text-sm border border-blue-300 transition-all duration-300"
            >
              {skillObj.skill}
            </motion.span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{projectType.replace('-', ' ')}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          {jobLocation === "remote" ? (
            <MapPin className="w-4 h-4" />
          ) : (
            <Building className="w-4 h-4" />
          )}
          <span>{jobLocation.charAt(0).toUpperCase() + jobLocation.slice(1)}</span>
        </div>
      </div>

      <button
        onClick={() => onApply(job)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        Apply Now
        <span>→</span>
      </button>
    </motion.div>
  );
};

export default CareerCard;