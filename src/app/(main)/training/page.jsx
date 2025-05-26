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
        updatedAt: "2025-05-26 05:28:16",
        updatedBy: "Patil5913",
      },
    ],
  });

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    error: null,
  });

  // Store form changes in ref to avoid unnecessary re-renders
  const formChangesRef = useRef({
    data: null,
    hasChanges: false,
    lastUpdated: null,
  });

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
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      submitFormData();
    };

    window.addEventListener("beforeunload", handleRouteChange);
    router.events?.on("routeChangeStart", handleRouteChange);

    return () => {
      window.removeEventListener("beforeunload", handleRouteChange);
      router.events?.off("routeChangeStart", handleRouteChange);
      submitFormData();
    };
  }, []);

  const hasFormData = (data) => {
    if (!data) return false;
    return Object.keys(data).some(
      (key) =>
        !["statusHistory", "courseId"].includes(key) &&
        data[key] &&
        data[key].toString().trim().length > 0
    );
  };

  const submitFormData = async () => {
    if (
      formChangesRef.current.hasChanges &&
      formChangesRef.current.data &&
      hasFormData(formChangesRef.current.data)
    ) {
      try {
        await submitTrainingRequest({
          ...formChangesRef.current.data,
          statusHistory: [
            ...formChangesRef.current.data.statusHistory,
            {
              status: "draft",
              notes: "Form data auto-saved",
              updatedAt: "2025-05-26 05:28:16",
              updatedBy: "Patil5913",
            },
          ],
        });
        formChangesRef.current = {
          data: null,
          hasChanges: false,
          lastUpdated: null,
        };
      } catch (error) {
        console.warn("Error submitting form data:", error);
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
          updatedAt: "2025-05-26 05:28:16",
          updatedBy: "Patil5913",
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
    if (hasFormData(formChangesRef.current.data)) {
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
          updatedAt: "2025-05-26 05:28:16",
          updatedBy: "Patil5913",
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
          updatedAt: "2025-05-26 05:28:16",
          updatedBy: "Patil5913",
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

    try {
      const response = await submitTrainingRequest({
        ...formData,
        statusHistory: [
          ...formData.statusHistory,
          {
            status: "draft",
            notes: "Form submitted",
            updatedAt: "2025-05-26 05:28:16",
            updatedBy: "Patil5913",
          },
        ],
      });

      if (response.success) {
        setFormStatus({
          submitted: true,
          error: null,
        });

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
          updatedAt: "2025-05-26 05:28:16",
          updatedBy: "Patil5913",
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
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold mb-16 mt-12 opacity-50">
              Training
            </h1>
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
            Empowering professionals with comprehensive training programs
            designed to enhance skills and drive career growth.
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
      <div
        ref={formRef}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50"
      >
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Training Inquiry Form
            </h2>
            <p className="text-gray-600">
              Fill out the form below and we'll get back to you with more information
              about our training programs.
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