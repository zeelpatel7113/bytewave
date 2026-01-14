'use client';
import React from 'react';
import { ArrowUpRight, Clock, Target, Shield, Cpu } from 'lucide-react';
import { motion, useScroll } from 'framer-motion';
import Link from 'next/link';

const About = () => {
  const contentTypes = [
    {
      title: "Precision Recruitment",
      description: "Top talent matched quickly and effectively",
      icon: Clock
    },
    {
      title: "Zero Guesswork",
      description: "Smart screening for the right fit",
      icon: Target
    },
    {
      title: "No Bad Hires",
      description: "90-day performance guarantee",
      icon: Shield
    },
    {
      title: "Talent. On Demand.",
      description: "Ctrl+Alt+Career",
      icon: Cpu
    }
  ];

  const descriptionText = "At Bytewave Technology, we specialise in staffing, recruitment, training, and placement services, connecting skilled professionals with top organisations. Our mission is to empower businesses with the right workforce and help individuals unlock their career potential, delivering results that matter";
  const words = descriptionText.split(' ');
  const { scrollYProgress } = useScroll();
  
  React.useEffect(() => {
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
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.section 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex flex-col md:flex-row md:space-x-12 lg:space-x-24">
        {/* Left Side - About Text */}
        <motion.div 
          className="md:w-1/4 mb-8 md:mb-0 md:sticky md:top-32 self-start"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-blue-600 font-medium text-2xl">
            / About
          </div>
        </motion.div>

        {/* Right Side - Main Content */}
        <div className="md:w-3/4 space-y-16">
          <div className="space-y-8">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold leading-tight text-zinc-900"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Bridging Talent with Opportunity

            </motion.h1>

            <div className="text-lg md:text-xl text-gray-700 animated-text break-words whitespace-pre-wrap">
              {words.map((word, index) => (
                <motion.span
                  key={index}
                  className="word inline-block mr-[0.3em] break-words"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ 
                    opacity: 1, 
                    y: 0,
                    transition: {
                      duration: 0.4,
                      delay: index * 0.03,
                      ease: [0.43, 0.13, 0.23, 0.96] // Custom easing for smoother motion
                    }
                  }}
                  viewport={{ 
                    once: true, 
                    margin: "-50px",
                    amount: "some" 
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </div>

            <motion.p 
              className="text-lg md:text-xl text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Our Mission:  Helping our clients hire faster, smarter, and better, while supporting
candidates to achieve career success time and time again.

            </motion.p>
          </div>

          {/* Content Types Grid - Removed animations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {contentTypes.map((type, index) => (
              <div 
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    {type.icon && <type.icon className="w-6 h-6 text-blue-600" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{type.title}</h3>
                    <p className="text-gray-500 mt-1">{type.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link href="/about" >
              
            <button className="inline-flex items-center space-x-2 border border-blue-600 text-blue-600 px-8 py-4 rounded-full hover:bg-blue-50 transition">
              <span>Read more about us</span>
              <ArrowUpRight size={20} />
            </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default About;