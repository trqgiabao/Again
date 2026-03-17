import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { clearAuthSession, getAuthIdentity } from "@/shared/api/http";
import "./AuthenticatedLayout.css";

const AuthenticatedLayout = () => {
  const navigate = useNavigate();
  const [identity, setIdentity] = useState(() => getAuthIdentity());

  useEffect(() => {
    const syncIdentity = () => {
      setIdentity(getAuthIdentity());
    };

    syncIdentity();

    window.addEventListener("storage", syncIdentity);
    window.addEventListener("focus", syncIdentity);

    return () => {
      window.removeEventListener("storage", syncIdentity);
      window.removeEventListener("focus", syncIdentity);
    };
  }, []);

  const handleGoHome = () => {
    navigate("/");
  };

  const handleSignOut = () => {
    clearAuthSession();
    navigate("/signin", { replace: true });
  };

  return (
    <div className="authenticated-layout">
      <header className="authenticated-layout__topbar">
        <div className="authenticated-layout__topbar-inner">
          {identity.displayName ? (
            <div className="authenticated-layout__identity" aria-label="Current signed-in user">
              <span className="authenticated-layout__identity-label">Welcome</span>
              <strong className="authenticated-layout__identity-name">{identity.displayName}</strong>
            </div>
          ) : (
            <div className="authenticated-layout__identity authenticated-layout__identity--placeholder" />
          )}

          <div className="authenticated-layout__actions">
          <button
            type="button"
            className="authenticated-layout__button authenticated-layout__button--secondary"
            onClick={handleGoHome}
          >
            Home Page
          </button>
          <button
            type="button"
            className="authenticated-layout__button authenticated-layout__button--primary"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
          </div>
        </div>
      </header>

      <div className="authenticated-layout__content">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthenticatedLayout;