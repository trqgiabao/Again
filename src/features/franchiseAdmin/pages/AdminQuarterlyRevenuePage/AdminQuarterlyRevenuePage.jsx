import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AdminMenu from "../../components/adminMenu/AdminMenu";
import { getAdminQuarterlyRevenueShare } from "../../api/franchiseAdminApi";
import "./AdminQuarterlyRevenuePage.css";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const formatPercent = (value) => `${Number(value || 0).toFixed(2)}%`;

const AdminQuarterlyRevenuePage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setApiError("");
        const response = await getAdminQuarterlyRevenueShare();
        setRows(Array.isArray(response) ? response : []);
      } catch (error) {
        setApiError(`Unable to load quarterly revenue share data. Details: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const summary = useMemo(() => {
    return rows.reduce(
      (acc, row) => {
        acc.totalRevenue += Number(row.totalRevenue || 0);
        acc.adminRevenue += Number(row.adminRevenue || 0);
        return acc;
      },
      { totalRevenue: 0, adminRevenue: 0 }
    );
  }, [rows]);

  return (
    <section className="admin-page admin-quarterly-page">
      <header className="admin-page__header">
        <h1>Quarterly Revenue Share</h1>
        <p>
          Track each franchise store&apos;s quarterly revenue and calculate the admin share based
          on the negotiated royalty percentage.
        </p>
      </header>

      <AdminMenu />

      <div className="admin-quarterly-page__actions">
        <Link to="/admin/dashboard" className="admin-quarterly-page__back-button">
          ← Back to Admin Dashboard
        </Link>
      </div>

      {loading && <p>Loading quarterly report...</p>}
      {!!apiError && <p>{apiError}</p>}

      <div className="admin-quarterly-summary">
        <article className="panel admin-surface admin-quarterly-summary__card">
          <h2>Total Franchise Revenue (Quarterly)</h2>
          <p>{formatCurrency(summary.totalRevenue)} đ</p>
        </article>

        <article className="panel admin-surface admin-quarterly-summary__card">
          <h2>Total Admin Share</h2>
          <p>{formatCurrency(summary.adminRevenue)} đ</p>
        </article>
      </div>

      <article className="panel admin-surface admin-quarterly-table-wrap">
        <h2>Store-level Quarterly Details</h2>

        {rows.length > 0 ? (
          <div className="admin-quarterly-table-scroll">
            <table className="admin-quarterly-table">
              <thead>
                <tr>
                  <th>Store</th>
                  <th>Quarter</th>
                  <th>Total Revenue</th>
                  <th>Negotiated Rate</th>
                  <th>Admin Share</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.storeName}</td>
                    <td>{row.quarter}</td>
                    <td>{formatCurrency(row.totalRevenue)} đ</td>
                    <td>{formatPercent(row.negotiatedRate)}</td>
                    <td>{formatCurrency(row.adminRevenue)} đ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !loading && <p>No quarterly revenue share data available.</p>
        )}
      </article>
    </section>
  );
};

export default AdminQuarterlyRevenuePage;