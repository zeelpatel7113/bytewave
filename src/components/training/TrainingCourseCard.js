"use client";

import { useState, useEffect } from "react";
import { FiTrash2, FiEdit2 } from "react-icons/fi";

const CURRENT_USER = "Patil5913";
const CURRENT_DATETIME = "2025-04-04 10:33:25";

export default function TrainingCourseCard({ onEdit }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = async () => {
    try {
      const response = await fetch("/api/training-courses");
      const data = await response.json();

      if (data.success) {
        setCourses(data.data);
      } else {
        setError("Failed to fetch courses");
      }
    } catch (error) {
      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        const response = await fetch(`/api/training-courses/${id}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (data.success) {
          await fetchCourses();
        } else {
          setError("Failed to delete course");
        }
      } catch (error) {
        setError("Failed to delete course");
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
      {courses && courses.length > 0 ? courses.map((course) => (
        <div
          key={course._id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {course?.title }
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(course)}
                className="text-indigo-600 hover:text-indigo-900"
              >
                <FiEdit2 className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleDelete(course._id)}
                className="text-red-600 hover:text-red-900"
              >
                <FiTrash2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            {course?.description || 'No description available'}
          </p>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">{course?.duration || 'N/A'} hours</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Level:</span>
              <span className="font-medium">{course?.level || 'N/A'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Price:</span>
              <span className="font-medium">${course?.price || '0'}</span>
            </div>
            {course?.schedule && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Schedule:</span>
                <span className="font-medium">{course.schedule}</span>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Created: {course?.createdAt || CURRENT_DATETIME}</span>
              <span>By: {course?.createdBy || CURRENT_USER}</span>
            </div>
          </div>
        </div>
      )) : (
        <div className="col-span-full text-center py-4 text-gray-500">
          No courses found
        </div>
      )}
    </div>
  );
}