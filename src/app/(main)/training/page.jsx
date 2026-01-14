"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchTrainingCourses,
  submitTrainingRequest,
} from "@/utils/training-api";
import { useRouter } from "next/navigation";

// Import components
import TrainingGrid from "@/components/training/TrainingGrid";
import TrainingDetailModal from "@/components/training/TrainingDetailModal";
import TrainingForm from "@/components/training/TrainingForm";
import TrainingIntro from "@/components/training/TrainingIntro";

function TrainingPage() {
  const router = useRouter();
  const formRef = useRef(null);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [trainings, setTrainings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formTouched, setFormTouched] = useState(false);

  // Add submission tracking system
  const [submissionInProgress, setSubmissionInProgress] = useState(false);
  const submissionTimeoutRef = useRef(null);
  const submissionIdRef = useRef(null);

  // Form data in state for UI rendering
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    message: "",
    courseId: "",
    statusHistory: [
      {
        status: "draft",
        notes: "Initial form data",
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        updatedBy: "Bytewave Admin",
      },
    ],
  });

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    isSubmitting: false,
    error: null,
  });

  // Store form changes in ref to avoid unnecessary re-renders
  const formChangesRef = useRef({
    data: null,
    hasChanges: false,
    lastUpdated: null,
  });

  // Generate a unique submission ID
  const generateSubmissionId = () => {
    return `training-submit-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  };

  // Check if submission is currently in progress or recently completed
  const isSubmissionAllowed = () => {
    if (submissionInProgress) {
      console.log("Training submission already in progress, preventing duplicate");
      return false;
    }
    return true;
  };

  // Start submission timer
  const startSubmissionTimer = (id) => {
    submissionIdRef.current = id;
    setSubmissionInProgress(true);
    
    // Clear any existing timeout
    if (submissionTimeoutRef.current) {
      clearTimeout(submissionTimeoutRef.current);
    }
    
    // Set new timeout to reset submission state after 10 seconds
    submissionTimeoutRef.current = setTimeout(() => {
      setSubmissionInProgress(false);
      submissionIdRef.current = null;
    }, 10000); // 10 seconds lockout
  };

  // Fetch trainings on component mount
  useEffect(() => {
    const loadTrainings = async () => {
      try {
        setIsLoading(true);
        const response = await fetchTrainingCourses();
        if (response.success && Array.isArray(response.data)) {
          const validTrainings = response.data.filter(
            (training) =>
              training &&
              typeof training === "object" &&
              (training.imageUrl || training.title)
          );
          setTrainings(validTrainings);
        } else {
          throw new Error(
            response.message || "Failed to fetch training courses"
          );
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadTrainings();
    
    // Cleanup submission timeout on unmount
    return () => {
      if (submissionTimeoutRef.current) {
        clearTimeout(submissionTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      // Only submit if allowed (not currently submitting)
      if (isSubmissionAllowed()) {
        submitFormData();
      }
    };

    window.addEventListener("beforeunload", handleRouteChange);
    router.events?.on("routeChangeStart", handleRouteChange);

    return () => {
      window.removeEventListener("beforeunload", handleRouteChange);
      router.events?.off("routeChangeStart", handleRouteChange);
      
      // Only submit if allowed (not currently submitting)
      if (isSubmissionAllowed()) {
        submitFormData();
      }
    };
  }, []);

  const hasFormData = (data) => {
    if (!data) return false;
    
    // Check for required fields
    const hasName = data.name && data.name.trim().length > 0;
    const hasEmail = data.email && data.email.trim().length > 0;
    const hasPhone = data.phone && data.phone.trim().length > 0;
    const hasMessage = data.message && data.message.trim().length > 0;
    
    // At least one of these fields should have data
    return hasName || hasEmail || hasPhone || hasMessage;
  };

  const submitFormData = async () => {
    // Only submit if:
    // 1. No submission is currently in progress
    // 2. There are changes
    // 3. There's actual form data
    if (
      isSubmissionAllowed() &&
      formChangesRef.current.hasChanges &&
      formChangesRef.current.data &&
      hasFormData(formChangesRef.current.data)
    ) {
      try {
        // Generate a unique submission ID
        const submissionId = generateSubmissionId();
        console.log("Auto-saving training request with ID:", submissionId);
        
        // Lock submissions
        startSubmissionTimer(submissionId);
        
        // Make sure courseId is included
        const dataToSubmit = {
          ...formChangesRef.current.data,
          courseId: formChangesRef.current.data.courseId || selectedTraining?._id,
          // Include the submission ID
          submissionId: submissionId,
          statusHistory: [
            ...formChangesRef.current.data.statusHistory,
            {
              status: "draft",
              notes: "Form data auto-saved",
              updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
              updatedBy: "Bytewave Admin",
            },
          ],
        };

        await submitTrainingRequest(dataToSubmit);
        
        // Reset changes after successful submission
        formChangesRef.current = {
          data: null,
          hasChanges: false,
          lastUpdated: null,
        };
      } catch (error) {
        console.warn("Error submitting training form data:", error);
      } finally {
        // Don't reset submission state here - let the timeout handle it
        // This prevents multiple submissions right after an error
      }
    }
  };

  const openTrainingDetail = (training) => {
    setSelectedTraining(training);
    const newFormData = {
      ...formData,
      courseId: training._id,
      statusHistory: [
        ...formData.statusHistory,
        {
          status: "draft",
          notes: "Training course selected",
          updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
          updatedBy: "Bytewave Admin",
        },
      ],
    };
    setFormData(newFormData);

    if (hasFormData(newFormData)) {
      formChangesRef.current = {
        data: newFormData,
        hasChanges: true,
        lastUpdated: Date.now(),
      };
    }
    document.body.style.overflow = "hidden";
  };

  const closeTrainingDetail = async () => {
    // Only submit if there's actual data and submission is allowed
    if (hasFormData(formChangesRef.current.data) && isSubmissionAllowed()) {
      await submitFormData();
    }
    setSelectedTraining(null);
    document.body.style.overflow = "auto";
  };

  const handleContactClick = () => {
    const newFormData = {
      ...formData,
      courseId: selectedTraining._id,
      statusHistory: [
        ...formData.statusHistory,
        {
          status: "draft",
          notes: "Contact form opened",
          updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
          updatedBy: "Bytewave Admin",
        },
      ],
    };
    setFormData(newFormData);
    formChangesRef.current = {
      data: newFormData,
      hasChanges: true,
      lastUpdated: Date.now(),
    };

    // Close the modal and scroll to form
    setSelectedTraining(null);
    document.body.style.overflow = "auto";
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value,
      statusHistory: [
        ...formData.statusHistory,
        {
          status: "draft",
          notes: `Updated ${name} field`,
          updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
          updatedBy: "Bytewave Admin",
        },
      ],
    };
    setFormData(newFormData);

    if (hasFormData(newFormData)) {
      formChangesRef.current = {
        data: newFormData,
        hasChanges: true,
        lastUpdated: Date.now(),
      };
      setFormTouched(true);
    } else {
      formChangesRef.current = {
        data: null,
        hasChanges: false,
        lastUpdated: null,
      };
      setFormTouched(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent submission if:
    // 1. Form is already being submitted
    // 2. Any submission is in progress
    if (formStatus.isSubmitting || !isSubmissionAllowed()) {
      console.log("Preventing duplicate training submission - already in progress");
      return;
    }

    // Set submitting state
    setFormStatus((prev) => ({
      ...prev,
      isSubmitting: true,
    }));

    try {
      // Generate a unique submission ID
      const submissionId = generateSubmissionId();
      console.log("Manual training submission with ID:", submissionId);
      
      // Lock submissions
      startSubmissionTimer(submissionId);
      
      const submissionData = {
        ...formData,
        courseId: formData.courseId || (selectedTraining?._id ? selectedTraining._id : undefined),
        // Include the submission ID
        submissionId: submissionId,
        statusHistory: [
          ...formData.statusHistory,
          {
            status: "draft",
            notes: "Form submitted manually",
            updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
            updatedBy: "Bytewave Admin",
          },
        ],
      };
      
      const response = await submitTrainingRequest(submissionData);

      if (response.success) {
        setFormStatus({
          submitted: true,
          isSubmitting: false,
          error: null,
        });

        // Clear form changes reference to prevent auto-save
        formChangesRef.current = {
          data: null,
          hasChanges: false,
          lastUpdated: null,
        };
        resetForm();
        setFormTouched(false);
      } else {
        throw new Error(response.message || "Failed to submit request");
      }
    } catch (error) {
      setFormStatus({
        submitted: false,
        isSubmitting: false,
        error:
          error.message ||
          "There was an error submitting your request. Please try again.",
      });
    }
  };

  const resetForm = () => {
    const newFormData = {
      name: "",
      email: "",
      phone: "",
      experience: "",
      message: "",
      courseId: "",
      statusHistory: [
        {
          status: "draft",
          notes: "Form reset",
          updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
          updatedBy: "Bytewave Admin",
        },
      ],
    };
    setFormData(newFormData);
    formChangesRef.current = {
      data: null,
      hasChanges: false,
      lastUpdated: null,
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-gray-900 text-white py-40 px-4 sm:px-6 lg:px-8 rounded-b-[40px]">
          <div className="max-w-7xl mx-auto">
            {/* Animated title skeleton */}
            <motion.div
              className="h-24 w-48 bg-gray-700 rounded-lg mb-16 mt-12"
              animate={{ opacity: [0.5, 0.7, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            {/* Animated description skeleton */}
            <div className="space-y-4">
              <motion.div
                className="h-6 w-3/4 bg-gray-700 rounded"
                animate={{ opacity: [0.5, 0.7, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="h-6 w-2/3 bg-gray-700 rounded"
                animate={{ opacity: [0.5, 0.7, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
              />
            </div>
          </div>
        </div>

        {/* Training grid skeleton */}
        <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <motion.div
                key={index}
                className="bg-gray-100 rounded-2xl p-6 h-72"
                animate={{ opacity: [0.5, 0.7, 0.5] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.1,
                }}
              >
                <div className="space-y-4">
                  <div className="h-10 w-20 bg-gray-200 rounded" />
                  <div className="h-6 w-3/4 bg-gray-200 rounded" />
                  <div className="h-24 w-full bg-gray-200 rounded" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
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
            Training
          </motion.h1>
          <motion.p
            className="text-xl sm:text-2xl max-w-3xl opacity-80 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Empowering job seekers with tailored training programs designed to build skills,boost confidence, and drive successful placements.
          </motion.p>
        </div>
      </motion.div>

      {/* Training Intro Section */}
      <TrainingIntro />

      {/* Training Grid Section */}
      <motion.div
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <TrainingGrid
            trainings={trainings}
            onTrainingClick={openTrainingDetail}
          />
        </div>
      </motion.div>

      {/* Training Detail Modal */}
      <AnimatePresence>
        {selectedTraining && (
          <TrainingDetailModal
            selectedTraining={selectedTraining}
            onClose={closeTrainingDetail}
            onContactClick={handleContactClick}
          />
        )}
      </AnimatePresence>

      {/* Training Form Section - Always visible */}
      <div ref={formRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Training Inquiry Form
            </h2>
            <p className="text-gray-600">
              Fill out the form below and we'll get back to you with more information about our
placement-focused training programs.
            </p>
          </div>

          <TrainingForm
            formData={formData}
            formStatus={formStatus}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}

export default TrainingPage;