import { API_BASE_URL, DEFAULT_HEADERS } from "@/shared/constants/api.js";

function getHeaders(options = {}) {
  const { token } = options;
  const headers = { ...DEFAULT_HEADERS };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export async function getFranchiseeDashboard(options = {}) {
  const url = `${API_BASE_URL}/api/franchisee/dashboard`;
  const response = await fetch(url, {
    method: "GET",
    headers: getHeaders(options),
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
