import { httpRequest } from '@/shared/api/http';

const pickArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
};

export const normalizeApplicationItem = (item = {}) => ({
  id: item.id || item._id || item.applicationId || '',
  fullName: item.fullName || item.applicantName || item.name || 'N/A',
  email: item.email || item.applicantEmail || 'N/A',
  region: item.region || item.preferredRegion || item.area || 'N/A',
  submittedAt: item.submittedAt || item.createdAt || item.created_at || 'N/A',
  status: item.status || 'Pending',
});

export const normalizeApplicationDetail = (item = {}) => ({
  id: item.id || item._id || item.applicationId || '',
  code: item.code || item.applicationCode || 'N/A',
  fullName: item.fullName || item.applicantName || item.name || 'N/A',
  email: item.email || item.applicantEmail || 'N/A',
  phoneNumber: item.phoneNumber || item.phone || 'N/A',
  nationalId: item.nationalId || item.cccd || item.identityNumber || 'N/A',
  address: item.address || 'N/A',
  businessExperience: item.businessExperience || item.experience || 'N/A',
  expectedCapital: item.expectedCapital || item.capital || 'N/A',
  preferredRegion: item.preferredRegion || item.region || 'N/A',
  createdAt: item.createdAt || item.submittedAt || 'N/A',
  status: item.status || 'Pending',
  history: Array.isArray(item.history) ? item.history : [],
});

export const getAdminApplications = async () => {
  const payload = await httpRequest('/api/admin/franchise/applications');
  return pickArray(payload).map(normalizeApplicationItem);
};

export const getAdminApplicationDetail = async (applicationId) => {
  const payload = await httpRequest(`/api/admin/franchise/applications/${applicationId}`);
  const detail = payload?.data || payload;
  return normalizeApplicationDetail(detail);
};

export const approveAdminApplication = async (applicationId, body = {}) => {
  return httpRequest(`/api/admin/franchise/applications/${applicationId}/approve`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
};

export const rejectAdminApplication = async (applicationId, body) => {
  return httpRequest(`/api/admin/franchise/applications/${applicationId}/reject`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
};