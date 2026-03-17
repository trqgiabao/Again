import { API_BASE_URL, DEFAULT_HEADERS } from "@/shared/constants/api.js";

export async function getContractFileUrl(contractId) {
  const url = `${API_BASE_URL}/api/franchisee/contracts/${contractId}/file-url`;
  const response = await fetch(url, {
    method: "GET",
    headers: DEFAULT_HEADERS,
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json?.message || "Failed to fetch contract file URL");
  }
  if (!json?.succeeded || !json?.data) {
    throw new Error(json?.message || "Invalid response");
  }
  return json.data;
}

export async function submitSignedContract(contractId, file) {
  const formData = new FormData();
  formData.append("ContractId", contractId);
  formData.append("file", file);

  const url = `${API_BASE_URL}/api/files/contracts/signed-pdf`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "ngrok-skip-browser-warning": "true",
    },
    body: formData,
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json?.message || "Failed to submit signed contract");
  }
  if (json?.succeeded === false) {
    throw new Error(json?.message || "Submission failed");
  }
  return json;
}
