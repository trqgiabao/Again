import { NavLink, useNavigate } from "react-router-dom";
import { clearAuthSession } from "@/shared/api/http";
import "./ConsultantMenu.css";

const menuItems = [
  { label: "Dashboard", to: "/consultant/dashboard" },
  { label: "Pool Applications", to: "/consultant/pool" },
];

const ConsultantMenu = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleSignOut = () => {
    clearAuthSession();
    navigate("/signin", { replace: true });
  };

  return (
    <nav className="consultant-menu" aria-label="Consultant navigation">
      <div className="consultant-menu__links">
        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `consultant-menu__item ${isActive ? "consultant-menu__item--active" : ""}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="consultant-menu__actions">
        <button
          type="button"
          className="consultant-menu__button consultant-menu__button--secondary"
          onClick={handleGoHome}
        >
          Home Page
        </button>
        <button
          type="button"
          className="consultant-menu__button consultant-menu__button--primary"
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
};

export default ConsultantMenu;
