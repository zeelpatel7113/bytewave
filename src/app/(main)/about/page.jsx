'use client';
import React, { useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';
import { Stats } from '@/components/Stats';
import WhoWeAre from '@/components/WhoWeAre';
import WhatSetsUsApart from '@/components/WhatSetsUsApart';
import FAQ from '@/components/FAQ';
import About from '@/components/about';
// import ContactSection from '@/components/ContactSection';

function App() {
  const [ref, setRef] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const services = [
    {
      title: "Content Marketing",
      description: "An informative approach used to attract, engage, and retain an audience by creating and sharing relevant articles, videos and other media.",
      imageUrl: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
    },
    {
      title: "Digital Advertising",
      description: "Solutions to target audiences via display advertising on websites, newsletter, social media, email direct, content marketing and native advertising.",
      imageUrl: "https://images.pexels.com/photos/6214472/pexels-photo-6214472.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
    },
    {
      title: "Marketing Strategy",
      description: "Comprehensive market analysis and campaign development to maximize ROI through strategic positioning and targeted messaging.",
      imageUrl: "https://images.pexels.com/photos/8867431/pexels-photo-8867431.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
    },
    {
      title: "Brand Development",
      description: "Strategic brand creation and evolution services that help businesses establish a strong, memorable presence in their target markets.",
      imageUrl: "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
    },
    {
      title: "Social Media Management",
      description: "Comprehensive social media strategy and execution to build engagement, grow followers, and drive meaningful interactions with your audience.",
      imageUrl: "https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
    },
    {
      title: "Analytics & Reporting",
      description: "Data-driven insights and detailed performance analysis to optimize your marketing strategies and maximize return on investment.",
      imageUrl: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
    }
  ];

  const descriptionText = "We deliver end-to-end staffing and recruitment solutions with a unified approach that blends strategic hiring, candidate training, and workforce consulting to maximise career and business potential. By leveraging our expertise in human capital and placement services, we help companies build stronger teams, connect professionals with the right opportunities, and drive measurable results";
  const words = descriptionText.split(' ');
  const { scrollYProgress } = useScroll();
  const [wordOpacities, setWordOpacities] = useState(Array(words.length).fill(0.2));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (ref) {
      observer.observe(ref);
    }

    return () => {
      if (ref) {
        observer.unobserve(ref);
      }
    };
  }, [ref]);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.querySelector('.animated-text');
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight && rect.bottom >= 0;
      
      if (isInView) {
        const words = element.querySelectorAll('.word');
        words.forEach((word, index) => {
          setTimeout(() => {
            word.style.opacity = '1';
            word.style.transform = 'translateY(0)';
          }, index * 50);
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateOpacities = () => {
      const progress = scrollYProgress.get();
      const newOpacities = words.map((_, index) => {
        const wordProgress = progress + (index * 0.015);
        return Math.max(0.2, Math.min(1, wordProgress * 3));
      });
      setWordOpacities(newOpacities);
    };

    const unsubscribe = scrollYProgress.on("change", updateOpacities);
    return () => unsubscribe();
  }, [words.length, scrollYProgress]);

  return (
    <div className="min-h-screen bg-white">
      <motion.div 
        className="bg-gray-900 text-white py-40 px-4 sm:px-6 lg:px-8 rounded-b-[40px] "
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
            About
          </motion.h1>
          <motion.p 
            className="text-xl sm:text-2xl max-w-3xl opacity-80 leading-relaxed  "
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
Powering Careers with Talent. Supporting Businesses with Workforce Solutions.          </motion.p>
        </div>
      </motion.div>

      <motion.div 
        className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto mt-24">
          <div className="flex flex-col md:flex-row">
            <motion.div 
              className="md:w-1/3 mb-8 md:mb-0"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-blue-500 text-2xl font-semibold">/ About</span>
            </motion.div>
            
            <div className="md:w-2/3">
              <motion.h2 
                className="text-4xl sm:text-5xl font-bold leading-tight mb-16  text-zinc-900"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                Empower People. Enable Growth. Elevate Success

              </motion.h2>
              
              <div className="text-xl leading-relaxed animated-text text-zinc-900">
                {words.map((word, index) => (
                  <motion.span
                    key={index}
                    className="word inline-block mr-[0.3em] opacity-0"
                    style={{
                      transform: 'translateY(20px)',
                      transition: `opacity 0.5s ease, transform 0.5s ease`,
                      transitionDelay: `${index * 0.01}s`
                    }}
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <section 
        ref={setRef} 
        className="bg-gray-50 text-gray-900 min-h-screen"
      >
        <div className={`transition-opacity duration-1000 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {/* <About /> */}
          <Stats/>
          <WhoWeAre />
          <WhatSetsUsApart />
          <FAQ />
          {/* <ContactSection /> */}
        </div>
      </section>
    </div>
  );
}

export default App;