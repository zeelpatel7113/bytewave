// Utility functions for Services API calls
export async function fetchServices() {
  try {
    const response = await fetch("/api/services");
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch services");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
}

export async function submitServiceRequest(formData) {
  try {
    const response = await fetch("/api/service-requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        serviceId: formData.serviceId || undefined,
        requestId: formData.requestId || undefined, // Let backend generate if not provided
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to submit service request");
    }

    return data;
  } catch (error) {
    console.error("Error submitting service request:", error);
    throw error;
  }
}
