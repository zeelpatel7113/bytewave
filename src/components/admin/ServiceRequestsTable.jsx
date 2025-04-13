'use client';

import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const formatDateTime = (date) => {
  const d = new Date(date);
  return d.toISOString().slice(0, 19).replace('T', ' ');
};

const getCurrentDateTime = () => {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
};

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'followup1', label: 'Follow Up 1' },
  { value: 'followup2', label: 'Follow Up 2' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' }
];

export default function ServiceRequestsTable() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    requestId: null
  });
  const [updateForm, setUpdateForm] = useState({
    status: '',
    note: ''
  });

  const currentUser = 'Bytewave Admin'; 

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/service-requests');
      const data = await response.json();
      
      if (data.success) {
        setRequests(data.data);
      } else {
        setError('Failed to fetch requests');
      }
    } catch (error) {
      setError('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/service-requests/${selectedRequest._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: updateForm.status,
          notes: updateForm.note,
          lastModified: getCurrentDateTime(),
          statusHistory: [
            ...selectedRequest.statusHistory || [],
            {
              status: updateForm.status,
              note: updateForm.note,
              updatedAt: getCurrentDateTime(),
              updatedBy: currentUser
            }
          ]
        }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchRequests();
        setShowUpdateModal(false);
        setSelectedRequest(null);
        setUpdateForm({ status: '', note: '' });
      }
    } catch (error) {
      setError('Failed to update request');
    }
  };

  const handleDelete = async (requestId) => {
    try {
      const response = await fetch(`/api/service-requests/${requestId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setRequests(requests.filter(request => request._id !== requestId));
        setDeleteConfirmation({ show: false, requestId: null });
      } else {
        setError('Failed to delete request');
      }
    } catch (error) {
      setError('Failed to delete request');
    }
  };

  const toggleRow = (requestId) => {
    setExpandedRow(expandedRow === requestId ? null : requestId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="w-10 px-6 py-3"></th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Service
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Notes
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {requests.map((request) => (
            <React.Fragment key={request._id}>
              <tr>
                <td className="pl-4">
                  <button 
                    onClick={() => toggleRow(request._id)} 
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {expandedRow === request._id ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDateTime(request.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {request.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{request.email}</div>
                  <div className="text-sm text-gray-500">{request.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {request.serviceId.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${request.status === 'followup1' ? 'bg-blue-100 text-blue-800' : ''}
                    ${request.status === 'followup2' ? 'bg-purple-100 text-purple-800' : ''}
                    ${request.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                    ${request.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    {request.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {request.notes || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => {
                        setSelectedRequest(request);
                        setUpdateForm({ 
                          status: request.status, 
                          note: '' 
                        });
                        setShowUpdateModal(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <FiEdit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmation({ 
                        show: true, 
                        requestId: request._id 
                      })}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
              {expandedRow === request._id && (
                <tr>
                  <td colSpan="8" className="px-6 py-4 bg-gray-50">
                    <div className="space-y-2">
                      {request.statusHistory && request.statusHistory.map((history, index) => (
                        <div key={index} className="bg-white p-3 rounded-lg shadow-sm">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                ${history.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                                ${history.status === 'followup1' ? 'bg-blue-100 text-blue-800' : ''}
                                ${history.status === 'followup2' ? 'bg-purple-100 text-purple-800' : ''}
                                ${history.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                                ${history.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                              `}>
                                {history.status}
                              </span>
                              <p className="mt-1 text-sm text-gray-600">{history.note}</p>
                            </div>
                            <div className="text-xs text-gray-500">
                              <div>{formatDateTime(history.updatedAt)}</div>
                              <div>By: {history.updatedBy}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Update Modal */}
      {showUpdateModal && selectedRequest && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowUpdateModal(false)}></div>
            
            <div className="relative bg-white rounded-lg w-full max-w-md p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Update Status</h3>
              
              <form onSubmit={handleUpdateSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={updateForm.status}
                    onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Note</label>
                  <textarea
                    value={updateForm.note}
                    onChange={(e) => setUpdateForm({ ...updateForm, note: e.target.value })}
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                    placeholder="Add a note for this status update..."
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowUpdateModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75" 
              onClick={() => setDeleteConfirmation({ show: false, requestId: null })}
            />
            
            <div className="relative bg-white rounded-lg w-full max-w-md p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Confirm Deletion
              </h3>
              
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to delete this service request? This action cannot be undone.
              </p>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmation({ show: false, requestId: null })}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(deleteConfirmation.requestId)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}