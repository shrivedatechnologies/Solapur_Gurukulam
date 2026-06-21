// src/pages/dashboard/DashboardHome.jsx
import { useSelector } from "react-redux";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";


const DashboardHome = () => {
  const { user } = useSelector((state) => state.auth);
  
  const role = user?.role?.toLowerCase() || "";
  const isAdmin = role === "admin" || role === "super_admin" || role === "superadmin";
  return isAdmin ? <AdminDashboard /> : <UserDashboard />;
};

export default DashboardHome;