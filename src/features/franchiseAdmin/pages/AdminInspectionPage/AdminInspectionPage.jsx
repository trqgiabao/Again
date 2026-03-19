import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminMenu from "../../components/adminMenu/AdminMenu";
import StatusBadge from "../../components/statusBadge/StatusBadge";
import { getAdminSiteInspections } from "../../api/adminApplications";
import Pagination from "@/shared/components/molecules/pagination/Pagination";
import "./AdminInspectionPage.css";
import "../AdminShared.css";

const PAGE_SIZE = 20;

const AdminInspectionPage = () => {
  const navigate = useNavigate();
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [status, setStatus] = useState("All");
  const [region, setRegion] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrevious: false,
  });

  useEffect(() => {
    setPage(1);
  }, [status, region, search]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setApiError("");
        const data = await getAdminSiteInspections({ page, pageSize: PAGE_SIZE, status, region, search });
        setInspections(data.items ?? []);
        setPagination({
          totalPages: data.totalPages ?? 1,
          totalCount: data.totalCount ?? 0,
          hasNext: data.hasNext ?? false,
          hasPrevious: data.hasPrevious ?? false,
        });
      } catch (err) {
        setApiError(`Unable to load site inspections. ${err.message}`);
        setInspections([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [page, status, region, search]);

  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <h1>Site Inspections</h1>
        <p>Review all franchise site inspection reports.</p>
        {loading && <p className="admin-inspection__feedback">Loading...</p>}
        {!!apiError && <p className="admin-inspection__feedback admin-inspection__feedback--error">{apiError}</p>}
      </header>

      <AdminMenu />

      <div className="filters">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="All">Status: All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>

        <select value={region} onChange={(e) => setRegion(e.target.value)}>
          <option value="All">Region: All</option>
          <option value="North">North (Miền Bắc)</option>
          <option value="Central">Central (Miền Trung)</option>
          <option value="South">South (Miền Nam)</option>
        </select>

        <input
          type="search"
          placeholder="Search by code or full name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search inspections"
        />
      </div>

      <div className="admin-table-wrap admin-surface">
        <table className="application-table admin-inspection__table">
          <thead>
            <tr>
              <th>App Code</th>
              <th>Full Name</th>
              <th>Region</th>
              <th>Area (m²)</th>
              <th>Inspection Date</th>
              <th>Submitted At</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {inspections.map((item) => (
              <tr
                key={item.id}
                className="application-table__row"
                onClick={() => navigate(`/admin/inspections/${item.id}`, { state: { from: "/admin/inspections" } })}
              >
                <td>{item.applicationCode || "—"}</td>
                <td>{item.applicantName || "—"}</td>
                <td>{item.region || "—"}</td>
                <td>{item.area != null ? Number(item.area).toLocaleString("en-US") : "—"}</td>
                <td>{String(item.inspectionDate || "").slice(0, 10) || "—"}</td>
                <td>{String(item.createdAt || "").slice(0, 10) || "—"}</td>
                <td>
                  <StatusBadge status={item.status} />
                </td>
              </tr>
            ))}
            {!loading && inspections.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "24px", color: "var(--text-secondary)" }}>
                  No site inspections found.
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

export default AdminInspectionPage;
