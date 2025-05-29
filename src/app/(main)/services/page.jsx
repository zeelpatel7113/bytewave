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
        updatedAt: "2025-05-26 03:49:21",
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
    const fieldsToCheck = ["name", "email", "phone", "message"];
    return fieldsToCheck.some(
      (field) => data[field] && data[field].trim().length > 0
    );
  };
  // Submit form data at trigger points
  const submitFormData = async () => {
    // Only submit if there are changes AND actual form data
    if (formChangesRef.current.hasChanges && 
        formChangesRef.current.data && 
        hasFormData(formChangesRef.current.data)) {
      try {
        await submitServiceRequest({
          ...formChangesRef.current.data,
          statusHistory: [
            ...formChangesRef.current.data.statusHistory,
            {
              status: 'draft',
              note: 'Form data submitted',
              updatedAt: '2025-05-26 03:53:56',
              updatedBy: 'Patil5913'
            }
          ]
        });
        // Reset changes after successful submission
        formChangesRef.current = {
          data: null,
          hasChanges: false,
          lastUpdated: null
        };
      } catch (error) {
        console.warn('Error submitting form data:', error);
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
          status: 'draft',
          note: 'Service selected',
          updatedAt: '2025-05-26 03:53:56',
          updatedBy: 'Patil5913'
        }
      ]
    };
    setFormData(newFormData);
    // Only store if there's actual data
    if (hasFormData(newFormData)) {
      formChangesRef.current = {
        data: newFormData,
        hasChanges: true,
        lastUpdated: Date.now()
      };
    }
    document.body.style.overflow = "hidden";
  };

  const closeServiceDetail = async () => {
    // Only submit if there's actual data
    if (hasFormData(formChangesRef.current.data)) {
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
          status: 'draft',
          note: `Updated ${name} field`,
          updatedAt: '2025-05-26 03:53:56',
          updatedBy: 'Patil5913'
        }
      ]
    };
    setFormData(newFormData);
    
    // Only store if there's actual data
    if (hasFormData(newFormData)) {
      formChangesRef.current = {
        data: newFormData,
        hasChanges: true,
        lastUpdated: Date.now()
      };
      setFormTouched(true);
    } else {
      formChangesRef.current = {
        data: null,
        hasChanges: false,
        lastUpdated: null
      };
      setFormTouched(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Only submit if there's actual data
    if (!hasFormData(formData)) {
      setFormStatus({
        submitted: false,
        error: "Please fill in at least one field before submitting.",
      });
      return;
    }

    try {
      await submitServiceRequest({
        ...formData,
        statusHistory: [
          ...formData.statusHistory,
          {
            status: 'draft',
            note: 'Form submitted',
            updatedAt: '2025-05-26 03:53:56',
            updatedBy: 'Patil5913'
          }
        ]
      });

      setFormStatus({
        submitted: true,
        error: null,
      });

      formChangesRef.current = {
        data: null,
        hasChanges: false,
        lastUpdated: null
      };
      resetForm();
      setFormTouched(false);
    } catch (error) {
      setFormStatus({
        submitted: false,
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
          updatedAt: "2025-05-26 03:49:21",
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

  const handleContactClick = () => {
    const newFormData = {
      ...formData,
      serviceId: selectedService._id,
      statusHistory: [
        ...formData.statusHistory,
        {
          status: "draft",
          note: "Contact form opened",
          updatedAt: "2025-05-26 03:49:21",
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
    setShowContactForm(true);
  };





  // Loading state with spinner
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-900 rounded-full animate-spin border-t-transparent"></div>
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
            Connecting business audiences with business buyers and sellers
            through content solutions, lead generation, newsletters, print and
            online advertising, social media and content driven sponsorship.
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
