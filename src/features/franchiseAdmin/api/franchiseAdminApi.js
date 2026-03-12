import { httpRequest } from "@/shared/api/http";

/**
 * Switch:
 * - VITE_USE_MOCK_API=true  -> dùng mock
 * - VITE_USE_MOCK_API=false -> gọi API thật
 */
const USE_MOCK = String(import.meta.env.VITE_USE_MOCK_API || "true") === "true";

const wait = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

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

const createNowString = () =>
  new Date().toISOString().slice(0, 19).replace("T", " ");

const INITIAL_MOCK_APPLICATIONS = [
  {
    id: "app-001",
    code: "FA-2026-001",
    fullName: "Nguyễn Văn A",
    email: "a.nguyen@mail.com",
    phoneNumber: "0901234567",
    nationalId: "079204001111",
    address: "12 Nguyễn Huệ, Q1, TP.HCM",
    businessExperience: "5 năm vận hành chuỗi cafe",
    expectedCapital: 3000000000,
    preferredRegion: "Hồ Chí Minh",
    region: "Hồ Chí Minh",
    submittedAt: "2026-03-01 10:20",
    createdAt: "2026-03-01 10:20",
    status: "Pending",
    history: [
      {
        time: "2026-03-01 10:20",
        status: "Pending",
        note: "Hồ sơ vừa được tạo.",
      },
      {
        time: "2026-03-01 10:22",
        status: "Pending",
        note: "Email xác nhận đã gửi ứng viên.",
      },
    ],
  },
  {
    id: "app-002",
    code: "FA-2026-002",
    fullName: "Trần Thị B",
    email: "b.tran@mail.com",
    phoneNumber: "0912345678",
    nationalId: "001298009876",
    address: "95 Nguyễn Trãi, Thanh Xuân, Hà Nội",
    businessExperience: "3 năm quản lý cửa hàng thời trang",
    expectedCapital: 2500000000,
    preferredRegion: "Hà Nội",
    region: "Hà Nội",
    submittedAt: "2026-02-28 09:05",
    createdAt: "2026-02-28 09:05",
    status: "Approved",
    history: [
      {
        time: "2026-02-28 09:05",
        status: "Pending",
        note: "Hồ sơ vừa được tạo.",
      },
      {
        time: "2026-03-01 15:10",
        status: "Approved",
        note: "Đã duyệt sau vòng phỏng vấn.",
      },
    ],
  },
  {
    id: "app-003",
    code: "FA-2026-003",
    fullName: "Lê Minh C",
    email: "c.le@mail.com",
    phoneNumber: "0933334444",
    nationalId: "048201006543",
    address: "22 Ông Ích Khiêm, Hải Châu, Đà Nẵng",
    businessExperience: "2 năm kinh doanh chuỗi đồ uống",
    expectedCapital: 1800000000,
    preferredRegion: "Đà Nẵng",
    region: "Đà Nẵng",
    submittedAt: "2026-02-25 14:40",
    createdAt: "2026-02-25 14:40",
    status: "Rejected",
    history: [
      {
        time: "2026-02-25 14:40",
        status: "Pending",
        note: "Hồ sơ vừa được tạo.",
      },
      {
        time: "2026-02-26 10:00",
        status: "Rejected",
        note: "Ứng viên chưa đáp ứng mức vốn tối thiểu.",
      },
    ],
  },
  {
    id: "app-004",
    code: "FA-2026-004",
    fullName: "Phạm Thu D",
    email: "d.pham@mail.com",
    phoneNumber: "0977771122",
    nationalId: "025196002468",
    address: "118 Điện Biên Phủ, Bình Thạnh, TP.HCM",
    businessExperience: "4 năm vận hành nhà hàng gia đình",
    expectedCapital: 2900000000,
    preferredRegion: "Hồ Chí Minh",
    region: "Hồ Chí Minh",
    submittedAt: "2026-02-24 08:50",
    createdAt: "2026-02-24 08:50",
    status: "Pending",
    history: [
      {
        time: "2026-02-24 08:50",
        status: "Pending",
        note: "Hồ sơ vừa được tạo.",
      },
      {
        time: "2026-02-24 09:15",
        status: "Pending",
        note: "Đã chuyển HR kiểm tra ban đầu.",
      },
    ],
  },
];

