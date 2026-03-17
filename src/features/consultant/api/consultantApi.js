import { API_BASE_URL, getAuthHeaders } from "@/shared/constants/api.js";

const parseAllowedRegions = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value !== "string") {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    const trimmed = value.trim();
    return trimmed ? [trimmed] : [];
  }
};

const normalizeFranchisePackage = (item = {}) => ({
  id: item.id,
  name: item.name,
  minArea: Number(item.minArea ?? 0),
  minCapital: Number(item.minCapital ?? 0),
  franchiseFee: Number(item.franchiseFee ?? 0),
  royaltyRate: Number(item.royaltyRate ?? item.proposedRoyaltyRate ?? 0),
  contractDurationMonths: Number(
    item.contractDurationMonths ?? item.durationMonths ?? item.proposedDurationMonths ?? 0
  ),
  allowedRegions: parseAllowedRegions(item.allowedRegions),
});

export async function getConsultantDashboard(params = {}) {
  const searchParams = new URLSearchParams();
  searchParams.set("region", params.region ?? "");
  searchParams.set("status", params.status && params.status !== "All" ? params.status : "");
  searchParams.set("search", params.search?.trim?.() ?? "");
  searchParams.set("page", String(params.page || 1));
  searchParams.set("pageSize", String(params.pageSize || 20));

  const url = `${API_BASE_URL}/api/consultant/dashboard?${searchParams.toString()}`;
  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json?.message || "Failed to fetch consultant dashboard");
  }
  if (!json?.succeeded || !json?.data) {
    throw new Error(json?.message || "Invalid response");
  }

  const data = json.data;
  const sourceWorkload = data.workloadSummary && typeof data.workloadSummary === "object"
    ? data.workloadSummary
    : {};

  const normalizedItems = Array.isArray(sourceWorkload.items)
    ? sourceWorkload.items.map((item) => ({
        applicationId: item.applicationId,
        code: item.code,
        fullName: item.fullName,
        status: item.status,
        region: item.region,
        assignedAt: item.assignedAt ?? item.createdAt ?? null,
      }))
    : [];

  const normalizedPage = Number(sourceWorkload.page ?? params.page ?? 1);
  const normalizedPageSize = Number(sourceWorkload.pageSize ?? params.pageSize ?? 20);
  const normalizedTotalCount = Number(sourceWorkload.totalCount ?? normalizedItems.length);
  const normalizedTotalPages = Math.max(
    1,
    Number(sourceWorkload.totalPages ?? Math.ceil(normalizedTotalCount / (normalizedPageSize || 1)))
  );

  return {
    totalApplications: Number(data.totalApplications ?? 0),
    successfulApplications: Number(data.successfulApplications ?? 0),
    pendingAppointments: Number(data.pendingAppointments ?? 0),
    workloadSummary: {
      items: normalizedItems,
      totalCount: normalizedTotalCount,
      page: normalizedPage,
      pageSize: normalizedPageSize,
      totalPages: normalizedTotalPages,
      hasPrevious:
        typeof sourceWorkload.hasPrevious === "boolean"
          ? sourceWorkload.hasPrevious
          : normalizedPage > 1,
      hasNext:
        typeof sourceWorkload.hasNext === "boolean"
          ? sourceWorkload.hasNext
          : normalizedPage < normalizedTotalPages,
    },
  };
}

export async function getConsultantApplicationDetail(applicationId) {
  const url = `${API_BASE_URL}/api/consultant/applications/${applicationId}`;
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

  const data = json.data;
  const packageSelection =
    data.packageSelection && typeof data.packageSelection === "object" ? data.packageSelection : null;
  const selectedPackage =
    (packageSelection?.package && typeof packageSelection.package === "object"
      ? packageSelection.package
      : null) ||
    (data.selectedPackage && typeof data.selectedPackage === "object" ? data.selectedPackage : null);

  return {
    id: data.id,
    code: data.code,
    fullName: data.fullName,
    email: data.email,
    phoneNumber: data.phoneNumber,
    nationalId: data.nationalId,
    address: data.address,
    businessExperience: data.businessExperience,
    expectedCapital: Number(data.expectedCapital ?? 0),
    preferredRegion: data.preferredRegion,
    status: data.status,
    reviewedBy: data.reviewedBy,
    reviewedAt: data.reviewedAt,
    rejectReason: data.rejectReason,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    packageSelectionId: data.packageSelectionId ?? packageSelection?.id ?? null,
    selectedPackageId:
      data.selectedPackageId ?? data.packageId ?? packageSelection?.packageId ?? selectedPackage?.id ?? null,
    selectedPackageName:
      data.selectedPackageName ?? selectedPackage?.name ?? packageSelection?.packageName ?? "",
    proposedRoyaltyRate: Number(
      data.proposedRoyaltyRate ?? packageSelection?.proposedRoyaltyRate ?? selectedPackage?.royaltyRate ?? 0
    ),
    proposedDurationMonths: Number(
      data.proposedDurationMonths ??
        packageSelection?.proposedDurationMonths ??
        selectedPackage?.contractDurationMonths ??
        selectedPackage?.durationMonths ??
        0
    ),
  };
}

export async function createConsultationLog(applicationId, body = {}) {
  const url = `${API_BASE_URL}/api/consultant/applications/${applicationId}/consultation-logs`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json?.message || "Failed to create consultation log");
  }

  return json;
}

export async function submitSiteInspection(applicationId, body = {}) {
  const url = `${API_BASE_URL}/api/consultant/applications/${applicationId}/site-inspection`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json?.message || "Failed to submit site inspection");
  }

  return json;
}

export async function getFranchisePackages() {
  const url = `${API_BASE_URL}/api/franchise-packages`;
  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json?.message || "Failed to fetch franchise packages");
  }
  if (json?.succeeded === false) {
    throw new Error(json?.message || "Failed to fetch franchise packages");
  }

  const items = Array.isArray(json)
    ? json
    : Array.isArray(json?.data)
      ? json.data
      : Array.isArray(json?.items)
        ? json.items
        : Array.isArray(json?.data?.items)
          ? json.data.items
          : null;

  if (!Array.isArray(items)) {
    throw new Error(json?.message || "Invalid package response");
  }

  return items.map(normalizeFranchisePackage);
}

export async function submitPackageSelection(applicationId, body = {}) {
  const url = `${API_BASE_URL}/api/consultant/applications/${applicationId}/package-selection`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json?.message || "Failed to submit package selection");
  }
  if (json?.succeeded === false) {
    throw new Error(json?.message || "Failed to submit package selection");
  }

  return json?.data ?? json;
}

export async function getPoolApplications(params = {}) {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(params.page || 1));
  searchParams.set("pageSize", String(params.pageSize || 20));
  searchParams.set("region", params.region ?? "");
  if (params.status && params.status !== "All") searchParams.set("status", params.status);
  if (params.search && params.search.trim()) searchParams.set("search", params.search.trim());

  const url = `${API_BASE_URL}/api/consultant/applications/pool?${searchParams.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json?.message || "Failed to fetch pool applications");
  }
  if (!json?.succeeded || !json?.data) {
    throw new Error(json?.message || "Invalid response");
  }
  return json.data;
}

export async function assignPoolApplication(applicationId) {
  const url = `${API_BASE_URL}/api/consultant/applications/${applicationId}/assign`;
  const response = await fetch(url, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json?.message || "Failed to assign application");
  }
  return json;
}
