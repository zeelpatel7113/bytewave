"use client";

import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { FiPlus } from "react-icons/fi";
import ServiceModal from "@/components/services/ServiceModal";
import ServiceTable from "@/components/admin/ServiceTable";
import ServiceRequestsTable from "@/components/admin/ServiceRequestsTable";
import TrainingCourseCard from "@/components/training/TrainingCourseCard";
import TrainingCourseModal from "@/components/training/TrainingCourseModal";
import TrainingRequestsTable from "@/components/admin/TrainingRequestsTable";
import CareerRequestsTable from "@/components/admin/CareerRequestsTable";
import ContactRequestsTable from "@/components/admin/ContactRequestsTable";

const CURRENT_USER = "Patil5913";
const CURRENT_DATETIME = "2025-04-04 10:46:51";

export default function Dashboard() {
  const { admin } = useAuth();
  
  // UI state
  const [activeSection, setActiveSection] = useState('services');
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [currentCourse, setCurrentCourse] = useState(null);

  // Service handlers
  const handleServiceSubmit = async (formData) => {
    try {
      const endpoint = currentService 
        ? `/api/services/${currentService._id}` 
        : '/api/services';
      
      const method = currentService ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          lastModified: CURRENT_DATETIME,
          modifiedBy: CURRENT_USER,
          ...(method === 'POST' && {
            createdAt: CURRENT_DATETIME,
            createdBy: CURRENT_USER,
          }),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsServiceModalOpen(false);
        setCurrentService(null);
      }
    } catch (error) {
      console.error("Error saving service:", error);
    }
  };

  const handleServiceEdit = (service) => {
    setCurrentService(service);
    setIsServiceModalOpen(true);
  };

  // Training course handlers
  const handleTrainingSubmit = async (formData) => {
    try {
      const endpoint = currentCourse 
        ? `/api/training-courses/${currentCourse._id}` 
        : '/api/training-courses';
      
      const method = currentCourse ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          lastModified: CURRENT_DATETIME,
          modifiedBy: CURRENT_USER,
          ...(method === 'POST' && {
            createdAt: CURRENT_DATETIME,
            createdBy: CURRENT_USER,
          }),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsTrainingModalOpen(false);
        setCurrentCourse(null);
      }
    } catch (error) {
      console.error("Error saving training course:", error);
    }
  };

  const handleTrainingEdit = (course) => {
    setCurrentCourse(course);
    setIsTrainingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-semibold text-gray-900">
                Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {admin?.name || CURRENT_USER}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveSection('services')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeSection === 'services'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Services
          </button>
          <button
            onClick={() => setActiveSection('courses')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeSection === 'courses'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Training Courses
          </button>
          <button
            onClick={() => setActiveSection('careers')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeSection === 'careers'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Careers
          </button>
          <button
            onClick={() => setActiveSection('contacts')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeSection === 'contacts'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Contacts
          </button>
        </div>
      </div>

      {/* Services Section */}
      {activeSection === 'services' && (
        <>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Services</h2>
                <button
                  onClick={() => {
                    setCurrentService(null);
                    setIsServiceModalOpen(true);
                  }}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <FiPlus className="w-5 h-5" /> Add New Service
                </button>
              </div>
              <ServiceTable onEdit={handleServiceEdit} />
            </div>
          </div>

          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Service Requests
              </h2>
              <ServiceRequestsTable />
            </div>
          </div>
        </>
      )}

      {/* Training Courses Section */}
      {activeSection === 'courses' && (
        <>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Training Courses
                </h2>
                <button
                  onClick={() => {
                    setCurrentCourse(null);
                    setIsTrainingModalOpen(true);
                  }}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <FiPlus className="w-5 h-5" /> Add New Course
                </button>
              </div>
              <TrainingCourseCard onEdit={handleTrainingEdit} />
            </div>
          </div>

          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Training Course Requests
              </h2>
              <TrainingRequestsTable />
            </div>
          </div>
        </>
      )}

      {/* Career Applications Section */}
      {activeSection === 'careers' && (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Career Applications
            </h2>
            <CareerRequestsTable />
          </div>
        </div>
      )}

      {/* Contact Requests Section */}
      {activeSection === 'contacts' && (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Contact Requests
            </h2>
            <ContactRequestsTable />
          </div>
        </div>
      )}

      {/* Modals */}
      <ServiceModal
        isOpen={isServiceModalOpen}
        onClose={() => {
          setIsServiceModalOpen(false);
          setCurrentService(null);
        }}
        onSubmit={handleServiceSubmit}
        initialData={currentService}
      />

      <TrainingCourseModal
        isOpen={isTrainingModalOpen}
        onClose={() => {
          setIsTrainingModalOpen(false);
          setCurrentCourse(null);
        }}
        onSubmit={handleTrainingSubmit}
        initialData={currentCourse}
      />
    </div>
  );
}