import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConsultantMenu from "../../components/ConsultantMenu/ConsultantMenu";
import { getConsultantDashboard } from "../../api/consultantApi";
import Pagination from "@/shared/components/molecules/pagination/Pagination";
import "./ConsultantDashboardPage.css";

const PAGE_SIZE = 20;

const ConsultantDashboardPage = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [region, setRegion] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [search, status, region]);

  useEffect(() => {
    setLoading(true);
    setApiError("");

    getConsultantDashboard({
      region,
      status,
      search,
      page,
      pageSize: PAGE_SIZE,
    })
      .then(setDashboard)
      .catch((err) => setApiError(err.message))
      .finally(() => setLoading(false));
  }, [region, status, search, page]);

  const workloadSummary = dashboard?.workloadSummary || {
    items: [],
    totalCount: 0,
    page,
    pageSize: PAGE_SIZE,
    totalPages: 1,
    hasPrevious: false,
    hasNext: false,
  };

  const totalCount = workloadSummary.totalCount || 0;
  const totalPages = workloadSummary.totalPages || 1;
  const currentPage = workloadSummary.page || page;
  const hasPrevious = Boolean(workloadSummary.hasPrevious);
  const hasNext = Boolean(workloadSummary.hasNext);

  return (
    <section className="consultant-page">
      <header className="consultant-page__header">
        <h1>Consultant Dashboard</h1>
        <p>Welcome back. Manage your assigned franchise applications.</p>
        {loading && <p className="consultant-page__feedback">Loading dashboard...</p>}
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
          placeholder="Search by code or full name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search workload"
        />
      </div>

      {dashboard && (
        <>
          <div className="consultant-dashboard__stats">
            <article className="consultant-surface consultant-dashboard__stat">
              <p className="consultant-dashboard__stat-label">Total Applications</p>
              <h2 className="consultant-dashboard__stat-value">{dashboard.totalApplications}</h2>
            </article>
            <article className="consultant-surface consultant-dashboard__stat">
              <p className="consultant-dashboard__stat-label">Successful Applications</p>
              <h2 className="consultant-dashboard__stat-value consultant-dashboard__stat-value--green">{dashboard.successfulApplications}</h2>
            </article>
            <article className="consultant-surface consultant-dashboard__stat">
              <p className="consultant-dashboard__stat-label">Pending Appointments</p>
              <h2 className="consultant-dashboard__stat-value consultant-dashboard__stat-value--orange">{dashboard.pendingAppointments}</h2>
            </article>
          </div>

          <section className="consultant-surface consultant-dashboard__workload">
            <h2 className="consultant-dashboard__workload-title">My Application Workload</h2>

            {workloadSummary.items?.length > 0 ? (
              <div className="consultant-table-wrap">
                <table className="consultant-table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Full Name</th>
                      <th>Region</th>
                      <th>Status</th>
                      <th>Assigned At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workloadSummary.items.map((item) => (
                      <tr
                        key={item.applicationId}
                        className="consultant-table__row"
                        onClick={() =>
                          navigate(`/consultant/applications/${item.applicationId}`, {
                            state: { from: "/consultant/dashboard" },
                          })
                        }
                      >
                        <td>{item.code}</td>
                        <td>{item.fullName}</td>
                        <td>{item.region}</td>
                        <td>{item.status}</td>
                        <td>{String(item.assignedAt || "").slice(0, 10) || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="consultant-dashboard__empty">No applications assigned yet.</p>
            )}
          </section>

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            hasPrevious={hasPrevious}
            hasNext={hasNext}
            loading={loading}
            onPageChange={setPage}
          />
        </>
      )}
    </section>
  );
};

export default ConsultantDashboardPage;
