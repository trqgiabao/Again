import NotFound from "@/shared/pages/NotFound.jsx";
import { HomePage } from "@/features/home";
import { CreateContractPage } from "@/features/admin";
import { FranchiseeDashboardPage } from "@/features/franchisee";
import { StoreManager, StaffManager } from '../../features/manager';
import PurchaseOrder from '../../features/purchase/pages/PurchaseOrder/PurchaseOrder';
import { Navigate, Route, Routes } from 'react-router-dom';
import {
  AdminDashboardPage,
  ApplicationDetailPage,
  ApplicationListPage,
} from '@/features/franchiseAdmin';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin/tao-hop-dong" element={<CreateContractPage />} />
      <Route path="/franchisee/dashboard" element={<FranchiseeDashboardPage />} />
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      <Route path="/admin/applications" element={<ApplicationListPage />} />
      <Route path="/admin/applications/:id" element={<ApplicationDetailPage />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/manager/stores" element={<StoreManager />} />
      <Route path="/manager/staff" element={<StaffManager />} />
      <Route path="/purchase/orders" element={<PurchaseOrder />} />
    </Routes>
  );
};

export default AppRoutes;
