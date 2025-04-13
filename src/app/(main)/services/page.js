'use client';

import { useState, useEffect } from 'react';
import { FiCheckCircle, FiX } from 'react-icons/fi';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [draftId, setDraftId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceId: '',
    message: '',
    requestDate: new Date().toISOString(),
    createdBy: 'Bytewave Admin', // Current user's login
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      const data = await response.json();
      
      if (data.success) {
        setServices(data.data);
      } else {
        setError('Failed to fetch services');
      }
    } catch (error) {
      setError('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestService = (service) => {
    setSelectedService(service);
    setFormData(prev => ({ 
      ...prev, 
      serviceId: service._id,
      requestDate: new Date().toISOString(),
      createdBy: 'Bytewave Admin' // Current user's login
    }));
    setDraftId(null);
    setShowModal(true);
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const saveDraft = async () => {
    // Only save if we have at least one field filled
    if (!formData.name && !formData.email && !formData.phone && !formData.message) {
      return;
    }

    try {
      const url = draftId 
        ? `/api/service-requests/${draftId}`
        : '/api/service-requests';
      
      const method = draftId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          isDraft: true,
          status: 'draft',
          lastModified: new Date().toISOString()
        }),
      });

      const data = await response.json();

      if (!data.success) {
        console.error('Failed to save draft:', data.message);
      }
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  };

  const closeModal = async () => {
    // If there's form data and it wasn't submitted, save as draft
    if ((formData.name || formData.email || formData.phone || formData.message) && !success) {
      await saveDraft();
    }

    setShowModal(false);
    setError(null);
    setDraftId(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      serviceId: '',
      message: '',
      requestDate: new Date().toISOString(),
      createdBy: 'Bytewave Admin', 
    });
  };

  const handleModalClose = async (e) => {
    if (e.target === e.currentTarget) {
      await closeModal();
    }
  };


  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);


    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setSubmitLoading(true);
      const url = draftId 
        ? `/api/service-requests/${draftId}`
        : '/api/service-requests';
      
      const response = await fetch(url, {
        method: draftId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          isDraft: false,
          status: 'pending',
          submittedAt: new Date().toISOString(),
          lastModified: new Date().toISOString()
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setShowModal(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setError(data.message || 'Failed to submit request');
      }
    } catch (error) {
      setError('Failed to submit request');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        {success && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FiCheckCircle className="h-6 w-6 text-green-500" />
                <h3 className="text-green-800 font-medium">Request Submitted Successfully!</h3>
              </div>
              <button 
                onClick={() => setSuccess(false)}
                className="text-green-700 hover:text-green-900"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-2 text-green-700">
              Thank you for your interest! We will contact you shortly to discuss your request.
            </p>
          </div>
        )}

        {/* Services Grid */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Services</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {service.imageUrl && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={service.imageUrl}
                      alt={service.title}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {service.category}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <button
                    onClick={() => handleRequestService(service)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Request Service
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal */}
        {showModal && selectedService && (
          <div 
            className="fixed inset-0 z-50 overflow-y-auto" 
            aria-labelledby="modal-title" 
            role="dialog" 
            aria-modal="true"
            onClick={handleModalClose}
          >
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              {/* Background overlay */}
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

              {/* Modal panel */}
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-white" id="modal-title">
                      Request Service: {selectedService.title}
                    </h3>
                    <button 
                      onClick={closeModal}
                      className="text-white hover:text-blue-200"
                    >
                      <FiX className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="px-6 py-3 bg-red-50 border-l-4 border-red-500">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="px-6 py-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleFormChange('name', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleFormChange('email', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleFormChange('phone', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                        placeholder="1234567890"
                      />
                      <p className="mt-1 text-xs text-gray-500">Format: 10-digit number</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Additional Message
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => handleFormChange('message', e.target.value)}
                        rows="4"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Any specific requirements or questions..."
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitLoading}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {submitLoading ? 'Submitting...' : 'Submit Request'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}