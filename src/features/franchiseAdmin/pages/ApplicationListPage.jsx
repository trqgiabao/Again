import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminMenu from "../components/adminMenu/AdminMenu";
import StatusBadge from "../components/statusBadge/StatusBadge";
import { getAdminApplications } from "../api/franchiseAdminApi";
import "./ApplicationListPage.css";
import "./AdminShared.css";

const ApplicationListPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("All");
  const [region, setRegion] = useState("All");
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const loadApplications = async () => {
      try {
        setLoading(true);
        setApiError("");

        const response = await getAdminApplications({
          status,
          region,
          search,
          page: 1,
          pageSize: 20,
        });

        setApplications(response.items || []);
      } catch (error) {
        setApiError(`Unable to load applications. Details: ${error.message}`);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, [status, region, search]);

  const data = useMemo(() => {
    return applications.filter((item) => {
      const submittedAt = String(item.submittedAt || "").slice(0, 10);
      const matchFrom = !fromDate || submittedAt >= fromDate;
      const matchTo = !toDate || submittedAt <= toDate;
      return matchFrom && matchTo;
    });
  }, [applications, fromDate, toDate]);

  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <h1>Franchise Application List</h1>
        <p>Manage applications by status, region, and submission date.</p>
        {loading && <p>Loading application data...</p>}
        {!!apiError && <p>{apiError}</p>}
      </header>

      <AdminMenu />

      <div className="filters">
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="All">Status: All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>

        <select value={region} onChange={(event) => setRegion(event.target.value)}>
          <option value="All">Region: All</option>
          <option value="Hồ Chí Minh">Ho Chi Minh</option>
          <option value="Hà Nội">Ha Noi</option>
          <option value="Đà Nẵng">Da Nang</option>
        </select>

        <input
          type="date"
          value={fromDate}
          onChange={(event) => setFromDate(event.target.value)}
          aria-label="From date"
        />

        <input
          type="date"
          value={toDate}
          onChange={(event) => setToDate(event.target.value)}
          aria-label="To date"
        />

        <input
          type="search"
          placeholder="Search by name or email..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search applications"
        />
      </div>

      <div className="admin-table-wrap admin-surface">
        <table className="application-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Region</th>
              <th>Submitted Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={item.id}
                className="application-table__row"
                onClick={() => navigate(`/admin/applications/${item.id}`)}
              >
                <td>{item.fullName}</td>
                <td>{item.email}</td>
                <td>{item.region}</td>
                <td>{String(item.submittedAt || "").slice(0, 10)}</td>
                <td>
                  <StatusBadge status={item.status} />
                </td>
              </tr>
            ))}

            {!loading && data.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "18px" }}>
                  No applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ApplicationListPage;