"use client";

import { createContext, useContext, useState } from 'react';

const TrainingContext = createContext();

export function TrainingProvider({ children }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/training-courses');
      const data = await response.json();
      if (data.success) {
        setCourses(data.data);
      } else {
        setError('Failed to fetch courses');
      }
    } catch (error) {
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const createCourse = async (courseData) => {
    try {
      const response = await fetch('/api/training-courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...courseData,
          createdAt: "2025-04-04 07:33:03",
          lastModified: "2025-04-04 07:33:03",
          createdBy: "Bytewave Admin",
          statusHistory: [
            {
              status: 'active',
              note: 'Course created',
              updatedAt: "2025-04-04 07:33:03",
              updatedBy: "Bytewave Admin"
            }
          ]
        }),
      });
      const data = await response.json();
      if (data.success) {
        await fetchCourses();
        return data;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      throw error;
    }
  };

  const updateCourse = async (id, courseData) => {
    try {
      const response = await fetch(`/api/training-courses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...courseData,
          lastModified: "2025-04-04 07:33:03",
          statusHistory: [
            {
              status: courseData.status || 'active',
              note: 'Course updated',
              updatedAt: "2025-04-04 07:33:03",
              updatedBy: "Bytewave Admin"
            }
          ]
        }),
      });
      const data = await response.json();
      if (data.success) {
        await fetchCourses();
        return data;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      throw error;
    }
  };

  const deleteCourse = async (id) => {
    try {
      const response = await fetch(`/api/training-courses/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deletedAt: "2025-04-04 07:33:03",
          deletedBy: "Bytewave Admin",
        }),
      });
      const data = await response.json();
      if (data.success) {
        await fetchCourses();
        return data;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      throw error;
    }
  };

  const getCourse = async (id) => {
    try {
      const response = await fetch(`/api/training-courses/${id}`);
      const data = await response.json();
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      throw error;
    }
  };

  const searchCourses = async (query) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/training-courses/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (data.success) {
        setCourses(data.data);
      } else {
        setError('Failed to search courses');
      }
    } catch (error) {
      setError('Failed to search courses');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TrainingContext.Provider
      value={{
        courses,
        loading,
        error,
        fetchCourses,
        createCourse,
        updateCourse,
        deleteCourse,
        getCourse,
        searchCourses,
      }}
    >
      {children}
    </TrainingContext.Provider>
  );
}

export function useTraining() {
  const context = useContext(TrainingContext);
  if (!context) {
    throw new Error('useTraining must be used within a TrainingProvider');
  }
  return context;
}