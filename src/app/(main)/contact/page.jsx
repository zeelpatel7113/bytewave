'use client';
import ContactForm from '@/components/forms/ContactForm';
import { motion } from 'framer-motion';

export default function Contact() {
  return (
    <div className="min-h-screen pt-20 pb-16 bg-zinc-100">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <h1 className="text-4xl font-bold text-zinc-900 mb-4 text-center">
            Contact Us
          </h1>
          <p className="text-zinc-600 mb-8 text-center">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
          
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <ContactForm />
          </div>

          {/* Additional Contact Information */}
          <div className="mt-12 grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">Email</h3>
              <p className="text-zinc-600">support@bytewave.com</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">Phone</h3>
              <p className="text-zinc-600">+1 (555) 123-4567</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">Address</h3>
              <p className="text-zinc-600">123 Tech Street, Digital City, 12345</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}