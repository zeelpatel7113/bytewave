import Link from "next/link";
import { Mail, Phone, MapPin, Clock, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-zinc-50 text-zinc-900 py-12 border-t border-zinc-200">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-3">
            Connect with <span className="text-blue-500">Bytewave</span>
          </h2>
          <p className="text-zinc-600 max-w-xl mx-auto font-medium">
            Building workforce excellence through innovation and expertise
          </p>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {/* Company Info */}
          <div className="flex flex-col text-center">
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
              <span className="text-blue-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </span>
              Company Info
            </h3>
            <ul className="space-y-3 w-full">
              

              <li className="flex items-center gap-3 relative right-6">
                <Phone className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span className="text-zinc-700 font-medium">
                  +1 (314) 464-5006

                </span>
              </li>
              <li className="flex items-center gap-3 relative right-6">
                <Mail className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span className="text-zinc-700 font-medium">
                  info@bytewavetechnology.com

                </span>
              </li>
              <li className="flex gap-3 relative right-6">
                <MapPin className="w-5 h-5 text-blue-500 " />
                <span className="text-zinc-700 font-medium whitespace-nowrap">
                  117, South Lexington Street
                  <br />
                  <div className="relative right-3">
                    Harrisonville,MO 64701
                  </div>
                </span>
              </li>
              <li className="flex gap-3 relative right-6">
                <MapPin className="w-5 h-5 text-blue-500 " />
                <span className="text-zinc-700 font-medium whitespace-nowrap">
                  679 Danforth Ave, Toronto,
                  <br />
                  <div className="relative right-3">
                    ON M4J 1L2, Canada
                  </div>
                </span>
              </li>
              <li className="flex gap-4 mt-4 relative right-6">
                <a
                  href="https://www.linkedin.com/company/bytewavetechnology/"
                  className="text-zinc-500 hover:text-blue-500 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col text-center md:ml-16">
            <h3 className="flex gap-2 text-lg font-semibold mb-4">
              <span className="text-blue-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
              </span>
              Quick Links
            </h3>
            <ul className="space-y-3 w-full">
              <li className="flex">
                <Link
                  href="/about"
                  className="text-zinc-700 hover:text-blue-500 transition-colors flex items-center gap-2 font-medium"
                >
                  <span className="text-blue-500 font-medium">›</span>
                  About Us
                </Link>
              </li>
              <li className="flex ">
                <Link
                  href="/services"
                  className="text-zinc-700 hover:text-blue-500 transition-colors flex items-center gap-2"
                >
                  <span className="text-blue-500 font-medium">›</span>
                  Services
                </Link>
              </li>
              <li className="flex ">
                <Link
                  href="/careers"
                  className="text-zinc-700 hover:text-blue-500 transition-colors flex items-center gap-2"
                >
                  <span className="text-blue-500 font-medium">›</span>
                  Careers
                </Link>
              </li>
              <li className="flex ">
                <Link
                  href="/contact"
                  className="text-zinc-700 hover:text-blue-500 transition-colors flex items-center gap-2"
                >
                  <span className="text-blue-500 font-medium">›</span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div className="flex flex-col md:ml-8">
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
              <span className="text-blue-500">
                <Clock className="w-5 h-5" />
              </span>
              Business Hours
            </h3>
            <ul className="space-y-3 w-full">
              <li className="text-zinc-700">
                <span className="block font-medium">Monday - Friday</span>
                <span className="block text-zinc-600 mt-1">
                  10:00 AM - 6:00 PM EST
                </span>
              </li>

            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-zinc-200 text-center text-zinc-600 text-sm ">
          <div className="flex justify-center">
            © 2024 Bytewave. All rights reserved.|
            <div>
              <Link
                href="/about/Terms_Conditions"
                className="text-zinc-700 hover:text-blue-500 transition-colors">
                Terms & Conditions |
              </Link>
              <Link
                href="/about/Privacy_Policy"
                className="text-zinc-700 hover:text-blue-500 transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>


          {/* Watermark */}
          <div className="mt-4 flex justify-center items-center gap-2 text-xs">
            <a
              href="https://www.vrugle.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-blue-500 transition-colors"
            >
              Made with
              <span
                className="inline-block animate-bounce"
                style={{ animationDuration: "1.1s" }}
              >
                <img
                  src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Blue%20Heart.png"
                  alt="Blue Heart"
                  width="25"
                  height="25"
                  style={{ display: "inline-block", verticalAlign: "middle" }}
                />
              </span>
              by Vrugle
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
