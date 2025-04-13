"use client";

import { useState, useEffect } from "react";
import { FiTrash2, FiEdit2 } from "react-icons/fi";

const CURRENT_USER = "Patil5913";
const CURRENT_DATETIME = "2025-04-04 10:30:00";

export default function ServiceTable({ onEdit }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/services");
      const data = await response.json();

      if (data.success) {
        setServices(data.data);
      } else {
        setError("Failed to fetch services");
      }
    } catch (error) {
      setError("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        const response = await fetch(`/api/services/${id}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (data.success) {
          await fetchServices();
        } else {
          setError("Failed to delete service");
        }
      } catch (error) {
        setError("Failed to delete service");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <div
          key={service._id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {service.name}
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(service)}
                className="text-indigo-600 hover:text-indigo-900"
              >
                <FiEdit2 className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleDelete(service._id)}
                className="text-red-600 hover:text-red-900"
              >
                <FiTrash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">{service.description}</p>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Price: ${service.price}</span>
            <span>Duration: {service.duration} mins</span>
          </div>
          <div className="mt-4 text-xs text-gray-400">
            Last updated: {service.lastModified}
          </div>
        </div>
      ))}

      {services.length === 0 && (
        <div className="col-span-full text-center py-4 text-gray-500">
          No services found
        </div>
      )}
    </div>
  );
}