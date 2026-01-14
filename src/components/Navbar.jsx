'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    // { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Training', path: '/training' },
    { name: 'Careers', path: '/careers' },
    { name: 'About', path: '/about' },
    { name: 'Blog', path: '/blog' },
    // { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => {
    return pathname === path;
  };

  return (
    <div className="fixed w-full z-[100] px-4 sm:px-6 lg:px-8">
    <nav className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-3xl my-3 mx-auto max-w-7xl shadow-lg">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-gray-800 hover:text-gray-600 transition-colors pl-4">
            <img src='/logo.png' className='h-12'/>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`${
                  isActive(link.path)
                    ? 'text-blue-600 font-medium'
                    : 'text-gray-600 hover:text-blue-600'
                } transition-colors text-sm uppercase tracking-wider`}
              >
                {link.name}
              </Link>
            ))}
            <Link href="/contact">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-all text-sm uppercase tracking-wider">
            Contact
            </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
            aria-label="Toggle Menu"
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <span className={`w-full h-0.5 bg-current transition-all transform ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`w-full h-0.5 bg-current transition-all ${isOpen ? 'opacity-0' : ''}`} />
              <span className={`w-full h-0.5 bg-current transition-all transform ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden bg-gray-50/80 backdrop-blur-lg rounded-2xl mt-2 border border-gray-200"
            >
              <div className="py-6 px-4 space-y-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block ${
                      isActive(link.path)
                        ? 'text-blue-600 font-medium'
                        : 'text-gray-600 hover:text-blue-600'
                    } transition-colors text-sm uppercase tracking-wider`}
                  >
                    {link.name}
                  </Link>
                ))}
            <Link href="/contact">
                <button className="w-full bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-all text-sm uppercase tracking-wider">
                Contact
                </button>
            </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
    </div>
  );
}