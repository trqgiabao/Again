import { API_BASE_URL, DEFAULT_HEADERS } from "@/shared/constants/api.js";

export async function getAdminApplications(params = {}) {
  const { page = 1, pageSize = 20, status, preferredRegion } = params;
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(page));
  searchParams.set("pageSize", String(pageSize));
  if (status && status !== "All") searchParams.set("status", status);
  if (preferredRegion && preferredRegion !== "All") searchParams.set("preferredRegion", preferredRegion);

  const url = `${API_BASE_URL}/api/admin/franchise/applications?${searchParams.toString()}`;
  const response = await fetch(url, {
    method: "GET",
    headers: DEFAULT_HEADERS,
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json?.message || "Failed to fetch applications");
  }
  if (!json?.succeeded || !json?.data) {
    throw new Error(json?.message || "Invalid response");
  }
  return json.data;
}

export async function getAdminApplicationDetail(applicationId, options = {}) {
  const { token } = options;
  const headers = { ...DEFAULT_HEADERS };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const url = `${API_BASE_URL}/api/admin/franchise/applications/${applicationId}`;
  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json?.message || "Failed to fetch application detail");
  }
  if (!json?.succeeded || !json?.data) {
    throw new Error(json?.message || "Invalid response");
  }
  return json.data;
}
