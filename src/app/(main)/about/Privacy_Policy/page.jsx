"use client";

import React from "react";
import { motion } from "framer-motion";
const PrivacyPolicyPage = () => {
  return (
    <div>
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
            Privacy Policy
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl max-w-3xl opacity-80 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
           Bytewave (“we,” “our,” “us”) respects your privacy and is committed to protecting your personal information. This Privacy Policy describes how we collect, use, disclose, and safeguard your data when you interact with us through our website, SMS, phone, email, and other digital or in-person communications.

          </motion.p>
        </div>
      </motion.div>

      


      <div className="px-6 py-10 max-w-4xl mx-auto space-y-6">
        <section>
          <h2 className="text-2xl font-semibold text-black">1. Information We Collect</h2>
          <p className="mt-2">We may collect personal, professional, communication, usage, and preference data.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black">2. How We Use Your Information</h2>
          <p className="mt-2">To provide services, improve communication, share job updates, and maintain compliance.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black">3. SMS & Text Messaging Policy</h2>
          <ul className="list-disc ml-5 mt-2 space-y-1">
            <li>You consent to receive SMS alerts & updates.</li>
            <li>Message frequency varies.</li>
            <li>Reply STOP to opt out, HELP for help.</li>
            <li>No SMS data is shared with third parties.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black">4. Data Retention</h2>
          <p className="mt-2">We retain your information only as long as required by business or legal reasons.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black">5. Data Sharing</h2>
          <p className="mt-2">We share data only with service providers, legal authorities, or during business transfers.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black">6–12. Additional Information</h2>
          <ul className="list-disc ml-5 mt-2 space-y-1">
            <li>We are not responsible for third-party site policies.</li>
            <li>We use security measures to protect your data.</li>
            <li>Cookies help improve user experience.</li>
            <li>International transfers follow safety protocols.</li>
            <li>You may request access, correction, or deletion of data.</li>
            <li>No services are intended for children under 16.</li>
            <li>Policy updates will have a new effective date.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black">13. Contact Us</h2>
          <p className="mt-2">
            Bytewave<br />
            Email: info@bytewave.com<br />
            Phone: +1 (314) 464-5006<br />
            Website: https://www.bytewavetechnology.com
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;