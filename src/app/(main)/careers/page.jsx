"use client";
import React, { useState } from "react";
import { motion, useScroll } from "framer-motion";
import { MapPin, Clock, Building, X } from "lucide-react";

function App() {
  const [selectedFilter, setSelectedFilter] = useState("View all");
  const [wordOpacities, setWordOpacities] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    resumeFile: null,
    resumeUrl: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState({ type: "", message: "" });

  const filters = [
    "View all",
    "Development",
    "Design",
    "Marketing",
    "Customer Service",
    "Operations",
    "Finance",
    "Management",
  ];

  const jobs = [
    {
      title: "Senior Frontend Developer",
      description:
        "Join our team to build cutting-edge web applications using modern technologies like React, Next.js, and TypeScript.",
      type: "Development",
      workType: "Full-time",
      location: "Remote",
      department: "Engineering",
      experience: "5+ years",
      level: "Senior",
      skills: ["React", "Next.js", "TypeScript", "Modern JavaScript"],
    },
    {
      title: "UX/UI Designer",
      description:
        "Create beautiful and intuitive user experiences for our digital products and services.",
      type: "Design",
      workType: "Full-time",
      location: "Hybrid",
      department: "Design",
      experience: "3+ years",
      level: "Mid-Senior",
      skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
    },
    {
      title: "Marketing Manager",
      description:
        "Lead our marketing initiatives and drive growth through innovative digital marketing strategies.",
      type: "Marketing",
      workType: "Full-time",
      location: "On-site",
      department: "Marketing",
      experience: "4+ years",
      skills: ["Digital Marketing", "SEO", "Content Strategy", "Analytics"],
      level: "Senior",
    },
    {
      title: "Customer Success Specialist",
      description:
        "Help our clients achieve their goals by providing exceptional support and guidance.",
      type: "Customer Service",
      workType: "Full-time",
      location: "Remote",
      department: "Customer Success",
      experience: "2+ years",
      skills: ["Client Relations", "Problem Solving", "Communication", "CRM"],
      level: "Mid",
    },
    {
      title: "Operations Coordinator",
      description:
        "Ensure smooth day-to-day operations and help scale our business processes.",
      type: "Operations",
      workType: "Part-time",
      location: "Hybrid",
      department: "Operations",
      experience: "1-2 years",
      skills: ["Project Management", "Process Optimization", "Documentation"],
      level: "Entry-Mid",
    },
    {
      title: "Financial Analyst",
      description:
        "Drive financial planning and analysis to support business growth and decision-making.",
      type: "Finance",
      workType: "Full-time",
      location: "On-site",
      department: "Finance",
      experience: "3+ years",
      skills: ["Financial Modeling", "Data Analysis", "Forecasting", "Excel"],
      level: "Mid-Senior",
    },
  ];

  const descriptionText =
    "We provide and encourage through-the-line marketing services – an integrated approach for our commercial partners to use both, above the line and below the line, traditional marketing methods to reach their targets. We help to create awareness and engagement utilising a marketing mix that leads to conversion.";
  const words = descriptionText.split(" ");
  const { scrollYProgress } = useScroll();

  // Remove the first useEffect since we're using framer-motion's scroll progress
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

  const handleApplyNow = (job) => {
    setSelectedJob(job);
    setFormData({
      ...formData,
      position: job.title,
      experience: job.experience.replace(/\+\s*years/, "").trim(),
    });

    // Scroll to form
    document.getElementById("application-form").scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create FormData object for file upload
      const formDataToSend = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'resumeFile' && formData[key]) {
          formDataToSend.append('resume', formData[key]);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      const response = await fetch("/api/careers", {
        method: "POST",
        body: formDataToSend, // Send FormData instead of JSON
        // Remove Content-Type header to let browser set it with boundary for multipart/form-data
      });
      const data = await response.json();

      if (data.success) {
        setFormStatus({
          type: "success",
          message: "Application submitted successfully!",
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          position: selectedJob ? selectedJob.title : "",
          experience: "",
          resumeFile: null,
          resumeUrl: "",
          message: "",
        });

        // Reset form status after 3 seconds
        setTimeout(() => {
          setFormStatus({ type: "", message: "" });
        }, 3000);
      } else {
        setFormStatus({
          type: "error",
          message: data.message || "Submission failed",
        });
      }
    } catch (error) {
      setFormStatus({ type: "error", message: "Failed to submit application" });
    }
  };

  // Remove the scroll animation code since it's not needed for the design
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
            Career
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-12">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedFilter === filter
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Job Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs
            .filter(
              (job) =>
                selectedFilter === "View all" || job.type === selectedFilter
            )
            .map((job, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl border border-gray-300 hover:shadow-sm transition-all duration-300"
              >
                <span className="text-blue-600 text-sm font-medium">
                  {job.department}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-2 mb-3">
                  {job.title}
                </h3>
                <p className="text-gray-600 text-sm mb-6">{job.description}</p>

                <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-zinc-300">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-900 font-medium text-lg">
                      {job.level}
                    </span>
                    <span className="text-blue-600 text-sm">
                      {job.experience}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, idx) => (
                      <motion.span
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="px-3 py-1.5 bg-blue-50 text-zinc-600 rounded-lg text-sm border border-blue-300 transition-all duration-300"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{job.workType}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {job.location === "Remote" ? (
                      <MapPin className="w-4 h-4" />
                    ) : (
                      <Building className="w-4 h-4" />
                    )}
                    <span>{job.location}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleApplyNow(job)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  Apply Now
                  <span>→</span>
                </button>
              </motion.div>
            ))}
        </div>
      </div>

      {/* Application Form Section - Added directly to the page */}
      <div className="bg-gray-50 py-16 mt-12" id="application-form">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-sm p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {selectedJob
                ? `Apply for ${selectedJob.title}`
                : "Apply for a Position"}
            </h2>

            {formStatus.message && (
              <div
                className={`p-4 rounded-md mb-6 ${
                  formStatus.type === "success"
                    ? "bg-green-50 text-green-800"
                    : "bg-red-50 text-red-800"
                }`}
              >
                {formStatus.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-900">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-zinc-900"
                  
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-900">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-zinc-900"
                  
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-900">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-zinc-900"
                  
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-900">
                  Position
                </label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-zinc-900"
                  
                >
                  <option value="">Select a position</option>
                  {jobs.map((job, index) => (
                    <option key={index} value={job.title}>
                      {job.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-900">
                  Experience (years)
                </label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-zinc-900"
                  
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-900">
                  Resume
                </label>
                <div className="mt-1 flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-3 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                      </svg>
                      <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-500">PDF, DOC, DOCX (MAX. 5MB)</p>
                    </div>
                    <input 
                      type="file" 
                      name="resume" 
                      className="hidden" 
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          // Update form data with file
                          setFormData({
                            ...formData,
                            resumeFile: file,
                            resumeUrl: file.name // Store filename for display
                          });
                        }
                      }}
                      
                    />
                  </label>
                </div>
                {formData.resumeUrl && (
                  <div className="mt-2 flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>File selected: {formData.resumeUrl}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-900">
                  Cover Letter / Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="4"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-zinc-900"
                  
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
              >
                Submit Application
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default App;