let mockApplications = [...INITIAL_MOCK_APPLICATIONS];

const mockDashboard = {
  activeFranchisees: 128,
  pendingApplications: 0,
  totalRevenue: 45800000000,
  totalRoyaltyFee: 2900000000,
  revenueByStore: [
    { name: "HCM Flagship", revenue: 12000000000 },
    { name: "Ha Noi Center", revenue: 9800000000 },
    { name: "Da Nang Beach", revenue: 7600000000 },
    { name: "Can Tho Plaza", revenue: 5400000000 },
  ],
  topStores: [
    { name: "HCM Flagship", revenue: 12000000000 },
    { name: "Ha Noi Center", revenue: 9800000000 },
    { name: "Da Nang Beach", revenue: 7600000000 },
  ],
};

const toDateOnly = (value) => String(value || "").slice(0, 10);

const includesText = (source, keyword) =>
  String(source || "").toLowerCase().includes(String(keyword || "").toLowerCase());

/* ===============================
   REAL API
================================ */

const realGetAdminApplications = async (params = {}) => {
  const queryString = buildQueryString(params);
  const payload = await httpRequest(`/api/admin/franchise/applications${queryString}`);
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

const realGetAdminApplicationDetail = async (id) => {
  const payload = await httpRequest(`/api/admin/franchise/applications/${id}`);
  return normalizeApplicationDetail(payload?.data || payload);
};

const realApproveAdminApplication = async (id, body = {}) => {
  return httpRequest(`/api/admin/franchise/applications/${id}/approve`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
};

const realRejectAdminApplication = async (id, body = {}) => {
  return httpRequest(`/api/admin/franchise/applications/${id}/reject`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
};

const realGetConsultantDashboard = async () => {
  const payload = await httpRequest(`/api/consultant/dashboard`);
  return normalizeDashboard(payload);
};

const realGetConsultantPool = async (params = {}) => {
  const queryString = buildQueryString(params);
  const payload = await httpRequest(`/api/consultant/applications/pool${queryString}`);
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

const realAssignConsultantApplication = async (id) => {
  return httpRequest(`/api/consultant/applications/${id}/assign`, {
    method: "PATCH",
  });
};

const realGetConsultantMine = async () => {
  return httpRequest(`/api/consultant/applications/mine`);
};

const realCreateConsultationLog = async (id, body = {}) => {
  return httpRequest(`/api/consultant/applications/${id}/consultation-logs`, {
    method: "POST",
    body: JSON.stringify(body),
  });
};

const realCreateSiteInspection = async (id, body = {}) => {
  return httpRequest(`/api/consultant/applications/${id}/site-inspection`, {
    method: "POST",
    body: JSON.stringify(body),
  });
};

const realGetSiteInspections = async (params = {}) => {
  const queryString = buildQueryString(params);
  return httpRequest(`/api/admin/site-inspections${queryString}`);
};

const realApproveSiteInspection = async (id, body = {}) => {
  return httpRequest(`/api/admin/site-inspections/${id}/approve`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
};

const realRejectSiteInspection = async (id, body = {}) => {
  return httpRequest(`/api/admin/site-inspections/${id}/reject`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
};

const realGetFranchisePackages = async () => {
  return httpRequest(`/api/franchise-packages`);
};

const realSelectPackage = async (applicationId, body = {}) => {
  return httpRequest(`/api/consultant/applications/${applicationId}/package-selection`, {
    method: "POST",
    body: JSON.stringify(body),
  });
};

const realCreateFranchiseContract = async (body = {}) => {
  return httpRequest(`/api/admin/franchise/contracts`, {
    method: "POST",
    body: JSON.stringify(body),
  });
};

/* ===============================
   MOCK API
================================ */

const mockGetAdminApplications = async (params = {}) => {
  await wait();

  let items = [...mockApplications];

  if (params?.status && params.status !== "All") {
    items = items.filter((item) => item.status === params.status);
  }

  if (params?.region && params.region !== "All") {
    items = items.filter(
      (item) => item.region === params.region || item.preferredRegion === params.region
    );
  }

  if (params?.search) {
    items = items.filter(
      (item) =>
        includesText(item.fullName, params.search) ||
        includesText(item.email, params.search) ||
        includesText(item.code, params.search)
    );
  }

  if (params?.fromDate) {
    items = items.filter((item) => toDateOnly(item.submittedAt) >= params.fromDate);
  }

  if (params?.toDate) {
    items = items.filter((item) => toDateOnly(item.submittedAt) <= params.toDate);
  }

  items.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

  const page = Number(params?.page || 1);
  const pageSize = Number(params?.pageSize || 20);
  const start = (page - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize).map(normalizeApplicationItem),
    total: items.length,
    page,
    pageSize,
  };
};

const mockGetAdminApplicationDetail = async (id) => {
  await wait();

  const found = mockApplications.find((item) => item.id === id);

  if (!found) {
    throw new Error("Không tìm thấy hồ sơ.");
  }

  return normalizeApplicationDetail(found);
};

const mockApproveAdminApplication = async (id, body = {}) => {
  await wait();

  const index = mockApplications.findIndex((item) => item.id === id);
  if (index === -1) throw new Error("Không tìm thấy hồ sơ để approve.");

  const current = mockApplications[index];

  mockApplications[index] = {
    ...current,
    status: "Approved",
    history: [
      ...(current.history || []),
      {
        time: createNowString(),
        status: "Approved",
        note: body?.note || "Admin đã duyệt hồ sơ.",
      },
    ],
  };

  return {
    message: "Approve application thành công.",
    data: normalizeApplicationDetail(mockApplications[index]),
  };
};

const mockRejectAdminApplication = async (id, body = {}) => {
  await wait();

  const index = mockApplications.findIndex((item) => item.id === id);
  if (index === -1) throw new Error("Không tìm thấy hồ sơ để reject.");

  const current = mockApplications[index];

  mockApplications[index] = {
    ...current,
    status: "Rejected",
    history: [
      ...(current.history || []),
      {
        time: createNowString(),
        status: "Rejected",
        note: body?.rejectReason || body?.adminReviewNote || "Từ chối hồ sơ.",
      },
    ],
  };

  return {
    message: "Reject application thành công.",
    data: normalizeApplicationDetail(mockApplications[index]),
  };
};

const mockGetConsultantDashboard = async () => {
  await wait();

  const pendingApplications = mockApplications.filter(
    (item) => item.status === "Pending"
  ).length;

  return normalizeDashboard({
    ...mockDashboard,
    pendingApplications,
  });
};

const mockGetConsultantPool = async (params = {}) => {
  await wait();
  return mockGetAdminApplications(params);
};

const mockAssignConsultantApplication = async (id) => {
  await wait();
  return {
    message: `Đã assign application ${id} cho consultant.`,
  };
};

const mockGetConsultantMine = async () => {
  await wait();
  return {
    items: mockApplications
      .filter((item) => item.status === "Pending")
      .map(normalizeApplicationItem),
  };
};

const mockCreateConsultationLog = async (id, body = {}) => {
  await wait();
  return {
    message: "Tạo consultation log thành công.",
    data: { id, ...body },
  };
};

const mockCreateSiteInspection = async (id, body = {}) => {
  await wait();
  return {
    message: "Submit site inspection thành công.",
    data: { id, ...body },
  };
};

const mockGetSiteInspections = async () => {
  await wait();
  return {
    items: [],
    total: 0,
    page: 1,
  };
};

const mockApproveSiteInspection = async (id, body = {}) => {
  await wait();
  return {
    message: "Approve site inspection thành công.",
    data: { id, ...body, status: "Approved" },
  };
};

const mockRejectSiteInspection = async (id, body = {}) => {
  await wait();
  return {
    message: "Reject site inspection thành công.",
    data: { id, ...body, status: "Rejected" },
  };
};

const mockGetFranchisePackages = async () => {
  await wait();
  return {
    items: [
      {
        id: "70000000-0000-0000-0000-000000000001",
        name: "Starter",
        royaltyRate: 8,
        durationMonths: 24,
      },
      {
        id: "70000000-0000-0000-0000-000000000002",
        name: "Premium",
        royaltyRate: 10,
        durationMonths: 36,
      },
    ],
  };
};

const mockSelectPackage = async (applicationId, body = {}) => {
  await wait();
  return {
    message: "Chọn package thành công.",
    data: { applicationId, ...body },
  };
};

const mockCreateFranchiseContract = async (body = {}) => {
  await wait();
  return {
    message: "Tạo contract thành công.",
    data: {
      id: "contract-001",
      ...body,
    },
  };
};

/* ===============================
   PUBLIC EXPORTS
================================ */

export const getAdminApplications = (params = {}) =>
  USE_MOCK ? mockGetAdminApplications(params) : realGetAdminApplications(params);

export const getAdminApplicationDetail = (id) =>
  USE_MOCK ? mockGetAdminApplicationDetail(id) : realGetAdminApplicationDetail(id);

export const approveAdminApplication = (id, body = {}) =>
  USE_MOCK ? mockApproveAdminApplication(id, body) : realApproveAdminApplication(id, body);

export const rejectAdminApplication = (id, body = {}) =>
  USE_MOCK ? mockRejectAdminApplication(id, body) : realRejectAdminApplication(id, body);

export const getConsultantDashboard = () =>
  USE_MOCK ? mockGetConsultantDashboard() : realGetConsultantDashboard();

export const getConsultantPool = (params = {}) =>
  USE_MOCK ? mockGetConsultantPool(params) : realGetConsultantPool(params);

export const assignConsultantApplication = (id) =>
  USE_MOCK ? mockAssignConsultantApplication(id) : realAssignConsultantApplication(id);

export const getConsultantMine = () =>
  USE_MOCK ? mockGetConsultantMine() : realGetConsultantMine();

export const createConsultationLog = (id, body = {}) =>
  USE_MOCK ? mockCreateConsultationLog(id, body) : realCreateConsultationLog(id, body);

export const createSiteInspection = (id, body = {}) =>
  USE_MOCK ? mockCreateSiteInspection(id, body) : realCreateSiteInspection(id, body);

export const getSiteInspections = (params = {}) =>
  USE_MOCK ? mockGetSiteInspections(params) : realGetSiteInspections(params);

export const approveSiteInspection = (id, body = {}) =>
  USE_MOCK ? mockApproveSiteInspection(id, body) : realApproveSiteInspection(id, body);

export const rejectSiteInspection = (id, body = {}) =>
  USE_MOCK ? mockRejectSiteInspection(id, body) : realRejectSiteInspection(id, body);

export const getFranchisePackages = () =>
  USE_MOCK ? mockGetFranchisePackages() : realGetFranchisePackages();

export const selectPackage = (applicationId, body = {}) =>
  USE_MOCK ? mockSelectPackage(applicationId, body) : realSelectPackage(applicationId, body);

export const createFranchiseContract = (body = {}) =>
  USE_MOCK ? mockCreateFranchiseContract(body) : realCreateFranchiseContract(body);

export const getAdminDashboard = getConsultantDashboard;

export const __resetFranchiseAdminMocks = () => {
  mockApplications = [...INITIAL_MOCK_APPLICATIONS];
};

export { USE_MOCK, normalizeApplicationItem, normalizeApplicationDetail, normalizeDashboard };