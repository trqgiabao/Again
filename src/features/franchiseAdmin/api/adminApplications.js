import { API_BASE_URL, getAuthHeaders } from "@/shared/constants/api.js";

export async function getApplicationStatuses() {
  const url = `${API_BASE_URL}/api/admin/franchise/applications/statuses`;
  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json?.message || "Failed to fetch application statuses");
  }
  return Array.isArray(json) ? json : (json?.data ?? []);
}

export async function getAdminSiteInspections(params = {}) {
  const { page = 1, pageSize = 20, status, region, search } = params;
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(page));
  searchParams.set("pageSize", String(pageSize));
  if (status && status !== "All") searchParams.set("status", status);
  if (region && region !== "All") searchParams.set("region", region);
  if (search && search.trim()) searchParams.set("search", search.trim());

  const url = `${API_BASE_URL}/api/admin/site-inspections?${searchParams.toString()}`;
  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json?.message || "Failed to fetch site inspections");
  }
  if (!json?.succeeded || !json?.data) {
    throw new Error(json?.message || "Invalid response");
  }
  return json.data;
}

export async function getAdminSiteInspectionDetail(inspectionId) {
  const url = `${API_BASE_URL}/api/admin/site-inspections/${inspectionId}`;
  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json?.message || "Failed to fetch site inspection detail");
  }
  if (!json?.succeeded || !json?.data) {
    throw new Error(json?.message || "Invalid response");
  }
  return json.data;
}

export async function approveAdminSiteInspection(inspectionId, body = {}) {
  const url = `${API_BASE_URL}/api/admin/site-inspections/${inspectionId}/approve`;
  const response = await fetch(url, {
    method: "PATCH",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json?.message || "Failed to approve site inspection");
  }
  return json;
}

export async function rejectAdminSiteInspection(inspectionId, body = {}) {
  const url = `${API_BASE_URL}/api/admin/site-inspections/${inspectionId}/reject`;
  const response = await fetch(url, {
    method: "PATCH",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json?.message || "Failed to reject site inspection");
  }
  return json;
}

export async function getAdminApplications(params = {}) {
  const { page = 1, pageSize = 20, status, preferredRegion, search } = params;
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(page));
  searchParams.set("pageSize", String(pageSize));
  if (status && status !== "All") searchParams.set("status", status);
  if (preferredRegion && preferredRegion !== "All") searchParams.set("preferredRegion", preferredRegion);
  if (search && search.trim()) searchParams.set("search", search.trim());

  const url = `${API_BASE_URL}/api/admin/franchise/applications?${searchParams.toString()}`;
  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
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

export async function getAdminApplicationDetail(applicationId) {
  const url = `${API_BASE_URL}/api/admin/franchise/applications/${applicationId}`;
  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
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

export async function approveAdminApplication(applicationId) {
  const url = `${API_BASE_URL}/api/admin/franchise/applications/${applicationId}/approve`;
  const response = await fetch(url, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json?.message || "Failed to approve application");
  }
  return json;
}

export async function rejectAdminApplication(applicationId, body = {}) {
  const url = `${API_BASE_URL}/api/admin/franchise/applications/${applicationId}/reject`;
  const response = await fetch(url, {
    method: "PATCH",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json?.message || "Failed to reject application");
  }
  return json;
}

export async function getAdminFranchisees(params = {}) {
  const { page = 1, pageSize = 20, status, search } = params;
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(page));
  searchParams.set("pageSize", String(pageSize));
  if (status && status !== "All") searchParams.set("status", status);
  if (search && search.trim()) searchParams.set("search", search.trim());

  const url = `${API_BASE_URL}/api/admin/franchisees/all?${searchParams.toString()}`;
  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json?.message || "Failed to fetch franchisees");
  }
  if (!json?.succeeded || !json?.data) {
    throw new Error(json?.message || "Invalid response");
  }
  return json.data;
}

export async function createAdminFranchiseContract(body = {}) {
  const url = `${API_BASE_URL}/api/admin/franchise/contracts`;
  const response = await fetch(url, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json?.message || "Failed to create contract");
  }
  if (!json?.succeeded || !json?.data) {
    throw new Error(json?.message || "Invalid response");
  }
  return json.data;
}
