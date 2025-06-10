import { motion } from "framer-motion";

export default function TrainingDetailModal({
  selectedTraining,
  onClose,
  onContactClick,
}) {
  // Handler for modal container click
  const handleContainerClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* Dark overlay */}
      <motion.div
        className="fixed inset-0 z-[60] bg-black/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal container */}
      <motion.div
        className="fixed inset-0 z-[70] flex items-start justify-center p-4 mt-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleContainerClick}
      >
        <motion.div
          className="bg-white rounded-2xl max-w-3xl w-full max-h-[calc(90vh-8rem)] overflow-hidden relative"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button - sticky */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 transition-colors z-[80]"
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

          {/* Scrollable content */}
          <div 
            className="overflow-y-auto max-h-[calc(90vh-8rem)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            <div className="relative">
              <div className="h-[350px] relative rounded-t-2xl overflow-hidden">
                <img
                  src={selectedTraining.imageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"}
                  alt={selectedTraining.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="p-8">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-3xl font-bold text-zinc-900">
                    {selectedTraining.title}
                  </h2>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {selectedTraining.category || "Training"}
                  </span>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-zinc-900">
                      Course Overview
                    </h3>
                    <p className="text-gray-600">{selectedTraining.overview}</p>
                  </div>

                  {selectedTraining.whatYouWillLearn && selectedTraining.whatYouWillLearn.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-zinc-900">
                        What You'll Learn
                      </h3>
                      <ul className="list-disc pl-5 text-gray-600 space-y-2">
                        {selectedTraining.whatYouWillLearn.map((item, index) => (
                          <li key={index}>{typeof item === 'object' ? item.point : item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedTraining.courseStructure && (
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-zinc-900">
                        Course Structure
                      </h3>
                      <p className="text-gray-600">
                        {selectedTraining.courseStructure}
                      </p>
                    </div>
                  )}

                  <div className="pt-4 flex justify-center">
                    <button
                      onClick={onContactClick}
                      className="px-8 py-3 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-colors duration-300"
                    >
                      Inquire About This Course
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}