import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, LazyMotion, domAnimation, m } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Career Consultation & Planning',
    description: 'Kickstart your path with expert advice'
  },
  {
    number: '02',
    title: 'Skill Training & Development',
    description: 'Build market-ready capabilities'
  },
  {
    number: '03',
    title: 'Professional Resume Crafting',
    description: 'Showcase your best profile'
  },
  {
    number: '04',
    title: 'Resume Review & Workshop',
    description: 'Sharpen your strengths'
  },
  {
    number: '05',
    title: 'Dedicated Recruiter Support',
    description: 'Your advocate in the job market'
  },
  {
    number: '06',
    title: 'Interview Coaching Program',
    description: 'Confidence to secure offers'
  },
  {
    number: '07',
    title: 'Onboarding & HR Assistance',
    description: 'Smooth transition into roles'
  },
  {
    number: '08',
    title: 'Compliance & Background Checks',
    description: 'Final step to assured placements'
  }
];

const ProcessSection = () => {
  const descriptionText = "Our structured 8-step hiring process removes the guesswork from placements.Whether you’re a candidate, recruiter, or employer, we partner with you at every stage.";
  
  // Removed container variants since we don't want card animations

  return (
    <LazyMotion features={domAnimation}>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 bg-zinc-100 rounded-4xl overflow-hidden">
        {/* Header Section */}
        <m.div 
          className="sm:px-8 mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ 
            type: "spring",
            stiffness: 70,
            damping: 20,
            duration: 1
          }}
        >
          <div className="text-blue-600 text-center font-medium text-2xl mb-6">
            / Our Process
          </div>
          <h1 className="text-4xl text-center md:text-6xl font-bold leading-tight text-zinc-900 mb-8">
            Your journey to success in 8 simple steps
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto text-center">
            {descriptionText}
          </p>
        </m.div>

        {/* Steps Grid - Removed variants and animation from the container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <div 
              key={step.number}
              className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all duration-300 group cursor-pointer"
              // Removed variants and animations from the card
            >
              <m.div 
                className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6"
                initial={{ scale: 0, x: 30 }}
                whileInView={{ scale: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.1 + 0.2,
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
              >
                <span className="text-xl font-bold text-blue-600">
                  {step.number}
                </span>
              </m.div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center group-hover:text-blue-600 transition-colors">
                {step.title}
                <m.span
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.4 }}
                  viewport={{ once: true }}
                  className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {/* <ArrowRight className="h-4 w-4" /> */}
                </m.span>
              </h3>
              
              <m.p 
                className="text-gray-600"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.1 + 0.3,
                  duration: 0.5
                }}
              >
                {step.description}
              </m.p>
            </div>
          ))}
        </div>
      </section>
    </LazyMotion>
  );
};

export default ProcessSection;