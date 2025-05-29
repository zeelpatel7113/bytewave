'use client';

import { createContext, useContext, useState } from 'react';

const ServiceContext = createContext({});

// Export the provider as default
export default function ServiceProvider({ children }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/services');
      const data = await response.json();
      
      if (data.success) {
        setServices(data.data);
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch services');
      }
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createService = async (serviceData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData),
      });

      const data = await response.json();

      if (data.success) {
        await fetchServices();
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to create service');
      }
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateService = async (id, serviceData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/services/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData),
      });

      const data = await response.json();

      if (data.success) {
        await fetchServices();
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to update service');
      }
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        await fetchServices();
        return true;
      } else {
        throw new Error(data.message || 'Failed to delete service');
      }
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ServiceContext.Provider 
      value={{
        services,
        loading,
        error,
        fetchServices,
        createService,
        updateService,
        deleteService,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
}

// Export the hook separately
export function useService() {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useService must be used within a ServiceProvider');
  }
  return context;
}