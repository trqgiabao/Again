import { Navigate, Route, Routes } from 'react-router-dom';
import NotFound from '@/shared/pages/NotFound.jsx';
import {
  AdminDashboardPage,
  ApplicationDetailPage,
  ApplicationListPage,
} from '@/features/franchiseAdmin';

const AppRoutes = () => {
  return (
   <Routes>
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      <Route path="/admin/applications" element={<ApplicationListPage />} />
      <Route path="/admin/applications/:id" element={<ApplicationDetailPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
