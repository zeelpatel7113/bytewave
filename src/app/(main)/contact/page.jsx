'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, MessageSquare } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: false });

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setStatus({
        loading: false,
        error: null,
        success: true
      });

      // Clear form after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });

      // Reset success message after 3 seconds
      setTimeout(() => {
        setStatus(prev => ({ ...prev, success: false }));
      }, 3000);

    } catch (error) {
      setStatus({
        loading: false,
        error: error.message,
        success: false
      });
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-32 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <span className="text-blue-600 font-medium mb-4 block">GET IN TOUCH</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Let’s Build Careers and Teams Together
          </h1>
          <p className="text-zinc-600 mb-16 max-w-2xl mx-auto">
            Whether you’re a professional looking for your next opportunity or a business
            seeking top talent, we’re here to connect you with the right solution.
          </p>
        </motion.div>
      </div>

      {/* Contact Form Section */}
      <div className="container mx-auto px-4 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-md mx-auto bg-zinc-100 p-8 rounded-lg shadow-md"
        >
          <h2 className="text-2xl font-bold mb-2 text-center">Send us a Message</h2>
          <p className="text-zinc-600 text-center text-sm mb-6">
            Fill out the form below and we'll get back to you shortly
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Name</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-zinc-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full bg-zinc-200 border border-gray-800 rounded py-2 px-10 text-zinc-900 placeholder-zinc-600 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2">Email</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-zinc-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full bg-zinc-200 border border-gray-800 rounded py-2 px-10 text-zinc-900 placeholder-zinc-600 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2">Phone Number</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-zinc-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full bg-zinc-200 border border-gray-800 rounded py-2 px-10 text-zinc-900 placeholder-zinc-600 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your project or inquiry"
                rows="4"
                className="w-full bg-zinc-200 border border-gray-800 rounded py-2 px-4 text-zinc-900 placeholder-zinc-600 focus:outline-none focus:border-blue-500"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={status.loading}
              className={`w-full ${status.loading ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'} text-blue-50 font-medium py-3 rounded transition-colors flex items-center justify-center gap-2`}
            >
              {status.loading ? 'Sending...' : 'Send Message'}
              {!status.loading && (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              )}
            </button>

            {status.error && (
              <div className="text-red-500 text-sm text-center mt-2">
                {status.error}
              </div>
            )}

            {status.success && (
              <div className="text-green-500 text-sm text-center mt-2">
                Message sent successfully!
              </div>
            )}
          </form>
        </motion.div>
      </div>

      {/* Contact Info Cards */}
      <div className="container mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-zinc-50 shadow-md border border-blue-800 rounded-lg p-6 text-center"
          >
            <div className="flex justify-center mb-4">
              <span className="text-blue-500">
                <MessageSquare size={24} />
              </span>
            </div>
            <h3 className="text-lg font-medium mb-2">Chat with us</h3>
            <a href="mailto:contact@bytewavetechnology.com" className="text-blue-500 hover:underline">contact@bytewavetechnology.com</a>
            <p className="text-zinc-600 text-sm mt-2">We aim to respond within 24 hours</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-zinc-50 shadow-md border border-blue-800 rounded-lg p-6 text-center"
          >
            <div className="flex justify-center mb-4">
              <span className="text-blue-500">
                <Clock size={24} />
              </span>
            </div>
            <h3 className="text-lg font-medium mb-2">Working Hours</h3>
            <p className="text-blue-500">Mon - Fri: 10AM - 6PM EST</p>
            <p className="text-zinc-600 text-sm mt-2">Weekend: Mail us</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-zinc-50 shadow-md border border-blue-800 rounded-lg p-6 text-center"
          >
            <div className="flex justify-center mb-4">
              <span className="text-blue-500">
                <MapPin size={24} />
              </span>
            </div>
            <h3 className="text-lg font-medium mb-2">Visit us</h3>
            <p className="text-blue-500">117, South Lexington Street</p>
            <p className="text-zinc-600 text-sm mt-2">United States</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}