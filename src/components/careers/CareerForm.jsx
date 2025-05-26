"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileUpload } from "@/components/ui/file-upload";
import { useFileUpload } from "@/lib/fileUpload";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { getCurrentDateTime, getCurrentUser } from "@/lib/utils";

const experienceLevels = {
  'senior': '7',
  'mid-senior': '4',
  'mid': '2',
  'entry-level': '1',
  'intern': '0'
};

const experienceLabels = {
  'senior': '7+ years',
  'mid-senior': '4-7 years',
  'mid': '2-4 years',
  'entry-level': '1 year',
  'intern': 'No experience required'
};

const CareerForm = ({ selectedJob, availableJobs }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [previousPath, setPreviousPath] = useState(pathname);

  const {
    handleUpload,
    uploading: fileUploading,
    error: uploadError,
    progress,
    resetState
  } = useFileUpload();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    careerId: selectedJob?._id || "",
    experience: "",
    resumeFile: null,
    resumeUrl: "",
    message: "",
  });

  const [formStatus, setFormStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  // Update form when selectedJob changes
  useEffect(() => {
    if (selectedJob) {
      setFormData(prev => ({
        ...prev,
        careerId: selectedJob._id,
        experience: experienceLevels[selectedJob.experienceLevel] || "0",
      }));
    }
  }, [selectedJob]);

  // Handle route changes
  useEffect(() => {
    if (pathname !== previousPath) {
      console.log("Route changed from", previousPath, "to", pathname);
      if (formData.name || formData.email || formData.phone) {
        handleAutoSubmit();
      }
      setPreviousPath(pathname);
    }
  }, [pathname]);

  // Handle page unload
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (formData.name || formData.email || formData.phone) {
        handleAutoSubmit();
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formData]);

  const handleAutoSubmit = async () => {
    if (submitting) return;

    // Create a draft submission
    const draftData = {
      ...formData,
      resumeUrl: formData.resumeUrl,
      uploadedBy: getCurrentUser(),
      uploadedAt: getCurrentDateTime(),
      isDraft: true,
      statusHistory: [{
        status: 'draft',
        note: 'Career application saved as draft',
        updatedAt: getCurrentDateTime(),
        updatedBy: getCurrentUser()
      }]
    };

    // Convert experience to number if it exists
    if (draftData.experience) {
      draftData.experience = parseInt(draftData.experience, 10);
    }

    // Remove resumeFile from the data
    delete draftData.resumeFile;

    try {
      const response = await fetch("/api/career-requests", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(draftData),
      });

      if (!response.ok) {
        console.error("Failed to save draft");
      }
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = async (file) => {
    if (!file) return;

    try {
      // Upload file first
      const uploadedUrl = await handleUpload(file);
      
      // Update form data with uploaded file URL
      setFormData(prev => ({
        ...prev,
        resumeFile: file,
        resumeUrl: uploadedUrl
      }));
    } catch (error) {
      setFormStatus({
        type: "error",
        message: error.message || "Failed to upload file"
      });
    }
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }

    if (submitting) return;

    setSubmitting(true);
    
    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.phone || !formData.experience) {
        throw new Error("Please fill in all required fields");
      }

      const finalFormData = {
        ...formData,
        resumeUrl: formData.resumeUrl,
        uploadedBy: getCurrentUser(),
        uploadedAt: getCurrentDateTime(),
        isDraft: false,
        statusHistory: [{
          status: 'pending',
          note: 'Career application submitted',
          updatedAt: getCurrentDateTime(),
          updatedBy: getCurrentUser()
        }]
      };

      // Convert experience to number
      finalFormData.experience = parseInt(finalFormData.experience, 10);

      // Remove resumeFile from the data
      delete finalFormData.resumeFile;

      const response = await fetch("/api/career-requests", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalFormData),
      });

      const data = await response.json();

      if (response.ok) {
        setFormStatus({
          type: "success",
          message: "Application submitted successfully!",
        });

        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          careerId: selectedJob?._id || "",
          experience: "",
          resumeFile: null,
          resumeUrl: "",
          message: "",
        });
        resetState();

        setTimeout(() => {
          setFormStatus({ type: "", message: "" });
        }, 3000);
      } else {
        throw new Error(data.message || "Submission failed");
      }
    } catch (error) {
      setFormStatus({ 
        type: "error", 
        message: error.message || "Failed to submit application" 
      });
    } finally {
      setSubmitting(false);
    }
  };
    // ... continuing from previous part

  return (
    <div className="bg-gray-50 py-16 mt-12" id="application-form">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-white rounded-xl shadow-sm p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {selectedJob
              ? `Apply for ${selectedJob.position}`
              : "Apply for a Position"}
          </h2>

          {(formStatus.message || uploadError) && (
            <div
              className={`p-4 rounded-md mb-6 ${
                formStatus.type === "success"
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-800"
              }`}
            >
              {formStatus.message || uploadError}
            </div>
          )}

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }} 
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-zinc-900">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-zinc-900"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-900">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-zinc-900"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-900">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-zinc-900"
                placeholder="Enter your phone number"
              />
            </div>

            {selectedJob && (
              <div>
                <label className="block text-sm font-medium text-zinc-900">
                  Position
                </label>
                <input
                  type="text"
                  value={selectedJob.position}
                  readOnly
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-zinc-900 bg-gray-50"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-zinc-900">
                Experience (years) <span className="text-red-500">*</span>
              </label>
              <select
                name="experience"
                required
                value={formData.experience}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-zinc-900"
              >
                <option value="">Select years of experience</option>
                {Object.entries(experienceLevels).map(([level, years]) => (
                  <option key={level} value={years}>
                    {experienceLabels[level]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-900">
                Resume
              </label>
              <FileUpload
                value={formData.resumeUrl}
                onChange={handleFileChange}
                disabled={submitting}
                uploading={fileUploading}
                accept=".pdf,.doc,.docx"
                onRemove={() => {
                  setFormData(prev => ({
                    ...prev,
                    resumeFile: null,
                    resumeUrl: ""
                  }));
                  resetState();
                }}
              />
              {progress > 0 && progress < 100 && (
                <div className="mt-2">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Uploading: {progress}%
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-900">
                Cover Letter / Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="4"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-zinc-900"
                placeholder="Tell us why you're interested in this position"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || fileUploading}
              className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg transition duration-200 font-medium 
                ${(submitting || fileUploading) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            >
              {submitting || fileUploading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : "Submit Application"}
            </button>

            {/* Required fields note */}
            <p className="text-sm text-gray-500 mt-2">
              <span className="text-red-500">*</span> Required fields
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CareerForm;