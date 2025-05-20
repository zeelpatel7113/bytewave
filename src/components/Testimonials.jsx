"use client";
import React from "react";
import { Star, Quote, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const logos = [
  { id: 1, src: "/logos/google.png", alt: "Google" },
  { id: 2, src: "/logos/microsoft.png", alt: "Microsoft" },
  { id: 3, src: "/logos/apple.png", alt: "Apple" },
  { id: 4, src: "/logos/amazon.png", alt: "Amazon" },
  { id: 5, src: "/logos/meta.png", alt: "Meta" },
  { id: 6, src: "/logos/netflix.png", alt: "Netflix" },
  { id: 7, src: "/logos/tesla.png", alt: "Tesla" },
  { id: 8, src: "/logos/samsung.png", alt: "Samsung" },
  { id: 9, src: "/logos/intel.png", alt: "Intel" },
  { id: 10, src: "/logos/ibm.png", alt: "IBM" },
  { id: 11, src: "/logos/oracle.png", alt: "Oracle" },
  { id: 12, src: "/logos/cisco.png", alt: "Cisco" },
  { id: 13, src: "/logos/nvidia.png", alt: "NVIDIA" },
  { id: 14, src: "/logos/adobe.png", alt: "Adobe" },
  { id: 15, src: "/logos/salesforce.png", alt: "Salesforce" },
];

const CompanyLogos = () => {
  return (
    <motion.div
      className="relative w-full overflow-hidden py-8 bg-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute left-0 right-0 h-full bg-gradient-to-r from-white/5 via-transparent to-white/5 z-10" />
      <div className="flex gap-6 marquee-container-reverse">
        <div className="flex gap-6 animate-marquee-reverse">
          {[...logos, ...logos].map((logo, index) => (
            <motion.div
              key={index}
              className="flex-shrink-0 w-8 h-4 flex items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="max-w-full max-h-full object-contain transition-all duration-300"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechCorp Solutions",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80",
      content:
        "CPITRADEMEDIA has transformed how we connect with our audience. Their industry magazines and digital platforms have given us unprecedented reach.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Events Manager",
      company: "Global Innovations",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80",
      content:
        "The live events organized by CPITRADEMEDIA are second to none. The attention to detail and professional execution consistently exceed expectations.",
      rating: 5,
    },
    {
      name: "Emma Davis",
      role: "CEO",
      company: "Future Systems",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80",
      content:
        "Working with CPITRADEMEDIA has been instrumental in establishing our brand presence. Their multi-format approach ensures we reach our target audience effectively.",
      rating: 5,
    },
    {
      name: "David Wilson",
      role: "Digital Strategist",
      company: "Innovation Hub",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80",
      content:
        "The digital media services provided by CPITRADEMEDIA have helped us achieve remarkable growth in our online presence.",
      rating: 5,
    },
    {
      name: "Lisa Zhang",
      role: "Brand Manager",
      company: "Global Tech",
      image:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80",
      content:
        "Their industry magazines have become an essential platform for our brand messaging. The reach and impact are exceptional.",
      rating: 5,
    },
    {
      name: "James Anderson",
      role: "Operations Director",
      company: "Future Media",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80",
      content:
        "The webinars and virtual events hosted by CPITRADEMEDIA have helped us maintain strong connections with our audience even in challenging times.",
      rating: 5,
    },
  ];

  const marqueeTestimonials = [...testimonials, ...testimonials];

  const quoteVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
  };

  const starVariants = {
    initial: { scale: 0 },
    animate: (i) => ({
      scale: 1,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 200,
        damping: 10,
      },
    }),
  };

  return (
    <>
      {/* <CompanyLogos /> */}
      <motion.section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 bg-zinc-100 rounded-4xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex flex-col md:flex-row md:space-x-12 lg:space-x-24 ">
          {/* Left Side - Testimonials Text */}
          <motion.div
            className="md:w-1/4 mb-8 md:mb-0 md:sticky md:top-32 self-start"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-blue-600 font-medium text-2xl">
              / Testimonials
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
                What our clients say about our services
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl text-gray-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Our clients trust us to deliver exceptional results. Here's what
                they have to say about their experiences working with our team.
              </motion.p>
            </div>

            {/* Featured Testimonials Grid */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.slice(0, 4).map((testimonial, index) => (
                <motion.div 
                  key={index}
                  className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <motion.div
                    variants={quoteVariants}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="flex items-center mb-4"
                  >
                    <Quote className="w-8 h-8 text-blue-200" />
                  </motion.div>
                  
                  <p className="text-gray-700 mb-4">{testimonial.content}</p>
                  
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        custom={i}
                        variants={starVariants}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                      >
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      </motion.div>
                    ))}
                  </div>
    
                  <div className="flex items-center">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="ml-3">
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <div className="text-sm text-gray-500">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div> */}

            {/* Scrolling Testimonials */}
            <div className="relative w-full overflow-hidden py-4">
              <div className="absolute left-0 right-0 h-full bg-gradient-to-r from-zinc-100/5 via-transparent to-zinc-100/5 z-10" />
              <div className="flex gap-4 marquee-container">
                <div className="flex gap-4 animate-marquee">
                  {marqueeTestimonials.map((testimonial, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      className="flex-shrink-0 w-[300px] bg-white p-4 rounded-lg shadow-sm"
                    >
                      <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                        {testimonial.content}
                      </p>
                      <div className="flex items-center">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="ml-3">
                          <h4 className="text-sm font-semibold text-gray-900">
                            {testimonial.name}
                          </h4>
                          <div className="text-xs text-gray-500">
                            {testimonial.company}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Company Logos Section */}
            <div className="mt-16">
              <motion.h3
                className="text-2xl font-semibold text-center mb-8 text-gray-900"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Trusted by Industry Leaders
              </motion.h3>

              <div className="relative w-full overflow-hidden py-8">
                <div className="absolute left-0 right-0 h-full bg-gradient-to-r from-zinc-100/5 via-transparent to-zinc-100/5 z-10" />
                <div className="flex gap-4 marquee-container">
                  <div className="flex gap-4 animate-marquee">
                    {[...logos, ...logos].map((logo, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        className="flex-shrink-0 w-[100px] bg-white p-3 rounded-lg shadow-sm"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <div className="flex items-center justify-center h-full">
                          <img
                            src={logo.src}
                            alt={logo.alt}
                            className="max-w-full max-h-full object-contain transition-all duration-300"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {/* <button className="inline-flex items-center space-x-2 border border-blue-600 text-blue-600 px-8 py-4 rounded-full hover:bg-blue-50 transition">
                <span>View all testimonials</span>
                <ArrowUpRight size={20} />
              </button> */}
            </motion.div>
          </div>
        </div>
      </motion.section>
    </>
  );
};

export default Testimonials;
