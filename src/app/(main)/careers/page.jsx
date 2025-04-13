'use client';
import { useState } from 'react';

export default function CareersPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    resume: '',
    coverLetter: '',
    status: 'pending',
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    statusHistory: [{
      status: 'pending',
      note: 'Application submitted',
      updatedAt: new Date().toISOString()
    }]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        // Handle success
      }
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12  pt-24">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-zinc-900">Career Opportunities</h1>
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
          {/* Form fields matching the Career model */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-zinc-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-zinc-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-zinc-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Position</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({...formData, position: e.target.value})}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-zinc-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Experience (years)</label>
              <input
                type="number"
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-zinc-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Resume Link</label>
              <input
                type="url"
                value={formData.resume}
                onChange={(e) => setFormData({...formData, resume: e.target.value})}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-zinc-900"
                placeholder="https://..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Cover Letter</label>
              <textarea
                value={formData.coverLetter}
                onChange={(e) => setFormData({...formData, coverLetter: e.target.value})}
                rows="4"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-zinc-900"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}