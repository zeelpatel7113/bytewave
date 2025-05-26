import React from 'react';
import { getCurrentDateTime, getCurrentUser } from '@/lib/utils';

export default function ServiceForm({
  formData,
  formStatus,
  selectedService,
  onInputChange,
  onSubmit,
  onBack,
}) {
  if (formStatus.submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
        <p className="text-gray-600 mb-6">
          Your request for {selectedService.title} service has been submitted
          successfully. Our team will contact you shortly.
        </p>
        <button
          onClick={onBack}
          className="px-6 py-2 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-colors duration-300"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {formStatus.error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg">
          {formStatus.error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Service
        </label>
        <input
          type="text"
          value={selectedService.title}
          className="w-full px-3 py-2 border text-zinc-900 border-gray-300 rounded-md bg-gray-100"
          disabled
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={onInputChange}
          className="w-full px-3 py-2 border text-zinc-900 border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={onInputChange}
          className="w-full px-3 py-2 border text-zinc-900 border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={onInputChange}
          className="w-full px-3 py-2 border text-zinc-900 border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Message
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={onInputChange}
          rows="4"
          className="w-full px-3 py-2 border text-zinc-900 border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Submit Request
        </button>
      </div>
    </form>
  );
}