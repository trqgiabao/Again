const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const sendWarehouseReportToFranchise = async (payload) => {
  await delay(700);

  return {
    success: true,
    notificationType: 'API_NOTIFICATION',
    sentAt: new Date().toISOString(),
    recipient: payload.franchiseName,
    reportId: `WHR-${Date.now()}`,
    payload,
  };
};