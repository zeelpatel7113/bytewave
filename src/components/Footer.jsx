import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-zinc-50 text-zinc-900 py-16 border-t border-zinc-200">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-3">Connect with <span className="text-blue-500">Bytewave</span></h2>
          <p className="text-zinc-600 max-w-xl mx-auto">Building digital excellence through innovation and creativity</p>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {/* Company Info */}
          <div className="flex flex-col  text-center">
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-6">
              <span className="text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </span>
              Company Info
            </h3>
            <ul className="space-y-4 w-full">
              <li className="flex items-center  gap-3">
                <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span className="text-zinc-700">Ahmedabad, Gujarat, India</span>
              </li>
              <li className="flex items-center  gap-3">
                <Phone className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span className="text-zinc-700">+91 9909914815</span>
              </li>
              <li className="flex items-center  gap-3">
                <Mail className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span className="text-zinc-700">contact@bytewave.com</span>
              </li>
              <li className="flex gap-4 mt-6">
                <a href="https://instagram.com" className="text-zinc-500 hover:text-blue-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="https://linkedin.com" className="text-zinc-500 hover:text-blue-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
              </li>
            </ul>
          </div>
          {/* Quick Links */}
          <div className="flex flex-col  text-center md:ml-16">
            <h3 className="flex  gap-2 text-lg font-semibold mb-6">
              <span className="text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
              </span>
              Quick Links
            </h3>
            <ul className="space-y-4 w-full">
              <li className="flex ">
                <Link href="/about" className="text-zinc-700 hover:text-blue-500 transition-colors flex items-center gap-2">
                  <span className="text-blue-500 font-medium">›</span>
                  About Us
                </Link>
              </li>
              <li className="flex ">
                <Link href="/services" className="text-zinc-700 hover:text-blue-500 transition-colors flex items-center gap-2">
                  <span className="text-blue-500 font-medium">›</span>
                  Services
                </Link>
              </li>
              {/* <li className="flex ">
                <Link href="/training" className="text-zinc-700 hover:text-blue-500 transition-colors flex items-center gap-2">
                  <span className="text-blue-500 font-medium">›</span>
                  Training
                </Link>
              </li> */}
              <li className="flex ">
                <Link href="/careers" className="text-zinc-700 hover:text-blue-500 transition-colors flex items-center gap-2">
                  <span className="text-blue-500 font-medium">›</span>
                  Careers
                </Link>
              </li>
              <li className="flex ">
                <Link href="/contact" className="text-zinc-700 hover:text-blue-500 transition-colors flex items-center gap-2">
                  <span className="text-blue-500 font-medium">›</span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div className="flex flex-col md:ml-8">
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-6">
              <span className="text-blue-500">
                <Clock className="w-5 h-5" />
              </span>
              Business Hours
            </h3>
            <ul className="space-y-4 w-full">
              <li className="text-zinc-700">
                <span className="block font-medium">Monday - Friday</span>
                <span className="block text-sm text-zinc-500 mt-1">10:00 AM - 6:00 PM IST</span>
              </li>
              <li className="text-zinc-700">
                <span className="block font-medium">Saturday</span>
                <span className="block text-sm text-zinc-500 mt-1">10:00 AM - 2:00 PM IST</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-zinc-200 text-center text-zinc-500 text-sm">
          © 2024 Bytewave. All rights reserved.
        </div>
      </div>
    </footer>
  );
}