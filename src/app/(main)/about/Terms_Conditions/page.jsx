"use client";

import React from "react";
import { motion } from "framer-motion";

const TermsPage = () => {
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
            Terms & Conditions
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl max-w-3xl opacity-80 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            These Terms & Conditions (“Terms”) govern your use of Bytewave’s website,
            services, and communications. By accessing or using our platform, you agree
            to follow these Terms.
          </motion.p>
        </div>
      </motion.div>

      {/* Content */}
      <div className="px-6 py-10 max-w-4xl mx-auto space-y-6">
        
        <section>
          <h2 className="text-2xl font-semibold text-black">1. Acceptance of Terms</h2>
          <p className="mt-2">
            By using our website or services, you confirm that you accept these Terms
            and agree to comply with them.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black">2. Use of Our Services</h2>
          <p className="mt-2">
            You agree to use Bytewave services legally, responsibly, and without attempting 
            to harm the platform or access restricted areas without authorization.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black">3. Intellectual Property Rights</h2>
          <p className="mt-2">
            All content on the Bytewave website—including text, graphics, logos, and 
            branding—is the property of Bytewave. You may not reproduce, modify, or 
            distribute any content without written permission.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black">4. Limitation of Liability</h2>
          <p className="mt-2">
            Bytewave is not responsible for any direct, indirect, incidental, or 
            consequential damages arising from your use of our website, communications, 
            or services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black">5. Third-Party Links and Services</h2>
          <p className="mt-2">
            Our website may contain links to third-party platforms. We are not responsible 
            for the content, policies, or actions of those external websites or services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black">6. Termination of Access</h2>
          <p className="mt-2">
            We reserve the right to suspend or terminate access to our services if 
            policies are violated or misuse is detected.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black">7. Updates to Terms</h2>
          <p className="mt-2">
            Bytewave may update these Terms from time to time. Updated versions will be 
            posted on this page with a new effective date. Continued use of our services 
            means you accept the updated Terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-black">8. Contact Us</h2>
          <p className="mt-2">
            For questions regarding these Terms, please contact:<br />
            <br />
            Bytewave<br />
            Email: info@bytewave.com<br />
            Phone:+1 (314) 464-5006<br />
            Website: https://www.bytewavetechnology.com
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;
