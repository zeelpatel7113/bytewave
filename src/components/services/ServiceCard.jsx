import { motion } from "framer-motion";

export default function ServiceCard({ service, index, onServiceClick }) {
  return (
    <motion.div
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
              {service.serviceType || "Service"}
            </span>
          </motion.div>

          <p className="text-gray-600 text-base line-clamp-3 group-hover:text-gray-700 transition-colors duration-300">
            {service.overview}
          </p>

          <motion.button
            onClick={() => onServiceClick(service)}
            className="mt-4 w-full inline-flex items-center justify-center space-x-2 px-6 py-3 bg-gray-900 text-white rounded-xl text-sm font-medium transition-all duration-300 hover:bg-blue-600 group"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <span>Learn More</span>
            <motion.span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </motion.span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}