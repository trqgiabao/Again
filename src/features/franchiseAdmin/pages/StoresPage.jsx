import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { httpRequest } from "@/shared/api/http";
import AdminMenu from "../components/adminMenu/AdminMenu.jsx";
import "./StoresPage.css";

export default function StoresPage() {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStores = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await httpRequest("/admin/stores");
        setStores(Array.isArray(data) ? data : []);
      } catch (err) {
        setStores([]);
        setError(
          err?.message ||
            "Unable to load stores. Please verify the backend API or check network connectivity."
        );
      } finally {
        setLoading(false);
      }
    };

    loadStores();
  }, []);

  const handleCreatePO = (store) => {
    navigate("/admin/purchase-orders", { state: { store } });
  };

  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <h1>Stores</h1>
        <p>View store inventory and manage purchase orders.</p>
      </header>

      <AdminMenu />

      {loading && <p>Loading stores...</p>}
      {!!error && (
        <div className="page-error">
          <p>{error}</p>
          <button className="store-card__action" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && stores.length === 0 && (
        <p>No stores available. Please check the backend API or contact your system administrator.</p>
      )}

      {!loading && !error && stores.length > 0 && (
        <div className="stores-grid">
          {stores.map((store) => (
            <article key={store.id} className="store-card admin-surface">
              <div className="store-card__info">
                <div className="store-card__icon" aria-hidden="true">
                  🏬
                </div>
                <div>
                  <h2 className="store-card__name">{store.name}</h2>
                  <p className="store-card__address">{store.address}</p>
                </div>
              </div>

              <button
                type="button"
                className="store-card__action"
                onClick={() => handleCreatePO(store)}
              >
                + Create Purchase Order
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
