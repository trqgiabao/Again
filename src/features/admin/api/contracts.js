import { API_BASE_URL, getAuthHeaders } from "@/shared/constants/api.js";

export async function createContract(packageSelectionId, payload) {
  const url = `${API_BASE_URL}/api/admin/franchise/contracts`;
  const response = await fetch(url, {
    method: "POST",
    headers: getAuthHeaders(),
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

export async function sendContract(contractId) {
  const url = `${API_BASE_URL}/api/admin/franchise/contracts/${contractId}/send`;
  const response = await fetch(url, {
    method: "PATCH",
    headers: getAuthHeaders(),
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
