import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminMenu from "../components/adminMenu/AdminMenu";
import Modal from "../components/modal/Modal";
import StatusBadge from "../components/statusBadge/StatusBadge";
import {
  approveAdminApplication,
  getAdminApplicationDetail,
  rejectAdminApplication,
} from "../api/franchiseAdminApi";
import "./ApplicationDetailPage.css";
import "./AdminShared.css";

const formatCurrency = (value) => {
  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)} đ`;
};

const ApplicationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [applicationData, setApplicationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const [openApprove, setOpenApprove] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    const loadDetail = async () => {
      try {
        setLoading(true);
        setApiError("");
        const detail = await getAdminApplicationDetail(id);
        setApplicationData(detail);
      } catch (error) {
        setApiError(`Unable to load application detail. Details: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [id]);

  const timeline = useMemo(() => {
    return Array.isArray(applicationData?.history) ? applicationData.history : [];
  }, [applicationData]);

  const handleApprove = async () => {
    try {
      setActionLoading(true);
      setActionError("");

      await approveAdminApplication(id, {
        note: "Approved by admin",
      });

      setApplicationData((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          status: "Approved",
          history: [
            ...(prev.history || []),
            {
              time: new Date().toLocaleString("en-GB"),
              status: "Approved",
              note: "Approved by admin",
            },
          ],
        };
      });

      setOpenApprove(false);
    } catch (error) {
      setActionError(`Approval failed. Details: ${error.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setActionLoading(true);
      setActionError("");

      await rejectAdminApplication(id, {
        rejectReason: rejectReason.trim(),
      });

      setApplicationData((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          status: "Rejected",
          history: [
            ...(prev.history || []),
            {
              time: new Date().toLocaleString("en-GB"),
              status: "Rejected",
              note: rejectReason.trim(),
            },
          ],
        };
      });

      setOpenReject(false);
      setRejectReason("");
    } catch (error) {
      setActionError(`Rejection failed. Details: ${error.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="admin-page">
        <header className="admin-page__header">
          <h1>Application Details</h1>
          <p>Loading application details...</p>
        </header>
      </section>
    );
  }

  if (!applicationData) {
    return (
      <section className="admin-page">
        <header className="admin-page__header">
          <h1>Application Details</h1>
          <p>{apiError || "Application not found."}</p>
        </header>
      </section>
    );
  }

  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <h1>Application Details</h1>
        <p>Review submitted franchise application information and decision history.</p>
      </header>

      <AdminMenu />

      <div className="application-detail-page__topbar">
        <button
          type="button"
          className="application-detail-page__back-btn"
          onClick={() => navigate("/admin/applications")}
        >
          ← Back to list
        </button>

        <div className="application-detail-page__actions">
          <StatusBadge status={applicationData.status} />

          <button
            type="button"
            className="application-detail-page__action-btn application-detail-page__action-btn--approve"
            onClick={() => setOpenApprove(true)}
            disabled={actionLoading || applicationData.status === "Approved"}
          >
            Approve
          </button>

          <button
            type="button"
            className="application-detail-page__action-btn application-detail-page__action-btn--reject"
            onClick={() => setOpenReject(true)}
            disabled={actionLoading || applicationData.status === "Rejected"}
          >
            Reject
          </button>
        </div>
      </div>

      {!!apiError && <p className="application-detail-page__message">{apiError}</p>}
      {!!actionError && <p className="application-detail-page__message">{actionError}</p>}

      <div className="application-detail-page__grid">
        <article className="admin-surface application-detail-page__card">
          <h2>Applicant Information</h2>

          <div className="application-detail-page__info-grid">
            <div>
              <label>Application Code</label>
              <p>{applicationData.code || "N/A"}</p>
            </div>
            <div>
              <label>Full Name</label>
              <p>{applicationData.fullName}</p>
            </div>
            <div>
              <label>Email</label>
              <p>{applicationData.email}</p>
            </div>
            <div>
              <label>Phone Number</label>
              <p>{applicationData.phoneNumber}</p>
            </div>
            <div>
              <label>National ID</label>
              <p>{applicationData.nationalId}</p>
            </div>
            <div>
              <label>Preferred Region</label>
              <p>{applicationData.preferredRegion}</p>
            </div>
            <div className="application-detail-page__full">
              <label>Address</label>
              <p>{applicationData.address}</p>
            </div>
            <div className="application-detail-page__full">
              <label>Business Experience</label>
              <p>{applicationData.businessExperience}</p>
            </div>
            <div>
              <label>Expected Capital</label>
              <p>{formatCurrency(applicationData.expectedCapital)}</p>
            </div>
            <div>
              <label>Submitted At</label>
              <p>{String(applicationData.createdAt || "").replace("T", " ")}</p>
            </div>
          </div>
        </article>

        <article className="admin-surface application-detail-page__card">
          <h2>Decision Timeline</h2>

          {timeline.length > 0 ? (
            <div className="application-detail-page__timeline">
              {timeline.map((item, index) => (
                <div
                  key={`${item.time}-${item.status}-${index}`}
                  className="application-detail-page__timeline-item"
                >
                  <div className="application-detail-page__timeline-dot" />
                  <div className="application-detail-page__timeline-content">
                    <div className="application-detail-page__timeline-row">
                      <strong>{item.status}</strong>
                      <span>{item.time}</span>
                    </div>
                    <p>{item.note || "No note provided."}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No history available.</p>
          )}
        </article>
      </div>

      <Modal
        isOpen={openApprove}
        title="Approve Application"
        onClose={() => setOpenApprove(false)}
      >
        <p>Are you sure you want to approve this application?</p>

        <div className="application-detail-page__modal-actions">
          <button
            type="button"
            className="application-detail-page__secondary-btn"
            onClick={() => setOpenApprove(false)}
            disabled={actionLoading}
          >
            Cancel
          </button>

          <button
            type="button"
            className="application-detail-page__primary-btn"
            onClick={handleApprove}
            disabled={actionLoading}
          >
            {actionLoading ? "Processing..." : "Confirm Approval"}
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={openReject}
        title="Reject Application"
        onClose={() => setOpenReject(false)}
      >
        <div className="application-detail-page__reject-form">
          <label htmlFor="rejectReason">Rejection Reason</label>
          <textarea
            id="rejectReason"
            value={rejectReason}
            onChange={(event) => setRejectReason(event.target.value)}
            placeholder="Enter the reason for rejection..."
            rows={5}
          />
        </div>

        <div className="application-detail-page__modal-actions">
          <button
            type="button"
            className="application-detail-page__secondary-btn"
            onClick={() => setOpenReject(false)}
            disabled={actionLoading}
          >
            Cancel
          </button>

          <button
            type="button"
            className="application-detail-page__danger-btn"
            onClick={handleReject}
            disabled={actionLoading || !rejectReason.trim()}
          >
            {actionLoading ? "Processing..." : "Confirm Rejection"}
          </button>
        </div>
      </Modal>
    </section>
  );
};

export default ApplicationDetailPage;