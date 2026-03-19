import { useEffect, useState } from "react";
import AdminMenu from "../components/adminMenu/AdminMenu";
import StatCard from "../components/statCard/StatCard";
import { getConsultantDashboard } from "../api/franchiseAdminApi";
import "./AdminDashboardPage.css";

const formatCurrency = (value) => {
  if (typeof value === "string") return value;

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
};

const AdminDashboardPage = () => {
  const [dashboard, setDashboard] = useState({
    activeFranchisees: 0,
    pendingApplications: 0,
    totalRevenue: 0,
    totalRoyaltyFee: 0,
    revenueByStore: [],
    topStores: [],
  });
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setApiError("");

        const data = await getConsultantDashboard();
        setDashboard(data);
      } catch (error) {
        setApiError(`Unable to load dashboard API. Details: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <h1>Admin Dashboard</h1>
        <p>Real-time overview of the franchise system.</p>
        {loading && <p>Loading dashboard data...</p>}
        {!!apiError && <p>{apiError}</p>}
      </header>

      <AdminMenu />

      <div className="stats-grid">
        <StatCard title="Active Franchisees" value={dashboard.activeFranchisees} />
        <StatCard
          title="Pending Applications"
          value={dashboard.pendingApplications}
          subText="Needs immediate review"
        />
        <StatCard
          title="Total System Revenue"
          value={`${formatCurrency(dashboard.totalRevenue)} đ`}
        />
        <StatCard
          title="Royalty Fee Collected This Month"
          value={`${formatCurrency(dashboard.totalRoyaltyFee)} đ`}
        />
      </div>

      <div className="admin-section-grid">
        <article className="panel admin-surface" style={{ padding: "24px" }}>
          <h2>Revenue by Store / Region</h2>

          {(dashboard.revenueByStore || []).length > 0 ? (
            <div className="revenue-bars">
              {dashboard.revenueByStore.map((item, index) => (
                <div
                  key={item.name || item.label || index}
                  className="revenue-bars__item"
                >
                  <div className="revenue-bars__label-row">
                    <span>{item.name || item.label}</span>
                    <strong>{formatCurrency(item.revenue || item.value || 0)} đ</strong>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No revenue-by-store data available.</p>
          )}
        </article>

        <article className="panel admin-surface" style={{ padding: "24px" }}>
          <h2>Top Performing Stores</h2>

          {(dashboard.topStores || []).length > 0 ? (
            <ol className="top-store-list">
              {dashboard.topStores.map((store, index) => (
                <li key={store.name || index}>
                  <span>{store.name}</span>
                  <strong>{formatCurrency(store.revenue || 0)} đ</strong>
                </li>
              ))}
            </ol>
          ) : (
            <p>No top-store data available.</p>
          )}
        </article>
      </div>
    </section>
  );
};

export default AdminDashboardPage;