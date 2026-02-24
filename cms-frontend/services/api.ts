import { useAppStore } from "@/stores/useAppStore";

const API_URL = "http://localhost:5000/api";

export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const role = useAppStore.getState().role;

  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      "x-role": role,
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "API Error");
  }

  return res.json();
};