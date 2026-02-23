const API_URL = "http://localhost:5000/api";

export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      "x-role": "admin"
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error("API Error");
  }

  return res.json();
};