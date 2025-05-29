import { motion } from "framer-motion";
import ServiceForm from "./ServiceForm";

export default function ServiceDetailModal({
  selectedService,
  showContactForm,
  formData,
  formStatus,
  onClose,
  onContactClick,
  onInputChange,
  onSubmit,
  onShowFormChange,
}) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
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
              onClick={onClose}
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
                    {selectedService.serviceType || "Service"}
                  </span>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-zinc-900">
                      Overview
                    </h3>
                    <p className="text-gray-600">{selectedService.overview}</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-zinc-900">
                      Key Benefits
                    </h3>
                    <ul className="list-disc pl-5 text-gray-600 space-y-2">
                      {selectedService.keyBenefits.map((benefit, index) => (
                        <li key={index}>{benefit.point}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-zinc-900">
                      Our Approach
                    </h3>
                    <p className="text-gray-600">{selectedService.approach}</p>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={onContactClick}
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
                    onClick={() => onShowFormChange(false)}
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

                <ServiceForm
                  formData={formData}
                  formStatus={formStatus}
                  selectedService={selectedService}
                  onInputChange={onInputChange}
                  onSubmit={onSubmit}
                  onBack={() => onShowFormChange(false)}
                />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}