"use client";

import { useState, useEffect } from "react";
import { FiTrash2, FiDownload } from "react-icons/fi";

const CURRENT_USER = "Patil5913";
const CURRENT_DATETIME = "2025-04-04 10:27:14";

export default function CareerRequestsTable() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApplications = async () => {
    try {
      const response = await fetch("/api/careers");
      const data = await response.json();

      if (data.success) {
        setApplications(data.data);
      } else {
        setError("Failed to fetch applications");
      }
    } catch (error) {
      setError("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      const response = await fetch(`/api/careers/${applicationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          note: `Status updated to ${newStatus}`,
          updatedAt: CURRENT_DATETIME,
          updatedBy: CURRENT_USER,
        }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchApplications();
      } else {
        setError("Failed to update status");
      }
    } catch (error) {
      setError("Failed to update status");
    }
  };

  const handleDelete = async (applicationId) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      try {
        const response = await fetch(`/api/careers/${applicationId}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (data.success) {
          await fetchApplications();
        } else {
          setError("Failed to delete application");
        }
      } catch (error) {
        setError("Failed to delete application");
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "reviewing":
        return "bg-blue-100 text-blue-800";
      case "interviewed":
        return "bg-purple-100 text-purple-800";
      case "selected":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-900 uppercase tracking-wider">
              Applicant
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-900 uppercase tracking-wider">
              Position
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-900 uppercase tracking-wider">
              Experience
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-900 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-900 uppercase tracking-wider">
              Applied
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {applications.map((application) => (
            <tr key={application._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                  <div className="text-sm font-medium text-zinc-900">
                    {application.name}
                  </div>
                  <div className="text-sm text-zinc-900">{application.email}</div>
                  <div className="text-sm text-zinc-900">{application.phone}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-zinc-900">{application.position}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-zinc-900">
                  {application.experience} years
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <select
                  value={application.status}
                  onChange={(e) => handleStatusUpdate(application._id, e.target.value)}
                  className={`text-sm font-semibold px-2.5 py-0.5 rounded-full ${getStatusBadgeClass(
                    application.status
                  )}`}
                >
                  <option value="pending">Pending</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="interviewed">Interviewed</option>
                  <option value="selected">Selected</option>
                  <option value="rejected">Rejected</option>
                </select>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{application.createdAt}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                  <a
                    href={application.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <FiDownload className="h-5 w-5" />
                  </a>
                  <button
                    onClick={() => handleDelete(application._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {applications.length === 0 && (
        <div className="text-center py-4 text-zinc-900">
          No applications found
        </div>
      )}
    </div>
);
}