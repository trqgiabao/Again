import { API_BASE_URL, getAuthHeaders } from "@/shared/constants/api.js";

export async function getFranchiseeDashboard() {
  const url = `${API_BASE_URL}/api/franchisee/dashboard`;
  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json?.message || "Failed to load dashboard");
  }
  if (!json?.succeeded) {
    throw new Error(json?.message || "Invalid response");
  }
  return json.data != null ? json.data : json;
}
