import { NavLink, useNavigate } from "react-router-dom";
import { clearAuthSession } from "@/shared/api/http";
import "./AdminMenu.css";

const menuItems = [
  { label: "Applications", to: "/admin/applications" },
  { label: "Inspections", to: "/admin/inspections" },
  { label: "Franchisees", to: "/admin/franchisees" },
  { label: "Stores", to: "/admin/stores" },
  { label: "Purchase Orders", to: "/admin/purchase-orders" },
  {label: "Quarterly Revenue Report", to: "/admin/quarterly-revenue" },
  { label: "Reports", to: "/admin/reports" },
];

const AdminMenu = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleSignOut = () => {
    clearAuthSession();
    navigate("/signin", { replace: true });
  };

  return (
    <nav className="admin-menu" aria-label="Admin navigation">
      <div className="admin-menu__links">
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
      </div>

      <div className="admin-menu__actions">
        <button
          type="button"
          className="admin-menu__button admin-menu__button--secondary"
          onClick={handleGoHome}
        >
          Home Page
        </button>
        <button
          type="button"
          className="admin-menu__button admin-menu__button--primary"
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
};

export default AdminMenu;