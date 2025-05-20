"use client";

import { FiEdit2, FiTrash2 } from "react-icons/fi";

export default function ServiceCard({ service, onEdit, onDelete }) {
  return (
    <div className="relative group bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="relative h-64 overflow-hidden">
        {service.imageUrl ? (
          <img
            src={service.imageUrl}
            alt={service.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}

        {/* Title that's always visible */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
          <h3 className="text-xl font-semibold text-white">{service.title}</h3>
        </div>

        {/* Hover overlay with content */}
        <div className="absolute inset-0 bg-black/40 translate-y-full group-hover:translate-y-0 transition-all duration-300">
          <div className="h-full flex flex-col justify-center items-center p-6">
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-white mb-3">
                {service.title}
              </h3>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm inline-block mb-4">
                {service.category}
              </span>
              <p className="text-gray-200 text-sm mb-4 max-w-md mx-auto">
                {service.description}
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => onEdit(service)}
                  className="text-white hover:text-blue-400 transition-colors"
                >
                  <FiEdit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onDelete(service._id)}
                  className="text-white hover:text-red-400 transition-colors"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
