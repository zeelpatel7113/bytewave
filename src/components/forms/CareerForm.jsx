'use client';
import { useState } from 'react';

export default function CareerForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    resume: '',
    coverLetter: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });

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
        setStatus({ type: 'success', message: 'Application submitted successfully!' });
        setFormData({
          name: '', email: '', phone: '', position: '',
          experience: '', resume: '', coverLetter: ''
        });
      } else {
        setStatus({ type: 'error', message: data.message || 'Submission failed' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to submit application' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {status.message && (
        <div className={`p-4 rounded-md ${
          status.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {status.message}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-zinc-900">Full Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-900">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-900">Phone</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-900">Position</label>
        <input
          type="text"
          value={formData.position}
          onChange={(e) => setFormData({...formData, position: e.target.value})}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-900">Experience (years)</label>
        <input
          type="number"
          value={formData.experience}
          onChange={(e) => setFormData({...formData, experience: e.target.value})}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
          min="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-900">Resume Link</label>
        <input
          type="url"
          value={formData.resume}
          onChange={(e) => setFormData({...formData, resume: e.target.value})}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          placeholder="https://..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-900">Cover Letter</label>
        <textarea
          value={formData.coverLetter}
          onChange={(e) => setFormData({...formData, coverLetter: e.target.value})}
          rows="4"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
      >
        Submit Application
      </button>
    </form>
  );
}