"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, AnimatePresence } from "framer-motion";
import { fetchServices, submitServiceRequest } from "@/utils/services-api";
import { useRouter } from "next/navigation";

// Import components
import ServiceGrid from "@/components/services/ServiceGrid";
import ServiceDetailModal from "@/components/services/ServiceDetailModal";
import ServiceIntro from "@/components/services/ServiceIntro";

function ServicesPage() {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formTouched, setFormTouched] = useState(false);

  // Add a submission tracker
  const [submissionInProgress, setSubmissionInProgress] = useState(false);
  const submissionTimeoutRef = useRef(null);
  const submissionIdRef = useRef(null);

  // Form data in state for UI rendering
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    serviceId: "",
    statusHistory: [
      {
        status: "draft",
        note: "Initial form data",
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
    return `submit-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  };

  // Check if submission is currently in progress or recently completed
  const isSubmissionAllowed = () => {
    if (submissionInProgress) {
      console.log("Submission already in progress, preventing duplicate");
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

  // Fetch services on component mount
  useEffect(() => {
    const loadServices = async () => {
      try {
        setIsLoading(true);
        const servicesData = await fetchServices();
        setServices(servicesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadServices();
    
    // Cleanup submission timeout on unmount
    return () => {
      if (submissionTimeoutRef.current) {
        clearTimeout(submissionTimeoutRef.current);
      }
    };
  }, []);
  
  // Handle route change events
  useEffect(() => {
    const handleRouteChange = () => {
      // Only try to submit if allowed (not currently submitting)
      if (isSubmissionAllowed()) {
        submitFormData();
      }
    };

    window.addEventListener("beforeunload", handleRouteChange);
    
    // Next.js App Router doesn't have router.events
    // If you're using Pages Router, uncomment these lines
    // router.events?.on("routeChangeStart", handleRouteChange);
    
    return () => {
      window.removeEventListener("beforeunload", handleRouteChange);
      
      // If you're using Pages Router, uncomment these lines
      // router.events?.off("routeChangeStart", handleRouteChange);
      
      // Only try to submit if allowed (not currently submitting)
      if (isSubmissionAllowed()) {
        submitFormData();
      }
    };
  }, []);
  
  // Check if form has meaningful data
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
  
  // Submit form data at trigger points
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
        console.log("Auto-saving with ID:", submissionId);
        
        // Lock submissions
        startSubmissionTimer(submissionId);
        
        // Make sure serviceId is included
        const dataToSubmit = {
          ...formChangesRef.current.data,
          serviceId: formChangesRef.current.data.serviceId || selectedService?._id,
          // Include the submission ID
          submissionId: submissionId,
          statusHistory: [
            ...formChangesRef.current.data.statusHistory,
            {
              status: "draft",
              note: "Auto-saved form data",
              updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
              updatedBy: "Bytewave Admin",
            },
          ],
        };

        await submitServiceRequest(dataToSubmit);
        
        // Reset changes after successful submission
        formChangesRef.current = {
          data: null,
          hasChanges: false,
          lastUpdated: null,
        };
      } catch (error) {
        console.warn("Error submitting form data:", error);
      } finally {
        // Don't reset submission state here - let the timeout handle it
        // This prevents multiple submissions right after an error
      }
    }
  };

  const openServiceDetail = (service) => {
    setSelectedService(service);
    const newFormData = {
      ...formData,
      serviceId: service._id,
      statusHistory: [
        ...formData.statusHistory,
        {
          status: "draft",
          note: "Service selected",
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
    
    document.body.style.overflow = "hidden";
  };

  const closeServiceDetail = async () => {
    // Only submit if there's actual data and submission is allowed
    if (hasFormData(formChangesRef.current.data) && isSubmissionAllowed()) {
      await submitFormData();
    }

    setSelectedService(null);
    setShowContactForm(false);
    setFormTouched(false);
    resetForm();
    document.body.style.overflow = "auto";
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
          note: `Updated ${name} field`,
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
    setFormTouched(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent submission if:
    // 1. Form is already being submitted
    // 2. Any submission is in progress
    if (formStatus.isSubmitting || !isSubmissionAllowed()) {
      console.log("Preventing duplicate submission - already in progress");
      return;
    }

    // Set submitting state
    setFormStatus((prev) => ({
      ...prev,
      isSubmitting: true,
    }));

    // Check for required data
    if (!hasFormData(formData)) {
      setFormStatus({
        submitted: false,
        isSubmitting: false,
        error: "Please fill in at least one field before submitting.",
      });
      return;
    }

    try {
      // Generate a unique submission ID
      const submissionId = generateSubmissionId();
      console.log("Manual submission with ID:", submissionId);
      
      // Lock submissions
      startSubmissionTimer(submissionId);
      
      // Make sure serviceId is included
      const submissionData = {
        ...formData,
        serviceId: formData.serviceId || (selectedService?._id ? selectedService._id : undefined),
        // Include the submission ID
        submissionId: submissionId,
        statusHistory: [
          ...formData.statusHistory,
          {
            status: "draft",
            note: "Form submitted manually",
            updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
            updatedBy: "Bytewave Admin",
          },
        ],
      };
      
      await submitServiceRequest(submissionData);

      // Clear form changes reference to prevent auto-save
      formChangesRef.current = {
        data: null,
        hasChanges: false,
        lastUpdated: null,
      };

      setFormStatus({
        submitted: true,
        isSubmitting: false,
        error: null,
      });
      
      resetForm();
      setFormTouched(false);
    } catch (error) {
      setFormStatus({
        submitted: false,
        isSubmitting: false,
        error: error.message || "There was an error submitting your request. Please try again.",
      });
    }
  };

  const resetForm = () => {
    const newFormData = {
      name: "",
      email: "",
      phone: "",
      message: "",
      serviceId: "",
      statusHistory: [
        {
          status: "draft",
          note: "Form reset",
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

  const handleContactClick = () => {
    const newFormData = {
      ...formData,
      serviceId: selectedService._id,
      statusHistory: [
        ...formData.statusHistory,
        {
          status: "draft",
          note: "Contact form opened",
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
    setShowContactForm(true);
  };

  // Minimal loading state
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

        {/* Service grid skeleton */}
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
            Services
          </motion.h1>
          <motion.p
            className="text-xl sm:text-2xl max-w-3xl opacity-80 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            At Bytewave, we provide a comprehensive suite of staffing and career solutions
designed to empower both businesses and professionals. From recruitment and
workforce planning to training and placement, we deliver end-to-end support to
help you achieve your hiring and career goals.
          </motion.p>
        </div>
      </motion.div>

      {/* Service Intro Section */}
      <ServiceIntro />

      {/* Services Grid Section */}
      <motion.div
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <ServiceGrid services={services} onServiceClick={openServiceDetail} />
        </div>
      </motion.div>

      {/* Service Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <ServiceDetailModal
            selectedService={selectedService}
            showContactForm={showContactForm}
            formData={formData}
            formStatus={formStatus}
            onClose={closeServiceDetail}
            onContactClick={handleContactClick}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onShowFormChange={setShowContactForm}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default ServicesPage;