import { useEffect, useState } from "react";
import AdminMenu from "../components/adminMenu/AdminMenu";
import StatusBadge from "../components/statusBadge/StatusBadge";
import { getAdminFranchisees } from "../api/adminApplications";
import Pagination from "@/shared/components/molecules/pagination/Pagination";
import "./FranchiseeListPage.css";
import "./AdminShared.css";

const PAGE_SIZE = 20;

const STATUSES = ["All", "Active", "Inactive", "Suspended"];

const FranchiseeListPage = () => {
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("All");
  const [searchInput, setSearchInput] = useState("");
  const [franchisees, setFranchisees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrevious: false,
  });

  useEffect(() => {
    setPage(1);
  }, [status, search]);

  useEffect(() => {
    const loadFranchisees = async () => {
      try {
        setLoading(true);
        setApiError("");

        const response = await getAdminFranchisees({
          status,
          search: search === "All" ? "" : search,
          page,
          pageSize: PAGE_SIZE,
        });

        setFranchisees(response.items || []);
        setPagination({
          totalPages: response.totalPages || 1,
          totalCount: response.totalCount || 0,
          hasNext: response.hasNext || false,
          hasPrevious: response.hasPrevious || false,
        });
      } catch (error) {
        setApiError(`Unable to load franchisees. Details: ${error.message}`);
        setFranchisees([]);
      } finally {
        setLoading(false);
      }
    };

    loadFranchisees();
  }, [status, search, page]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSearch(searchInput.trim() || "All");
  };

  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <h1>Franchisee Management</h1>
        <p>View and manage all active franchisees in the system.</p>
        {loading && <p className="franchisee-list__feedback">Loading franchisee data...</p>}
        {!!apiError && <p className="franchisee-list__feedback franchisee-list__feedback--error">{apiError}</p>}
      </header>

      <AdminMenu />

      <div className="filters franchisee-list__filters">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              Status: {s}
            </option>
          ))}
        </select>

        <form className="franchisee-list__search-form" onSubmit={handleSearchSubmit}>
          <input
            type="search"
            placeholder="Search by name or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            aria-label="Search franchisees"
          />
        </form>
      </div>

      <div className="admin-table-wrap admin-surface">
        <table className="franchisee-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Royalty Rate</th>
              <th>Total Stores</th>
            </tr>
          </thead>
          <tbody>
            {franchisees.map((item) => (
              <tr key={item.id} className="franchisee-table__row">
                <td>{item.fullName}</td>
                <td>{item.email}</td>
                <td>
                  <StatusBadge status={item.status} />
                </td>
                <td>
                  {item.royaltyRate != null ? (
                    <span className="franchisee-table__rate">{Number(item.royaltyRate).toFixed(1)}%</span>
                  ) : (
                    <span className="franchisee-table__empty">—</span>
                  )}
                </td>
                <td>{item.totalStores ?? 0}</td>
              </tr>
            ))}

            {!loading && franchisees.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "18px" }}>
                  No franchisees found.
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

export default FranchiseeListPage;
