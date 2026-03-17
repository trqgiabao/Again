import { useEffect, useState } from "react";
import { toast } from "sonner";
import ConsultantMenu from "../../components/ConsultantMenu/ConsultantMenu";
import { getPoolApplications, assignPoolApplication } from "../../api/consultantApi";
import Pagination from "@/shared/components/molecules/pagination/Pagination";
import "../ConsultantDashboardPage/ConsultantDashboardPage.css";

const PAGE_SIZE = 20;

const PoolApplicationPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [region, setRegion] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, totalCount: 0, hasNext: false, hasPrevious: false });
  const [assigning, setAssigning] = useState(null);

  useEffect(() => {
    setPage(1);
  }, [search, status, region]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setApiError("");
        const data = await getPoolApplications({ page, pageSize: PAGE_SIZE, search, status, region });
        setApplications(data.items ?? []);
        setPagination({
          totalPages: data.totalPages ?? 1,
          totalCount: data.totalCount ?? 0,
          hasNext: data.hasNext ?? false,
          hasPrevious: data.hasPrevious ?? false,
        });
      } catch (err) {
        setApiError(`Unable to load pool applications. ${err.message}`);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [page, search, status, region]);

  const handleAssign = async (id) => {
    try {
      setAssigning(id);
      await assignPoolApplication(id);
      setApplications((prev) => prev.filter((a) => a.id !== id));
      toast.success("Application assigned successfully.");
    } catch (err) {
      toast.error(`Failed to assign: ${err.message}`);
    } finally {
      setAssigning(null);
    }
  };

  return (
    <section className="consultant-page">
      <header className="consultant-page__header">
        <h1>Pool Applications</h1>
        <p>Pick up unassigned franchise applications and manage them.</p>
        {loading && <p className="consultant-page__feedback">Loading...</p>}
        {!!apiError && <p className="consultant-page__feedback consultant-page__feedback--error">{apiError}</p>}
      </header>

      <ConsultantMenu />

      <div className="consultant-filters">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="All">Status: All</option>
          <option value="Submitted">Submitted</option>
          <option value="Assigned">Assigned</option>
          <option value="AppointmentScheduled">AppointmentScheduled</option>
          <option value="SurveySubmitted">SurveySubmitted</option>
          <option value="SurveyApproved">SurveyApproved</option>
          <option value="SurveyRejected">SurveyRejected</option>
          <option value="PackageSelected">PackageSelected</option>
          <option value="ContractDrafting">ContractDrafting</option>
          <option value="Contracted">Contracted</option>
          <option value="Withdrawn">Withdrawn</option>
        </select>

        <input
          type="text"
          placeholder="Filter by region..."
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          aria-label="Filter by region"
        />

        <input
          type="search"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search applications"
        />
      </div>

      <div className="consultant-surface consultant-table-wrap">
        <table className="consultant-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Full Name</th>
              <th>Region</th>
              <th>Submitted At</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((item) => (
              <tr key={item.id} className="consultant-table__row">
                <td>{item.code || "—"}</td>
                <td>{item.fullName || "—"}</td>
                <td>{item.region || "—"}</td>
                <td>{String(item.createdAt || "").slice(0, 10) || "—"}</td>
                <td>{item.status || "—"}</td>
                <td>
                  <button
                    className="consultant-assign-btn"
                    disabled={assigning === item.id}
                    onClick={() => handleAssign(item.id)}
                  >
                    {assigning === item.id ? "Assigning..." : "Assign to me"}
                  </button>
                </td>
              </tr>
            ))}
            {!loading && applications.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "24px", color: "var(--text-secondary)" }}>
                  No pool applications found.
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

export default PoolApplicationPage;
