import { httpRequest } from "@/shared/api/http";

const buildQueryString = (params = {}) => {
  if (typeof params === "string") return params;

  const searchParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    if (
      value === undefined ||
      value === null ||
      value === "" ||
      value === "All"
    ) {
      return;
    }

    searchParams.append(key, String(value));
  });

  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
};

const pickArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  return [];
};

const normalizeApplicationItem = (item = {}) => ({
  id: item.id || item._id || item.applicationId || "",
  code: item.code || item.applicationCode || "",
  fullName: item.fullName || item.applicantName || item.name || "N/A",
  email: item.email || item.applicantEmail || "N/A",
  region: item.region || item.preferredRegion || item.area || "N/A",
  submittedAt: item.submittedAt || item.createdAt || item.created_at || "N/A",
  status: item.status || "Pending",
});

const normalizeApplicationDetail = (item = {}) => ({
  id: item.id || item._id || item.applicationId || "",
  code: item.code || item.applicationCode || "N/A",
  fullName: item.fullName || item.applicantName || item.name || "N/A",
  email: item.email || item.applicantEmail || "N/A",
  phoneNumber: item.phoneNumber || item.phone || "N/A",
  nationalId: item.nationalId || item.cccd || item.identityNumber || "N/A",
  address: item.address || "N/A",
  businessExperience: item.businessExperience || item.experience || "N/A",
  expectedCapital: item.expectedCapital || item.capital || 0,
  preferredRegion: item.preferredRegion || item.region || "N/A",
  createdAt: item.createdAt || item.submittedAt || "N/A",
  status: item.status || "Pending",
  history: Array.isArray(item.history) ? item.history : [],
});

const normalizeDashboard = (payload = {}) => {
  const data = payload?.data || payload;

  return {
    activeFranchisees:
      data.activeFranchisees ||
      data.totalActiveFranchisees ||
      data.totalFranchisees ||
      0,
    pendingApplications:
      data.pendingApplications ||
      data.submittedApplications ||
      data.totalPendingApplications ||
      0,
    totalRevenue:
      data.totalRevenue || data.systemRevenue || data.totalSystemRevenue || 0,
    totalRoyaltyFee:
      data.totalRoyaltyFee || data.monthlyRoyaltyFee || data.royaltyFee || 0,
    revenueByStore: Array.isArray(data.revenueByStore)
      ? data.revenueByStore
      : Array.isArray(data.storeRevenue)
      ? data.storeRevenue
      : [],
    topStores: Array.isArray(data.topStores) ? data.topStores : [],
  };
};

export const getAdminApplications = async (params = {}) => {
  const queryString = buildQueryString(params);
  const payload = await httpRequest(
    `/api/admin/franchise/applications${queryString}`
  );
  const items = pickArray(payload).map(normalizeApplicationItem);

  return {
    items,
    total:
      payload?.total ||
      payload?.data?.total ||
      payload?.meta?.total ||
      items.length,
    page: payload?.page || payload?.data?.page || Number(params?.page || 1),
    pageSize:
      payload?.pageSize ||
      payload?.data?.pageSize ||
      Number(params?.pageSize || items.length || 20),
  };
};

export const getAdminApplicationDetail = async (id) => {
  const payload = await httpRequest(`/api/admin/franchise/applications/${id}`);
  return normalizeApplicationDetail(payload?.data || payload);
};

export const approveAdminApplication = (id, body = {}) =>
  httpRequest(`/api/admin/franchise/applications/${id}/approve`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });

export const rejectAdminApplication = (id, body = {}) =>
  httpRequest(`/api/admin/franchise/applications/${id}/reject`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });

export const getConsultantDashboard = async () => {
  const payload = await httpRequest(`/api/admin/dashboard`);
  return normalizeDashboard(payload);
};

export const getConsultantPool = async (params = {}) => {
  const queryString = buildQueryString(params);
  const payload = await httpRequest(`/api/admin/applications/pool${queryString}`);
  const items = pickArray(payload).map(normalizeApplicationItem);

  return {
    items,
    total:
      payload?.total ||
      payload?.data?.total ||
      payload?.meta?.total ||
      items.length,
    page: payload?.page || payload?.data?.page || Number(params?.page || 1),
    pageSize:
      payload?.pageSize ||
      payload?.data?.pageSize ||
      Number(params?.pageSize || items.length || 20),
  };
};

export const assignConsultantApplication = (id) =>
  httpRequest(`/api/consultant/applications/${id}/assign`, {
    method: "PATCH",
  });

export const getConsultantMine = () =>
  httpRequest(`/api/consultant/applications/mine`);

export const createConsultationLog = (id, body = {}) =>
  httpRequest(`/api/consultant/applications/${id}/consultation-logs`, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const createSiteInspection = (id, body = {}) =>
  httpRequest(`/api/consultant/applications/${id}/site-inspection`, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const getSiteInspections = (params = {}) => {
  const queryString = buildQueryString(params);
  return httpRequest(`/api/admin/site-inspections${queryString}`);
};

export const approveSiteInspection = (id, body = {}) =>
  httpRequest(`/api/admin/site-inspections/${id}/approve`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });

export const rejectSiteInspection = (id, body = {}) =>
  httpRequest(`/api/admin/site-inspections/${id}/reject`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });

export const getFranchisePackages = () =>
  httpRequest(`/api/franchise-packages`);

export const selectPackage = (applicationId, body = {}) =>
  httpRequest(
    `/api/consultant/applications/${applicationId}/package-selection`,
    {
      method: "POST",
      body: JSON.stringify(body),
    }
  );

export const createFranchiseContract = (body = {}) =>
  httpRequest(`/api/admin/franchise/contracts`, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const getAdminDashboard = getConsultantDashboard;

export {
  normalizeApplicationItem,
  normalizeApplicationDetail,
  normalizeDashboard,
};