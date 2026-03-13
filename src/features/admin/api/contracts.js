import { API_BASE_URL, DEFAULT_HEADERS } from "@/shared/constants/api.js";

function getHeaders(options = {}) {
  const { token } = options;
  const headers = { ...DEFAULT_HEADERS };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export async function createContract(packageSelectionId, payload, options = {}) {
  const url = `${API_BASE_URL}/api/admin/franchise/contracts`;
  const response = await fetch(url, {
    method: "POST",
    headers: getHeaders(options),
    body: JSON.stringify({
      packageSelectionId,
      startDate: payload.startDate,
      endDate: payload.endDate,
      region: payload.region ?? "",
      contractFileUrl: payload.contractFileUrl ?? "",
    }),
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json?.message || "Failed to create contract");
  }
  if (!json?.succeeded) {
    throw new Error(json?.message || "Invalid response");
  }
  return json.data != null ? json.data : json;
}

export async function sendContract(contractId, options = {}) {
  const url = `${API_BASE_URL}/api/admin/franchise/contracts/${contractId}/send`;
  const response = await fetch(url, {
    method: "PATCH",
    headers: getHeaders(options),
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json?.message || "Failed to send contract");
  }
  if (!json?.succeeded) {
    throw new Error(json?.message || "Invalid response");
  }
  return json.data != null ? json.data : json;
}
