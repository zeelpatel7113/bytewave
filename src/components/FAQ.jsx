import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useInView } from "@/hooks/useInView";

function FAQ() {
  const [headerRef, headerVisible] = useInView({ threshold: 0.1 });
  const [contentRef, contentVisible] = useInView({ threshold: 0.1 });
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What services do you offer?",
      answer:
        "We specialise in staffing, recruitment, career training, and placement support.",
    },
    {
      question: "Which industries do you serve most?",
      answer:
        "We work across IT, finance, healthcare, consulting, and professional services.",
    },
    {
      question: "How do you vet candidates’ skills?",
      answer:
        "Through structured assessments, interviews, and expert evaluation.",
    },
    {
      question: "How do you help candidates stand out?",
      answer:
        "By offering resume enhancement, interview preparation, and personalised recruiter support.",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="py-12 md:py-16 lg:py-20 px-4 md:px-8">
      <div
        ref={headerRef}
        className={`text-center mb-10 md:mb-16 transition-all duration-700 transform ${
          headerVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Frequently Asked Questions
        </h2>
      </div>
      <div
        ref={contentRef}
        className={`max-w-3xl mx-auto transition-all duration-700 delay-200 transform ${
          contentVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
      >
        {faqs.map((faq, index) => (
          <div key={index} className="mb-4 border-b border-gray-200 pb-4">
            <button
              className="flex justify-between items-center w-full text-left py-4 focus:outline-none"
              onClick={() => toggleFAQ(index)}
            >
              <span className="text-base md:text-lg font-medium text-gray-900 pr-4">
                {faq.question}
              </span>
              {activeIndex === index ? (
                <ChevronUp className="w-5 h-5 text-[#4CAF50] flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[#4CAF50] flex-shrink-0" />
              )}
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                activeIndex === index
                  ? "max-h-96 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <p className="text-gray-600 py-4 text-sm md:text-base">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQ;
