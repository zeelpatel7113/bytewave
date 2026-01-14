import React, { useEffect, useState } from 'react';
import { PieChart, Star, Sparkles, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Set loaded state after initial render to reduce initial animation load
    setIsLoaded(true);
    
    // Simplified observer with reduced work
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add class without setTimeout to reduce processing
            entry.target.classList.add('animate-in');
            // Unobserve after animation to reduce ongoing work
            observer.unobserve(entry.target);
          }
        });
      },
      { 
        threshold: 0.1, 
        rootMargin: "0px 0px -10px 0px" 
      }
    );

    // Delay observation slightly to ensure DOM is ready
    requestAnimationFrame(() => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach((element) => observer.observe(element));
    });

    return () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach((element) => observer.unobserve(element));
    };
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden pt-12">
      <style jsx>{`
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.5s ease-out, transform 0.5s ease-out;
        }
        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        .slide-in-left {
          transform: translateY(10px);
        }
        .slide-in-right {
          transform: translateY(10px);
        }
        .scale-in {
          transform: scale(0.95);
        }
        @media (min-width: 640px) {
          .animate-on-scroll {
            transition: opacity 0.7s ease-out, transform 0.7s ease-out;
          }
          .slide-in-left {
            transform: translateX(-30px);
          }
          .slide-in-right {
            transform: translateX(30px);
          }
        }
      `}</style>

      <section className="container mx-auto px-4 sm:px-32 py-12 sm:py-16 md:py-20 lg:py-32 relative">
        {/* Background Elements - Simplified for performance */}
        {isLoaded && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-32 sm:w-64 h-32 sm:h-64 bg-blue-100 rounded-full blur-xl sm:blur-2xl opacity-0 animate-on-scroll scale-in transition-all duration-700 delay-300"></div>
            <div className="absolute bottom-20 right-10 w-40 sm:w-96 h-40 sm:h-96 bg-blue-100 rounded-full blur-xl sm:blur-2xl opacity-0 animate-on-scroll scale-in transition-all duration-700 delay-500"></div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-20 relative">
          {/* Text Content */}
          <div className="w-full lg:w-[60%] space-y-6 sm:space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-50 border-1 border-blue-500 rounded-full mb-4 sm:mb-6 opacity-0 animate-on-scroll slide-in-left transition-all duration-500">
              <Sparkles className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-blue-500" />
              <span className="text-xs sm:text-sm font-medium text-zinc-950">Elevating Careers. Elevating Business.</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-900 leading-tight">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-block"
              >
                Connecting
              </motion.span>{" "}
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="inline-block"
              >
                people
              </motion.span>{" "}
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="inline-block"
              >
                with
              </motion.span>{" "}
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="inline-block text-blue-600"
              >
                opportunities
              </motion.span>{" "}
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="inline-block"
              >
                that
              </motion.span>{" "}
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="inline-block"
              >
                shape
              </motion.span>{" "}
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="inline-block"
              >
                futures.
              </motion.span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-xl sm:max-w-2xl mx-auto lg:mx-0 opacity-0 animate-on-scroll slide-in-left transition-all duration-500">
From precision-driven staffing, advanced career training, and seamless placements
to tailored workforce strategies, Bytewave doesn’t just fill roles, we empower
professionals and businesses to grow, adapt, and lead.            </p>
          </div>

          {/* Grid Content - Simplified animations for better performance */}
          <div className="w-full sm:w-[80%] md:w-[70%] lg:w-[40%] relative mt-8 lg:mt-0">
            <div className="relative max-w-[500px] mx-auto grid grid-cols-6 gap-2 sm:gap-4 p-2 sm:p-4">
              {/* Laptop Image */}
              <div className="col-span-4 row-span-3 bg-gray-100 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg opacity-0 animate-on-scroll slide-in-right transition-all duration-500">
                <img
                  src="https://cdn.pixabay.com/photo/2017/08/02/00/49/people-2569234_1280.jpg"
                  alt="Person working on laptop"
                  className="w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                />
              </div>

              {/* Stats Card */}
              <div className="col-span-2 col-start-5 row-span-2 bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-lg opacity-0 animate-on-scroll slide-in-right transition-all duration-500 delay-100">
                <div className="bg-black rounded-full w-6 sm:w-8 h-6 sm:h-8 flex items-center justify-center mb-2 sm:mb-3">
                  <PieChart className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#c3ff53]" />
                </div>
                <div className="text-lg sm:text-xl font-bold mb-1 flex items-center gap-1 text-zinc-950">
                  +25.5%
                  <ArrowUpRight className="w-4 sm:w-5 h-4 sm:h-5 text-green-500" />
                </div>
                <div className="text-sm font-semibold mb-1 text-zinc-900">Company efficiency</div>
                <div className="text-[10px] sm:text-xs text-zinc-800">(+2.8%) Month</div>
              </div>

              {/* Rating Card */}
              <div className="col-span-2 col-start-5 row-start-3 bg-black rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-lg opacity-0 animate-on-scroll slide-in-right transition-all duration-500 delay-200">
                <div className="flex items-center gap-1.5">
                  <div className="text-lg sm:text-xl font-bold text-[#c3ff53]">9.8</div>
                  <Star className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#c3ff53] fill-current" />
                </div>
                <div className="text-[10px] sm:text-xs text-gray-400 mt-0.5">Overall clients rate</div>
                <div className="text-[8px] sm:text-[10px] text-gray-500 mt-0.5">More than 10K reviews</div>
              </div>
            </div>

            {/* Decorative Elements - Removed for mobile performance */}
            <div className="hidden sm:block absolute -top-4 -left-4 w-6 sm:w-8 h-6 sm:h-8 bg-blue-100 rounded-full opacity-0 animate-on-scroll scale-in transition-all duration-500 delay-300"></div>
            <div className="hidden sm:block absolute -bottom-4 -right-4 w-6 sm:w-8 h-6 sm:h-8 bg-blue-100 rounded-full opacity-0 animate-on-scroll scale-in transition-all duration-500 delay-300"></div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Hero;