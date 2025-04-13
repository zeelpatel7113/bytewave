'use client';

import { FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function ServiceCard({ service, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow duration-300">
      {service.imageUrl && (
        <div className="h-48 overflow-hidden rounded-t-xl">
          <img
            src={service.imageUrl}
            alt={service.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
          <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
            {service.category}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => onEdit(service)}
            className="text-blue-600 hover:text-blue-700"
          >
            <FiEdit2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(service._id)}
            className="text-red-600 hover:text-red-700"
          >
            <FiTrash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}