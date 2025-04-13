"use client";

import { useState, useEffect } from "react";
import { FiTrash2, FiMail } from "react-icons/fi";

const CURRENT_USER = "Patil5913";
const CURRENT_DATETIME = "2025-04-04 10:42:43";

export default function ContactRequestsTable() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/contacts");
      const data = await response.json();

      if (data.success) {
        setRequests(data.data);
      } else {
        setError("Failed to fetch contact requests");
      }
    } catch (error) {
      setError("Failed to load contact requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      const response = await fetch(`/api/contacts/${requestId}`, {
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
        await fetchRequests();
      } else {
        setError("Failed to update status");
      }
    } catch (error) {
      setError("Failed to update status");
    }
  };

  const handleDelete = async (requestId) => {
    if (window.confirm("Are you sure you want to delete this contact request?")) {
      try {
        const response = await fetch(`/api/contacts/${requestId}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (data.success) {
          await fetchRequests();
        } else {
          setError("Failed to delete request");
        }
      } catch (error) {
        setError("Failed to delete request");
      }
    }
  };

  const handleSendEmail = (email) => {
    window.location.href = `mailto:${email}`;
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "new":
        return "bg-yellow-100 text-yellow-800";
      case "read":
        return "bg-blue-100 text-blue-800";
      case "replied":
        return "bg-green-100 text-green-800";
      case "resolved":
        return "bg-purple-100 text-purple-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
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
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Subject
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Message
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Received
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {requests.map((request) => (
            <tr key={request._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                  <div className="text-sm font-medium text-gray-900">
                    {request.name}
                  </div>
                  <div className="text-sm text-gray-500">{request.email}</div>
                  <div className="text-sm text-gray-500">{request.phone}</div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{request.subject}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 max-w-xs truncate">
                  {request.message}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <select
                  value={request.status}
                  onChange={(e) => handleStatusUpdate(request._id, e.target.value)}
                  className={`text-sm font-semibold px-2.5 py-0.5 rounded-full ${getStatusBadgeClass(
                    request.status
                  )}`}
                >
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="resolved">Resolved</option>
                  <option value="archived">Archived</option>
                </select>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{request.createdAt}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={() => handleSendEmail(request.email)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <FiMail className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(request._id)}
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
      
      {requests.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          No contact requests found
        </div>
      )}
    </div>
  );
}