// Fetch all training courses
export const fetchTrainingCourses = async () => {
  try {
    const response = await fetch("/api/training-courses");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching training courses:", error);
    throw new Error("Failed to fetch training courses");
  }
};

// Submit training request
export const submitTrainingRequest = async (formData) => {
  try {
    console.log("Submitting training request with data:", {
      name: formData.name,
      email: formData.email,
      submissionId: formData.submissionId,
    });

    const response = await fetch("/api/training-requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to submit training request");
    }

    return data;
  } catch (error) {
    console.error("Error submitting training request:", error);
    throw error;
  }
};

// Get single training course
export const getTrainingCourse = async (trainingId) => {
  try {
    const response = await fetch(`/api/training-courses/${trainingId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch training course");
    }

    return data;
  } catch (error) {
    console.error("Error fetching training course:", error);
    throw error;
  }
};

// Update training request
export const updateTrainingRequest = async (requestId, updateData) => {
  try {
    const response = await fetch(`/api/training-requests/${requestId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update training request");
    }

    return data;
  } catch (error) {
    console.error("Error updating training request:", error);
    throw error;
  }
};
