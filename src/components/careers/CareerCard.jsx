"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Building, ChevronDown, ChevronUp } from "lucide-react";

const CareerCard = ({ job, index, onApply }) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isSkillsExpanded, setIsSkillsExpanded] = useState(false);
  
  if (!job) return null;

  const {
    careerType = '',
    position = '',
    description = '',
    experienceLevel = '',
    experienceRange = '',
    coreSkills = [],
    projectType = '',
    jobLocation = '',
  } = job;

  // Much shorter description length
  const MAX_DESCRIPTION_LENGTH = 45;
  const MAX_SKILLS_DISPLAY = 3;
  
  const isDescriptionLong = description.length > MAX_DESCRIPTION_LENGTH;
  const isSkillsLong = coreSkills.length > MAX_SKILLS_DISPLAY;

  // Current timestamp and user
  const statusUpdate = {
    status: "viewed",
    notes: "Career card expanded",
    updatedAt: "2025-06-10 12:23:37",
    updatedBy: "Bytewave Admin"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-white p-6 rounded-xl border border-gray-300 hover:shadow-sm transition-all duration-300 
        ${isDescriptionExpanded ? 'md:col-span-2 lg:col-span-3' : ''}`}
      style={{ minHeight: isDescriptionExpanded ? 'auto' : '380px' }} // Significantly reduced height
    >
      <span className="text-blue-600 text-sm font-medium">
        {careerType}
      </span>
      <h3 className="text-xl font-bold text-gray-900 mt-2 mb-3">
        {position}
      </h3>
      
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={isDescriptionExpanded ? 'expanded' : 'collapsed'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-gray-600 text-sm mb-2">
              {isDescriptionExpanded ? description : (
                isDescriptionLong ? `${description.slice(0, MAX_DESCRIPTION_LENGTH)}...` : description
              )}
            </p>
          </motion.div>
        </AnimatePresence>

        {isDescriptionLong && (
          <button
            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
            className="text-blue-600 text-sm font-medium flex items-center gap-1 mb-3 hover:text-blue-700 transition-colors"
          >
            {isDescriptionExpanded ? (
              <>Read Less <ChevronUp className="w-4 h-4" /></>
            ) : (
              <>Read More <ChevronDown className="w-4 h-4" /></>
            )}
          </button>
        )}
      </div>

      <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-zinc-300">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-900 font-medium text-lg">
            {experienceLevel.charAt(0).toUpperCase() + experienceLevel.slice(1).replace('-', ' ')}
          </span>
          <span className="text-blue-600 text-sm">
            {experienceRange}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={isSkillsExpanded ? 'expanded' : 'collapsed'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-wrap gap-2"
            >
              {Array.isArray(coreSkills) && 
                (isSkillsExpanded ? coreSkills : coreSkills.slice(0, MAX_SKILLS_DISPLAY))
                .map((skillObj, idx) => (
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
            </motion.div>
          </AnimatePresence>
          
          {isSkillsLong && (
            <button
              onClick={() => setIsSkillsExpanded(!isSkillsExpanded)}
              className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:text-blue-700 transition-colors"
            >
              {isSkillsExpanded ? (
                <>Show Less <ChevronUp className="w-4 h-4" /></>
              ) : (
                <>+{coreSkills.length - MAX_SKILLS_DISPLAY} More <ChevronDown className="w-4 h-4" /></>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
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