'use client';
import React, { useState, useEffect } from 'react';
import { ArrowUpRight} from 'lucide-react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import Link from 'next/link';

export default function ServicesList({ services }) {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [activeService, setActiveService] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const { scrollYProgress } = useScroll();

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      if (activeService) {
        setActiveService(null);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeService]);

  const handleMouseMove = (e) => {
    setCursorPosition({
      x: e.clientX,
      y: e.clientY
    });
  };

  const activeServiceData = services.find(service => service.title === activeService);

  return (
    <motion.section 
      className="min-h-screen px-4 py-16 md:px-8 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      onMouseMove={handleMouseMove}
      style={{ cursor: activeService ? 'none' : 'auto' }}
    >
      <div className="max-w-7xl mx-auto relative">
        <div className="flex flex-col md:flex-row md:space-x-12 lg:space-x-24 sm:px-12">
          <motion.div 
            className="md:w-1/4 mb-8 md:mb-0 md:sticky md:top-32 self-start"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-blue-600 font-medium text-2xl">
              / Our Services
            </div>
            <motion.p 
              className="text-lg text-gray-600 mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
Explore our comprehensive range of solutions designed to meet hiring needs and
exceed expectations.
            </motion.p>
          </motion.div>

          <div className="md:w-3/4 space-y-4">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold leading-tight text-zinc-900 mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Tailored Expertise to Elevate Your Workforce
            </motion.h1>

            {services.map((service, index) => (
              <motion.div
                key={service.number}
                className="border-t border-gray-300 py-8 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                onMouseEnter={() => setActiveService(service.title)}
                onMouseLeave={() => setActiveService(null)}
              >
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <h2 className="text-2xl md:text-3xl font-medium text-black transition-opacity duration-300 group-hover:opacity-70">
                      {service.title}
                    </h2>
                    <motion.p 
                      className={`text-gray-600 text-sm max-w-2xl transition-opacity duration-300`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ 
                        opacity: activeService === service.title ? 1 : 0,
                        y: activeService === service.title ? 0 : 10
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {service.description}
                    </motion.p>
                  </div>
                  <span className="text-sm text-blue-600 font-light">{service.number}</span>
                </div>
              </motion.div>
            ))}

            <motion.div 
              className="flex justify-center mt-12 pt-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <Link href="/services">
              <button className="inline-flex items-center space-x-2 border border-blue-600 text-blue-600 px-8 py-4 rounded-full hover:bg-blue-50 transition">
                <span>View more Services</span>
                <ArrowUpRight size={20} />
              </button>
              </Link>
            </motion.div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeServiceData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="fixed pointer-events-none z-50"
              style={{
                position: 'fixed',
                left: `${cursorPosition.x - 150}px`, // 300px / 2
                top: `${cursorPosition.y - 150}px`,
                zIndex: 99,
                pointerEvents: 'none'
              }}
            >
              <motion.div 
                className="w-[300px] h-[300px] rounded-2xl overflow-hidden shadow-xl bg-white"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ 
                  duration: 0.35,
                  ease: "easeInOut"
                }}
              >
                <motion.img 
                  key={activeServiceData.image}
                  src={activeServiceData.image} 
                  alt={activeServiceData.title}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ 
                    duration: 0.45,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}