import { Navigate, Route, Routes } from "react-router-dom";
import NotFound from "@/shared/pages/NotFound.jsx";
import {HomePage} from "@/features/home";



const AppRoutes = () => {
  return (
    <Routes> 
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
