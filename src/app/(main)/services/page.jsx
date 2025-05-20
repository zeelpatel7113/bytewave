"use client";
import React, { useState } from "react";
import { motion, useScroll, AnimatePresence } from "framer-motion";

function App() {
  const [selectedService, setSelectedService] = useState(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    serviceTitle: ""
  });
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    error: null
  });

  const openServiceDetail = (service) => {
    setSelectedService(service);
    document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
  };

  const closeServiceDetail = () => {
    setSelectedService(null);
    setShowContactForm(false);
    document.body.style.overflow = "auto"; // Re-enable scrolling
  };

  const handleContactClick = () => {
    setFormData({
      ...formData,
      serviceTitle: selectedService.title
    });
    setShowContactForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // In a real application, you would send this data to your API
      // For now, we'll just simulate a successful submission
      console.log("Form submitted:", formData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFormStatus({
        submitted: true,
        error: null
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        serviceTitle: selectedService.title
      });
    } catch (error) {
      setFormStatus({
        submitted: false,
        error: "There was an error submitting your request. Please try again."
      });
    }
  };

  const services = [
    {
      title: "Content Marketing",
      description:
        "An informative approach used to attract, engage, and retain an audience by creating and sharing relevant articles, videos and other media.",
      imageUrl:
        "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    },
    {
      title: "Digital Advertising",
      description:
        "Solutions to target audiences via display advertising on websites, newsletter, social media, email direct, content marketing and native advertising.",
      imageUrl:
        "https://images.pexels.com/photos/6214472/pexels-photo-6214472.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    },
    {
      title: "Marketing Strategy",
      description:
        "Comprehensive market analysis and campaign development to maximize ROI through strategic positioning and targeted messaging.",
      imageUrl:
        "https://images.pexels.com/photos/8867431/pexels-photo-8867431.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    },
    {
      title: "Brand Development",
      description:
        "Strategic brand creation and evolution services that help businesses establish a strong, memorable presence in their target markets.",
      imageUrl:
        "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    },
    {
      title: "Social Media Management",
      description:
        "Comprehensive social media strategy and execution to build engagement, grow followers, and drive meaningful interactions with your audience.",
      imageUrl:
        "https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    },
    {
      title: "Analytics & Reporting",
      description:
        "Data-driven insights and detailed performance analysis to optimize your marketing strategies and maximize return on investment.",
      imageUrl:
        "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    },
  ];

  const descriptionText =
    "We provide and encourage through-the-line marketing services – an integrated approach for our commercial partners to use both, above the line and below the line, traditional marketing methods to reach their targets. We help to create awareness and engagement utilising a marketing mix that leads to conversion.";
  const words = descriptionText.split(" ");
  const { scrollYProgress } = useScroll();

  React.useEffect(() => {
    const handleScroll = () => {
      const element = document.querySelector(".animated-text");
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight && rect.bottom >= 0;

      if (isInView) {
        const words = element.querySelectorAll(".word");
        words.forEach((word, index) => {
          setTimeout(() => {
            word.style.opacity = "1";
            word.style.transform = "translateY(0)";
          }, index * 50);
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [wordOpacities, setWordOpacities] = React.useState(
    Array(words.length).fill(0.2)
  );

  React.useEffect(() => {
    const updateOpacities = () => {
      const progress = scrollYProgress.get();
      const newOpacities = words.map((_, index) => {
        const wordProgress = progress + index * 0.015;
        return Math.max(0.2, Math.min(1, wordProgress * 3));
      });
      setWordOpacities(newOpacities);
    };

    const unsubscribe = scrollYProgress.on("change", updateOpacities);
    return () => unsubscribe();
  }, [words.length, scrollYProgress]);

  return (
    <div className="min-h-screen bg-white ">
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
            Services
          </motion.h1>
          <motion.p
            className="text-xl sm:text-2xl max-w-3xl opacity-80 leading-relaxed  "
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Connecting business audiences with business buyers and sellers
            through content solutions, lead generation, newsletters, print and
            online advertising, social media and content driven sponsorship.
          </motion.p>
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
              <span className="text-blue-500 text-2xl font-semibold">
                / Services
              </span>
            </motion.div>

            <div className="md:w-2/3">
              <motion.h2
                className="text-4xl sm:text-5xl font-bold leading-tight mb-16  text-zinc-900"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                Create awareness, provoke engagement, generate interest, lead to
                conversion.
              </motion.h2>

              <div className="text-xl leading-relaxed animated-text text-zinc-900">
                {words.map((word, index) => (
                  <motion.span
                    key={index}
                    className="word inline-block mr-[0.3em] opacity-0"
                    style={{
                      transform: "translateY(20px)",
                      transition: `opacity 0.5s ease, transform 0.5s ease`,
                      transitionDelay: `${index * 0.01}s`,
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

      <motion.div
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-gradient-to-br from-white to-gray-50 rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                
                <div className="relative p-6">
                  <div className="mb-6 h-48 overflow-hidden rounded-2xl">
                    <motion.img
                      src={service.imageUrl}
                      alt={service.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>

                  <div className="space-y-4">
                    <motion.div
                      className="flex items-center justify-between"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                        {service.title}
                      </h3>
                      <span className="px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded-full">
                        Service
                      </span>
                    </motion.div>

                    <p className="text-gray-600 text-base line-clamp-3 group-hover:text-gray-700 transition-colors duration-300">
                      {service.description}
                    </p>

                    <motion.button
                      onClick={() => openServiceDetail(service)}
                      className="mt-4 w-full inline-flex items-center justify-center space-x-2 px-6 py-3 bg-gray-900 text-white rounded-xl text-sm font-medium transition-all duration-300 hover:bg-blue-600 group"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span>Learn More</span>
                      <motion.span
                        className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                        initial={{ opacity: 0.8 }}
                        whileHover={{ opacity: 1 }}
                      >
                        →
                      </motion.span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Service Detail Popup */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeServiceDetail}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <div className="h-[300px] overflow-hidden">
                  <img
                    src={selectedService.imageUrl}
                    alt={selectedService.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={closeServiceDetail}
                    className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>

                <div className="p-8">
                  {!showContactForm ? (
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <h2 className="text-3xl font-bold text-zinc-900">
                          {selectedService.title}
                        </h2>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          Service
                        </span>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-semibold mb-3 text-zinc-900">
                            Overview
                          </h3>
                          <p className="text-gray-600">
                            {selectedService.description}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-xl font-semibold mb-3 text-zinc-900">
                            Key Benefits
                          </h3>
                          <ul className="list-disc pl-5 text-gray-600 space-y-2">
                            <li>Enhanced brand visibility and recognition</li>
                            <li>Increased engagement with target audience</li>
                            <li>Improved conversion rates and ROI</li>
                            <li>Data-driven insights and performance tracking</li>
                            <li>
                              Customized strategies tailored to your business goals
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-xl font-semibold mb-3 text-zinc-900">
                            Our Approach
                          </h3>
                          <p className="text-gray-600">
                            We take a collaborative approach to understand your
                            business needs and develop strategies that align with
                            your goals. Our team of experts works closely with you
                            to ensure maximum impact and results.
                          </p>
                        </div>

                        <div className="pt-4">
                          <button 
                            onClick={handleContactClick}
                            className="px-8 py-3 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-colors duration-300"
                          >
                            Contact Us About This Service
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <h2 className="text-3xl font-bold text-zinc-900">
                          Contact Us About {selectedService.title}
                        </h2>
                        <button
                          onClick={() => setShowContactForm(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>

                      {formStatus.submitted ? (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="32"
                              height="32"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
                          <p className="text-gray-600 mb-6">
                            Your request for {selectedService.title} service has been submitted successfully. 
                            Our team will contact you shortly.
                          </p>
                          <button
                            onClick={closeServiceDetail}
                            className="px-6 py-2 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-colors duration-300"
                          >
                            Close
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                          {formStatus.error && (
                            <div className="p-3 bg-red-50 text-red-700 rounded-lg">
                              {formStatus.error}
                            </div>
                          )}
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Service
                            </label>
                            <input
                              type="text"
                              value={selectedService.title}
                              className="w-full px-3 py-2 border text-zinc-900 border-gray-300 rounded-md bg-gray-100"
                              disabled
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border text-zinc-900 border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email Address *
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border text-zinc-900 border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Phone Number *
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border text-zinc-900 border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Message
                            </label>
                            <textarea
                              name="message"
                              value={formData.message}
                              onChange={handleInputChange}
                              rows="4"
                              className="w-full px-3 py-2 border text-zinc-900 border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            ></textarea>
                          </div>
                          
                          <div className="flex justify-end space-x-3 pt-4">
                            <button
                              type="button"
                              onClick={() => setShowContactForm(false)}
                              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              Back
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                            >
                              Submit Request
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
