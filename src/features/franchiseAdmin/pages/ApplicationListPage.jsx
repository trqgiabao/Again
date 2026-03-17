import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminMenu from "../components/adminMenu/AdminMenu";
import StatusBadge from "../components/statusBadge/StatusBadge";
import { getAdminApplications, getApplicationStatuses } from "../api/adminApplications";
import Pagination from "@/shared/components/molecules/pagination/Pagination";
import "./ApplicationListPage.css";
import "./AdminShared.css";

const PAGE_SIZE = 20;

const ApplicationListPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("All");
  const [region, setRegion] = useState("All");
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [applications, setApplications] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, totalCount: 0, hasNext: false, hasPrevious: false });

  useEffect(() => {
    getApplicationStatuses()
      .then(setStatuses)
      .catch(() => setStatuses([]));
  }, []);

  useEffect(() => {
    setPage(1);
  }, [status, region, search, fromDate, toDate]);

  useEffect(() => {
    const loadApplications = async () => {
      try {
        setLoading(true);
        setApiError("");

        const response = await getAdminApplications({
          status,
          preferredRegion: region,
          search,
          page,
          pageSize: PAGE_SIZE,
        });

        setApplications(response.items || []);
        setPagination({
          totalPages: response.totalPages || 1,
          totalCount: response.totalCount || 0,
          hasNext: response.hasNext || false,
          hasPrevious: response.hasPrevious || false,
        });
      } catch (error) {
        setApiError(`Unable to load applications. Details: ${error.message}`);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, [status, region, search, fromDate, toDate, page]);

  const data = applications;

  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <h1>Franchise Application List</h1>
        <p>Manage applications by status, region, and submission date.</p>
        {loading && <p className="application-list__feedback">Loading application data...</p>}
        {!!apiError && <p className="application-list__feedback application-list__feedback--error">{apiError}</p>}
      </header>

      <AdminMenu />

      <div className="filters">
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="All">Status: All</option>
          {statuses.map((s) => (
            <option key={s.value} value={s.name}>{s.name}</option>
          ))}
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
                <td>{item.preferredRegion}</td>
                <td>{String(item.createdAt || "").slice(0, 10)}</td>
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

      <Pagination
        page={page}
        totalPages={pagination.totalPages}
        totalCount={pagination.totalCount}
        hasPrevious={pagination.hasPrevious}
        hasNext={pagination.hasNext}
        loading={loading}
        onPageChange={setPage}
      />
    </section>
  );
};

export default ApplicationListPage;