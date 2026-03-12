import { NavLink } from "react-router-dom";
import "./AdminMenu.css";

const menuItems = [
  { label: "Applications", to: "/admin/applications" },
  { label: "Franchisees", to: "/admin/dashboard" },
  { label: "Stores", to: "/admin/stores" },
  { label: "Purchase Orders", to: "/admin/purchase-orders" },
  { label: "Reports", to: "/admin/reports" },
];

const AdminMenu = () => {
  return (
    <nav className="admin-menu">
      {menuItems.map((item) => (
        <NavLink
          key={item.label}
          to={item.to}
          className={({ isActive }) =>
            `admin-menu__item ${isActive ? "admin-menu__item--active" : ""}`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default AdminMenu;