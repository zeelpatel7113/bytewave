export const submitCareerApplication = async (formData) => {
  try {
    const response = await fetch("/api/career-requests", { // Changed from /api/careers to /api/career
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Failed to submit application");
  }
};

export const getCareerPostings = async () => {
  try {
    const response = await fetch("/api/career-posting");
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Failed to fetch career postings");
  }
};