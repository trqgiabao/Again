import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import AdminMenu from "../components/adminMenu/AdminMenu";
import Modal from "../components/modal/Modal";
import StatusBadge from "../components/statusBadge/StatusBadge";
import {
  approveAdminSiteInspection,
  getAdminSiteInspectionDetail,
  rejectAdminSiteInspection,
} from "../api/adminApplications";
import "./AdminInspectionDetailPage.css";
import "./AdminShared.css";

const formatDateTime = (value) => {
  if (!value) return "N/A";
  return String(value).replace("T", " ");
};

const formatDate = (value) => {
  if (!value) return "N/A";
  return String(value).slice(0, 10);
};

const formatNumber = (value, suffix = "") => {
  if (value === null || value === undefined || value === "") return "N/A";
  const formatted = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(Number(value));
  return suffix ? `${formatted} ${suffix}` : formatted;
};

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === "") return "N/A";
  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)} đ`;
};

const isImageSource = (value) => /^(https?:\/\/|blob:|data:image\/)/i.test(String(value || ""));

const AdminInspectionDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [inspectionData, setInspectionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [openApprove, setOpenApprove] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [approveNote, setApproveNote] = useState("");
  const [rejectNote, setRejectNote] = useState("");
  const returnPath = location.state?.from || "/admin/inspections";

  useEffect(() => {
    const loadDetail = async () => {
      try {
        setLoading(true);
        setApiError("");
        const detail = await getAdminSiteInspectionDetail(id);
        setInspectionData(detail);
      } catch (error) {
        setApiError(`Unable to load site inspection detail. Details: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [id]);

  const handleApprove = async () => {
    if (!approveNote.trim()) {
      toast.error("Please enter an approval note before approving this inspection.");
      return;
    }

    try {
      setActionLoading(true);

      await approveAdminSiteInspection(id, {
        note: approveNote.trim(),
      });

      setInspectionData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          status: "Approved",
          reviewedAt: new Date().toISOString(),
          adminReviewNote: approveNote.trim(),
        };
      });

      setOpenApprove(false);
      setApproveNote("");
      toast.success("Site inspection approved successfully.");
    } catch (error) {
      toast.error(`Approval failed. Details: ${error.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectNote.trim()) {
      toast.error("Please enter a rejection note before rejecting this inspection.");
      return;
    }

    try {
      setActionLoading(true);

      await rejectAdminSiteInspection(id, {
        adminReviewNote: rejectNote.trim(),
      });

      setInspectionData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          status: "Rejected",
          reviewedAt: new Date().toISOString(),
          adminReviewNote: rejectNote.trim(),
        };
      });

      setOpenReject(false);
      setRejectNote("");
      toast.success("Site inspection rejected successfully.");
    } catch (error) {
      toast.error(`Rejection failed. Details: ${error.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const summaryItems = useMemo(() => {
    if (!inspectionData) return [];

    return [
      { label: "Application Code", value: inspectionData.applicationCode || "N/A" },
      { label: "Full Name", value: inspectionData.applicantName || "N/A" },
      { label: "Inspection Date", value: formatDate(inspectionData.inspectionDate) },
      { label: "Region", value: inspectionData.region || "N/A" },
      { label: "Area", value: formatNumber(inspectionData.area, "m²") },
      { label: "Front Width", value: formatNumber(inspectionData.frontWidth, "m") },
      {
        label: "Site Ownership",
        value: inspectionData.isOwnedByApplicant ? "Owned by applicant" : "Rental property",
      },
      {
        label: "Monthly Rent",
        value: inspectionData.isOwnedByApplicant ? "Not applicable" : formatCurrency(inspectionData.monthlyRent),
      },
    ];
  }, [inspectionData]);

  if (loading) {
    return (
      <section className="admin-page">
        <header className="admin-page__header">
          <h1>Inspection Details</h1>
          <p>Loading site inspection details...</p>
        </header>
      </section>
    );
  }

  if (!inspectionData) {
    return (
      <section className="admin-page">
        <header className="admin-page__header">
          <h1>Inspection Details</h1>
          <p>{apiError || "Site inspection not found."}</p>
        </header>
      </section>
    );
  }

  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <h1>Inspection Details</h1>
        <p>Review submitted site inspection information from consultants.</p>
      </header>

      <AdminMenu />

      <div className="inspection-detail-page__topbar">
        <button
          type="button"
          className="inspection-detail-page__back-btn"
          onClick={() => navigate(returnPath)}
        >
          ← Back to inspections
        </button>

        <div className="inspection-detail-page__actions">
          <StatusBadge status={inspectionData.status} />

          <button
            type="button"
            className="inspection-detail-page__action-btn inspection-detail-page__action-btn--approve"
            onClick={() => setOpenApprove(true)}
            disabled={actionLoading || inspectionData.status === "Approved"}
          >
            Approve
          </button>

          <button
            type="button"
            className="inspection-detail-page__action-btn inspection-detail-page__action-btn--reject"
            onClick={() => setOpenReject(true)}
            disabled={actionLoading || inspectionData.status === "Rejected"}
          >
            Reject
          </button>
        </div>
      </div>

      {!!apiError && <p className="inspection-detail-page__message">{apiError}</p>}

      <div className="inspection-detail-page__grid">
        <article className="admin-surface inspection-detail-page__card">
          <h2>Site Overview</h2>

          <div className="inspection-detail-page__info-grid">
            {summaryItems.map((item) => (
              <div key={item.label}>
                <label>{item.label}</label>
                <p>{item.value}</p>
              </div>
            ))}
            <div className="inspection-detail-page__full">
              <label>Address</label>
              <p>{inspectionData.addressLine || "N/A"}</p>
            </div>
            <div>
              <label>City</label>
              <p>{inspectionData.city || "N/A"}</p>
            </div>
            <div>
              <label>Application ID</label>
              <p>{inspectionData.applicationId || "N/A"}</p>
            </div>
            <div className="inspection-detail-page__full">
              <label>Notes</label>
              <p>{inspectionData.notes || "No notes provided."}</p>
            </div>
          </div>
        </article>

        <article className="admin-surface inspection-detail-page__card">
          <h2>Review Information</h2>

          <div className="inspection-detail-page__info-grid inspection-detail-page__info-grid--single">
            <div>
              <label>Inspected By</label>
              <p>{inspectionData.inspectedBy || "N/A"}</p>
            </div>
            <div>
              <label>Reviewed By</label>
              <p>{inspectionData.reviewedBy || "Not reviewed yet"}</p>
            </div>
            <div>
              <label>Reviewed At</label>
              <p>{formatDateTime(inspectionData.reviewedAt)}</p>
            </div>
            <div>
              <label>Created At</label>
              <p>{formatDateTime(inspectionData.createdAt)}</p>
            </div>
            <div>
              <label>Admin Review Note</label>
              <p>{inspectionData.adminReviewNote || "No review note."}</p>
            </div>
          </div>
        </article>
      </div>

      <article className="admin-surface inspection-detail-page__card inspection-detail-page__media-card">
        <h2>Inspection Images</h2>

        {Array.isArray(inspectionData.images) && inspectionData.images.length > 0 ? (
          <div className="inspection-detail-page__media-grid">
            {inspectionData.images.map((image, index) => (
              <div key={`${String(image)}-${index}`} className="inspection-detail-page__media-item">
                {isImageSource(image) ? (
                  <>
                    <img src={image} alt={`Inspection ${index + 1}`} className="inspection-detail-page__image" />
                    <a
                      href={image}
                      target="_blank"
                      rel="noreferrer"
                      className="inspection-detail-page__image-link"
                    >
                      Open image {index + 1}
                    </a>
                  </>
                ) : (
                  <div className="inspection-detail-page__image-fallback">
                    <strong>Image {index + 1}</strong>
                    <span>{String(image)}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="inspection-detail-page__empty">No inspection images attached.</p>
        )}
      </article>

      <Modal
        isOpen={openApprove}
        title="Approve Site Inspection"
        onClose={() => !actionLoading && setOpenApprove(false)}
      >
        <div className="inspection-detail-page__review-form">
          <label htmlFor="approveNote">Approval Note</label>
          <textarea
            id="approveNote"
            value={approveNote}
            onChange={(event) => setApproveNote(event.target.value)}
            placeholder="Enter the approval note..."
            rows={4}
          />
        </div>

        <div className="inspection-detail-page__modal-actions">
          <button
            type="button"
            className="inspection-detail-page__secondary-btn"
            onClick={() => setOpenApprove(false)}
            disabled={actionLoading}
          >
            Cancel
          </button>

          <button
            type="button"
            className="inspection-detail-page__primary-btn"
            onClick={handleApprove}
            disabled={actionLoading || !approveNote.trim()}
          >
            {actionLoading ? "Processing..." : "Confirm Approval"}
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={openReject}
        title="Reject Site Inspection"
        onClose={() => !actionLoading && setOpenReject(false)}
      >
        <div className="inspection-detail-page__review-form">
          <label htmlFor="rejectNote">Rejection Note</label>
          <textarea
            id="rejectNote"
            value={rejectNote}
            onChange={(event) => setRejectNote(event.target.value)}
            placeholder="Enter the rejection note..."
            rows={5}
          />
        </div>

        <div className="inspection-detail-page__modal-actions">
          <button
            type="button"
            className="inspection-detail-page__secondary-btn"
            onClick={() => setOpenReject(false)}
            disabled={actionLoading}
          >
            Cancel
          </button>

          <button
            type="button"
            className="inspection-detail-page__danger-btn"
            onClick={handleReject}
            disabled={actionLoading || !rejectNote.trim()}
          >
            {actionLoading ? "Processing..." : "Confirm Rejection"}
          </button>
        </div>
      </Modal>
    </section>
  );
};

export default AdminInspectionDetailPage;
