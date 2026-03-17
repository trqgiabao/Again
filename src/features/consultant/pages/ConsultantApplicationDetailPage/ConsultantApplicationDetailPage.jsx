import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import StatusBadge from "@/features/franchiseAdmin/components/statusBadge/StatusBadge";
import Modal from "@/features/franchiseAdmin/components/modal/Modal";
import ConsultantMenu from "../../components/ConsultantMenu/ConsultantMenu";
import {
  createConsultationLog,
  getConsultantApplicationDetail,
  getFranchisePackages,
  submitPackageSelection,
  submitSiteInspection,
} from "../../api/consultantApi";
import "../ConsultantDashboardPage/ConsultantDashboardPage.css";
import "./ConsultantApplicationDetailPage.css";

const INITIAL_CONSULTATION_FORM = {
  contactMethod: "Phone",
  summary: "",
  appointmentDate: "",
  appointmentLocation: "",
  nextAction: "",
};

const formatCurrency = (value) => {
  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)} đ`;
};

const formatDateTime = (value) => {
  if (!value) return "N/A";
  return String(value).replace("T", " ");
};

const normalizeAppointmentDate = (value) => {
  if (!value) return "";
  return value.length === 16 ? `${value}:00` : value;
};

const getInitialInspectionForm = () => ({
  inspectionDate: new Date().toISOString().slice(0, 10),
  addressLine: "",
  city: "",
  region: "",
  area: "",
  frontWidth: "",
  isOwnedByApplicant: true,
  monthlyRent: "",
  notes: "",
  images: "",
});

const DEFAULT_PACKAGE_SELECTION_NOTE =
  "Consultant proposed this package based on the applicant's profile and expected capital.";

const buildPackageSelectionNote = (packageName) => {
  if (!packageName) return DEFAULT_PACKAGE_SELECTION_NOTE;
  return `Consultant proposed ${packageName} based on the applicant's profile and expected capital.`;
};

const getInitialPackageSelectionForm = () => ({
  packageId: "",
  notes: DEFAULT_PACKAGE_SELECTION_NOTE,
});

const isPackageAvailableForRegion = (franchisePackage, preferredRegion) => {
  if (!preferredRegion) return true;
  if (!Array.isArray(franchisePackage?.allowedRegions) || franchisePackage.allowedRegions.length === 0) {
    return true;
  }

  return franchisePackage.allowedRegions.includes(preferredRegion);
};

const ConsultantApplicationDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [applicationData, setApplicationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [openConsultationLog, setOpenConsultationLog] = useState(false);
  const [consultationLoading, setConsultationLoading] = useState(false);
  const [consultationForm, setConsultationForm] = useState(INITIAL_CONSULTATION_FORM);
  const [openSiteInspection, setOpenSiteInspection] = useState(false);
  const [inspectionLoading, setInspectionLoading] = useState(false);
  const [inspectionForm, setInspectionForm] = useState(getInitialInspectionForm);
  const [openPackageSelection, setOpenPackageSelection] = useState(false);
  const [packageOptions, setPackageOptions] = useState([]);
  const [packageLoading, setPackageLoading] = useState(false);
  const [packageSubmitLoading, setPackageSubmitLoading] = useState(false);
  const [packageApiError, setPackageApiError] = useState("");
  const [packageForm, setPackageForm] = useState(getInitialPackageSelectionForm);
  const returnPath = location.state?.from || "/consultant/dashboard";

  useEffect(() => {
    const loadDetail = async () => {
      try {
        setLoading(true);
        setApiError("");
        const detail = await getConsultantApplicationDetail(id);
        setApplicationData(detail);
      } catch (error) {
        setApiError(`Unable to load application detail. Details: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [id]);

  const highlights = useMemo(() => {
    if (!applicationData) return [];

    const summaryItems = [
      {
        label: "Current Status",
        value: applicationData.status || "Unknown",
        badge: true,
      },
      {
        label: "Preferred Region",
        value: applicationData.preferredRegion || "N/A",
      },
      {
        label: "Expected Capital",
        value: formatCurrency(applicationData.expectedCapital),
      },
      {
        label: "Submitted At",
        value: formatDateTime(applicationData.createdAt),
      },
      {
        label: "Last Updated",
        value: formatDateTime(applicationData.updatedAt),
      },
      {
        label: "Reviewed By",
        value: applicationData.reviewedBy || "Not reviewed yet",
      },
      {
        label: "Reviewed At",
        value: formatDateTime(applicationData.reviewedAt),
      },
      {
        label: "Reject Reason",
        value: applicationData.rejectReason || "None",
      },
    ];

    if (applicationData.selectedPackageName) {
      summaryItems.push({
        label: "Selected Package",
        value: applicationData.selectedPackageName,
      });
    }

    if (applicationData.proposedRoyaltyRate > 0) {
      summaryItems.push({
        label: "Proposed Royalty",
        value: `${applicationData.proposedRoyaltyRate}%`,
      });
    }

    if (applicationData.proposedDurationMonths > 0) {
      summaryItems.push({
        label: "Proposed Duration",
        value: `${applicationData.proposedDurationMonths} months`,
      });
    }

    return summaryItems;
  }, [applicationData]);

  const selectedPackage = useMemo(
    () => packageOptions.find((item) => item.id === packageForm.packageId) || null,
    [packageOptions, packageForm.packageId]
  );

  const handleConsultationFieldChange = (field) => (event) => {
    const value = event.target.value;
    setConsultationForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCloseConsultationLog = () => {
    if (consultationLoading) return;
    setOpenConsultationLog(false);
  };

  const handlePackageFieldChange = (field) => (event) => {
    const value = event.target.value;
    setPackageForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSelectPackage = (franchisePackage) => {
    setPackageForm((prev) => {
      const currentPackageName = packageOptions.find((item) => item.id === prev.packageId)?.name;
      const currentDefaultNote = buildPackageSelectionNote(currentPackageName);
      const nextNote =
        !prev.notes || prev.notes === DEFAULT_PACKAGE_SELECTION_NOTE || prev.notes === currentDefaultNote
          ? buildPackageSelectionNote(franchisePackage.name)
          : prev.notes;

      return {
        ...prev,
        packageId: franchisePackage.id,
        notes: nextNote,
      };
    });
  };

  const handleClosePackageSelection = () => {
    if (packageSubmitLoading) return;
    setOpenPackageSelection(false);
    setPackageApiError("");
  };

  const handleOpenPackageSelection = async () => {
    setOpenPackageSelection(true);
    setPackageApiError("");
    setPackageOptions([]);
    setPackageForm(getInitialPackageSelectionForm());

    try {
      setPackageLoading(true);
      const packages = await getFranchisePackages();
      const preferredRegion = applicationData?.preferredRegion;
      const existingSelectedPackageId = applicationData?.selectedPackageId;
      const preferredPackage = packages.find(
        (item) => item.id === existingSelectedPackageId && isPackageAvailableForRegion(item, preferredRegion)
      );
      const firstAllowedPackage = packages.find((item) =>
        isPackageAvailableForRegion(item, preferredRegion)
      );
      const fallbackPackage = preferredPackage || firstAllowedPackage || packages[0] || null;

      setPackageOptions(packages);
      setPackageForm({
        packageId: fallbackPackage?.id || "",
        notes: buildPackageSelectionNote(fallbackPackage?.name),
      });

      if (!fallbackPackage) {
        setPackageApiError("No franchise packages available for selection.");
      }
    } catch (error) {
      setPackageApiError(`Unable to load franchise packages. Details: ${error.message}`);
    } finally {
      setPackageLoading(false);
    }
  };

  const handleInspectionFieldChange = (field) => (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setInspectionForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCloseInspection = () => {
    if (inspectionLoading) return;
    setOpenSiteInspection(false);
  };

  const handleSubmitPackage = async () => {
    if (!selectedPackage) {
      toast.error("Please choose a franchise package before submitting.");
      return;
    }

    if (!isPackageAvailableForRegion(selectedPackage, applicationData?.preferredRegion)) {
      toast.error("The selected package is not available for this preferred region.");
      return;
    }

    const payload = {
      packageId: selectedPackage.id,
      proposedRoyaltyRate: selectedPackage.royaltyRate,
      proposedDurationMonths: selectedPackage.contractDurationMonths,
      notes: packageForm.notes.trim() || buildPackageSelectionNote(selectedPackage.name),
    };

    try {
      setPackageSubmitLoading(true);
      setPackageApiError("");
      await submitPackageSelection(id, payload);
      const detail = await getConsultantApplicationDetail(id);
      setApplicationData({
        ...detail,
        selectedPackageId: detail.selectedPackageId || selectedPackage.id,
        selectedPackageName: detail.selectedPackageName || selectedPackage.name,
        proposedRoyaltyRate: detail.proposedRoyaltyRate || selectedPackage.royaltyRate,
        proposedDurationMonths:
          detail.proposedDurationMonths || selectedPackage.contractDurationMonths,
      });
      setOpenPackageSelection(false);
      setPackageForm(getInitialPackageSelectionForm());
      toast.success("Franchise package submitted successfully.");
    } catch (error) {
      const message = `Unable to submit package selection. Details: ${error.message}`;
      setPackageApiError(message);
      toast.error(message);
    } finally {
      setPackageSubmitLoading(false);
    }
  };

  const handleSubmitInspection = async () => {
    const payload = {
      inspectionDate: inspectionForm.inspectionDate,
      addressLine: inspectionForm.addressLine.trim(),
      city: inspectionForm.city.trim(),
      region: inspectionForm.region,
      area: Number(inspectionForm.area) || 0,
      frontWidth: Number(inspectionForm.frontWidth) || 0,
      isOwnedByApplicant: inspectionForm.isOwnedByApplicant,
      monthlyRent: inspectionForm.isOwnedByApplicant
        ? null
        : inspectionForm.monthlyRent === "" ? null : Number(inspectionForm.monthlyRent),
      notes: inspectionForm.notes.trim(),
      images: inspectionForm.images
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    if (!payload.inspectionDate || !payload.addressLine || !payload.city || !payload.region) {
      toast.error("Please fill in Inspection Date, Address, City and Region.");
      return;
    }

    try {
      setInspectionLoading(true);
      await submitSiteInspection(id, payload);
      setOpenSiteInspection(false);
      setInspectionForm(getInitialInspectionForm());
      toast.success("Site inspection submitted successfully.");
      navigate(returnPath, { replace: true });
    } catch (error) {
      toast.error(`Unable to submit site inspection. ${error.message}`);
    } finally {
      setInspectionLoading(false);
    }
  };

  const handleSubmitConsultationLog = async () => {
    const payload = {
      contactMethod: consultationForm.contactMethod.trim(),
      summary: consultationForm.summary.trim(),
      appointmentDate: normalizeAppointmentDate(consultationForm.appointmentDate),
      appointmentLocation: consultationForm.appointmentLocation.trim(),
      nextAction: consultationForm.nextAction.trim(),
    };

    if (
      !payload.contactMethod ||
      !payload.summary ||
      !payload.appointmentDate ||
      !payload.appointmentLocation ||
      !payload.nextAction
    ) {
      toast.error("Please complete all consultation log fields before submitting.");
      return;
    }

    try {
      setConsultationLoading(true);
      await createConsultationLog(id, payload);
      setOpenConsultationLog(false);
      setConsultationForm(INITIAL_CONSULTATION_FORM);
      toast.success("Consultation log submitted successfully.");
      navigate(returnPath, { replace: true });
    } catch (error) {
      toast.error(`Unable to submit consultation log. Details: ${error.message}`);
    } finally {
      setConsultationLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="consultant-page">
        <header className="consultant-page__header">
          <h1>Application Details</h1>
          <p>Loading application details...</p>
        </header>
      </section>
    );
  }

  if (!applicationData) {
    return (
      <section className="consultant-page">
        <header className="consultant-page__header">
          <h1>Application Details</h1>
          <p>{apiError || "Application not found."}</p>
        </header>
      </section>
    );
  }

  return (
    <section className="consultant-page">
      <header className="consultant-page__header">
        <h1>Application Details</h1>
        <p>Review assigned franchise application information.</p>
      </header>

      <ConsultantMenu />

      <div className="consultant-application-detail__topbar">
        <button
          type="button"
          className="consultant-application-detail__back-btn"
          onClick={() => navigate(returnPath)}
        >
          ← Back to dashboard
        </button>

        <div className="consultant-application-detail__actions">
          <StatusBadge status={applicationData.status} />
          <button
            type="button"
            className="consultant-application-detail__action-btn consultant-application-detail__action-btn--package"
            onClick={handleOpenPackageSelection}
          >
            Submit Package
          </button>
          <button
            type="button"
            className="consultant-application-detail__action-btn"
            onClick={() => setOpenConsultationLog(true)}
          >
            Log Consultation
          </button>
          <button
            type="button"
            className="consultant-application-detail__action-btn consultant-application-detail__action-btn--inspection"
            onClick={() => setOpenSiteInspection(true)}
          >
            Submit Inspection
          </button>
        </div>
      </div>

      {!!apiError && <p className="consultant-application-detail__message">{apiError}</p>}

      <div className="consultant-application-detail__grid">
        <article className="consultant-surface consultant-application-detail__card">
          <h2>Applicant Information</h2>

          <div className="consultant-application-detail__info-grid">
            <div>
              <label>Application Code</label>
              <p>{applicationData.code || "N/A"}</p>
            </div>
            <div>
              <label>Full Name</label>
              <p>{applicationData.fullName || "N/A"}</p>
            </div>
            <div>
              <label>Email</label>
              <p>{applicationData.email || "N/A"}</p>
            </div>
            <div>
              <label>Phone Number</label>
              <p>{applicationData.phoneNumber || "N/A"}</p>
            </div>
            <div>
              <label>National ID</label>
              <p>{applicationData.nationalId || "N/A"}</p>
            </div>
            <div>
              <label>Preferred Region</label>
              <p>{applicationData.preferredRegion || "N/A"}</p>
            </div>
            <div className="consultant-application-detail__full">
              <label>Address</label>
              <p>{applicationData.address || "N/A"}</p>
            </div>
            <div className="consultant-application-detail__full">
              <label>Business Experience</label>
              <p>{applicationData.businessExperience || "N/A"}</p>
            </div>
          </div>
        </article>

        <article className="consultant-surface consultant-application-detail__card">
          <h2>Application Summary</h2>

          <div className="consultant-application-detail__summary-list">
            {highlights.map((item) => (
              <div key={item.label} className="consultant-application-detail__summary-item">
                <span>{item.label}</span>
                {item.badge ? <StatusBadge status={item.value} /> : <strong>{item.value}</strong>}
              </div>
            ))}
          </div>
        </article>
      </div>

      <Modal
        isOpen={openPackageSelection}
        title="Submit Franchise Package"
        onClose={handleClosePackageSelection}
        actions={(
          <>
            <button
              type="button"
              className="consultant-application-detail__secondary-btn"
              onClick={handleClosePackageSelection}
              disabled={packageSubmitLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="consultant-application-detail__primary-btn"
              onClick={handleSubmitPackage}
              disabled={packageLoading || packageSubmitLoading || !selectedPackage}
            >
              {packageSubmitLoading ? "Submitting..." : "Submit Package"}
            </button>
          </>
        )}
      >
        <div className="consultant-application-detail__form">
          {!!packageApiError && <p className="consultant-application-detail__message">{packageApiError}</p>}

          <div className="consultant-application-detail__package-profile">
            <span>Preferred Region: <strong>{applicationData.preferredRegion || "N/A"}</strong></span>
            <span>Expected Capital: <strong>{formatCurrency(applicationData.expectedCapital)}</strong></span>
          </div>

          {packageLoading ? (
            <p className="consultant-application-detail__package-empty">Loading franchise packages...</p>
          ) : packageOptions.length === 0 ? (
            <p className="consultant-application-detail__package-empty">No franchise packages available.</p>
          ) : (
            <div className="consultant-application-detail__package-list">
              {packageOptions.map((item) => {
                const isSelected = packageForm.packageId === item.id;
                const isAvailable = isPackageAvailableForRegion(item, applicationData.preferredRegion);

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={[
                      "consultant-application-detail__package-card",
                      isSelected ? "consultant-application-detail__package-card--selected" : "",
                      !isAvailable ? "consultant-application-detail__package-card--disabled" : "",
                    ].filter(Boolean).join(" ")}
                    onClick={() => handleSelectPackage(item)}
                    disabled={!isAvailable || packageSubmitLoading}
                  >
                    <div className="consultant-application-detail__package-card-head">
                      <h4>{item.name}</h4>
                      {isSelected && <span className="consultant-application-detail__package-card-badge">Selected</span>}
                    </div>

                    <div className="consultant-application-detail__package-meta">
                      <div className="consultant-application-detail__package-meta-item">
                        <span>Min Area</span>
                        <strong>{item.minArea || 0} m2</strong>
                      </div>
                      <div className="consultant-application-detail__package-meta-item">
                        <span>Min Capital</span>
                        <strong>{formatCurrency(item.minCapital)}</strong>
                      </div>
                      <div className="consultant-application-detail__package-meta-item">
                        <span>Franchise Fee</span>
                        <strong>{formatCurrency(item.franchiseFee)}</strong>
                      </div>
                      <div className="consultant-application-detail__package-meta-item">
                        <span>Royalty Rate</span>
                        <strong>{item.royaltyRate}%</strong>
                      </div>
                      <div className="consultant-application-detail__package-meta-item">
                        <span>Duration</span>
                        <strong>{item.contractDurationMonths} months</strong>
                      </div>
                      <div className="consultant-application-detail__package-meta-item">
                        <span>Allowed Regions</span>
                        <strong>{item.allowedRegions.length ? item.allowedRegions.join(", ") : "All regions"}</strong>
                      </div>
                    </div>

                    {!isAvailable && (
                      <p className="consultant-application-detail__package-hint">
                        This package is not available for {applicationData.preferredRegion || "the selected"} region.
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          <div className="consultant-application-detail__form-grid">
            <div className="consultant-application-detail__form-group">
              <label htmlFor="proposedRoyaltyRate">Proposed Royalty Rate</label>
              <input
                id="proposedRoyaltyRate"
                type="text"
                value={selectedPackage ? `${selectedPackage.royaltyRate}%` : ""}
                readOnly
                placeholder="Choose a package"
              />
            </div>

            <div className="consultant-application-detail__form-group">
              <label htmlFor="proposedDurationMonths">Proposed Duration</label>
              <input
                id="proposedDurationMonths"
                type="text"
                value={selectedPackage ? `${selectedPackage.contractDurationMonths} months` : ""}
                readOnly
                placeholder="Choose a package"
              />
            </div>
          </div>

          <div className="consultant-application-detail__form-group">
            <label htmlFor="packageNotes">Notes</label>
            <textarea
              id="packageNotes"
              value={packageForm.notes}
              onChange={handlePackageFieldChange("notes")}
              placeholder="Add a short recommendation note..."
              rows={3}
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={openConsultationLog}
        title="Create Consultation Log"
        onClose={handleCloseConsultationLog}
        actions={(
          <>
            <button
              type="button"
              className="consultant-application-detail__secondary-btn"
              onClick={handleCloseConsultationLog}
              disabled={consultationLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="consultant-application-detail__primary-btn"
              onClick={handleSubmitConsultationLog}
              disabled={consultationLoading}
            >
              {consultationLoading ? "Submitting..." : "Save Log"}
            </button>
          </>
        )}
      >
        <div className="consultant-application-detail__form">
          <div className="consultant-application-detail__form-grid">
            <div className="consultant-application-detail__form-group">
              <label htmlFor="contactMethod">Contact Method</label>
              <input
                id="contactMethod"
                type="text"
                value={consultationForm.contactMethod}
                onChange={handleConsultationFieldChange("contactMethod")}
                placeholder="Phone"
              />
            </div>

            <div className="consultant-application-detail__form-group">
              <label htmlFor="appointmentDate">Appointment Date</label>
              <input
                id="appointmentDate"
                type="datetime-local"
                value={consultationForm.appointmentDate}
                onChange={handleConsultationFieldChange("appointmentDate")}
              />
            </div>
          </div>

          <div className="consultant-application-detail__form-group">
            <label htmlFor="appointmentLocation">Appointment Location</label>
            <input
              id="appointmentLocation"
              type="text"
              value={consultationForm.appointmentLocation}
              onChange={handleConsultationFieldChange("appointmentLocation")}
              placeholder="Bcon city"
            />
          </div>

          <div className="consultant-application-detail__form-group">
            <label htmlFor="summary">Summary</label>
            <textarea
              id="summary"
              value={consultationForm.summary}
              onChange={handleConsultationFieldChange("summary")}
              placeholder="Write what was discussed during the contact..."
              rows={4}
            />
          </div>

          <div className="consultant-application-detail__form-group">
            <label htmlFor="nextAction">Next Action</label>
            <textarea
              id="nextAction"
              value={consultationForm.nextAction}
              onChange={handleConsultationFieldChange("nextAction")}
              placeholder="Describe the next step after this consultation..."
              rows={3}
            />
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={openSiteInspection}
        title="Submit Site Inspection"
        onClose={handleCloseInspection}
        actions={(
          <>
            <button
              type="button"
              className="consultant-application-detail__secondary-btn"
              onClick={handleCloseInspection}
              disabled={inspectionLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="consultant-application-detail__primary-btn"
              onClick={handleSubmitInspection}
              disabled={inspectionLoading}
            >
              {inspectionLoading ? "Submitting..." : "Submit Inspection"}
            </button>
          </>
        )}
      >
        <div className="consultant-application-detail__form">
          <div className="consultant-application-detail__form-grid">
            <div className="consultant-application-detail__form-group">
              <label htmlFor="inspectionDate">Inspection Date</label>
              <input
                id="inspectionDate"
                type="date"
                value={inspectionForm.inspectionDate}
                onChange={handleInspectionFieldChange("inspectionDate")}
              />
            </div>

            <div className="consultant-application-detail__form-group">
              <label htmlFor="region">Region</label>
              <select
                id="region"
                value={inspectionForm.region}
                onChange={handleInspectionFieldChange("region")}
              >
                <option value="">-- Select Region --</option>
                <option value="North">North (Miền Bắc)</option>
                <option value="Central">Central (Miền Trung)</option>
                <option value="South">South (Miền Nam)</option>
              </select>
            </div>
          </div>

          <div className="consultant-application-detail__form-group">
            <label htmlFor="addressLine">Address Line</label>
            <input
              id="addressLine"
              type="text"
              value={inspectionForm.addressLine}
              onChange={handleInspectionFieldChange("addressLine")}
              placeholder="e.g. 123 Duong thong nhat"
            />
          </div>

          <div className="consultant-application-detail__form-grid">
            <div className="consultant-application-detail__form-group">
              <label htmlFor="city">City / Province</label>
              <input
                id="city"
                type="text"
                value={inspectionForm.city}
                onChange={handleInspectionFieldChange("city")}
                placeholder="e.g. Binh Duong"
              />
            </div>

            <div className="consultant-application-detail__form-group">
              <label htmlFor="area">Area (m²)</label>
              <input
                id="area"
                type="number"
                min="0"
                value={inspectionForm.area}
                onChange={handleInspectionFieldChange("area")}
                placeholder="e.g. 300"
              />
            </div>
          </div>

          <div className="consultant-application-detail__form-grid">
            <div className="consultant-application-detail__form-group">
              <label htmlFor="frontWidth">Front Width (m)</label>
              <input
                id="frontWidth"
                type="number"
                min="0"
                value={inspectionForm.frontWidth}
                onChange={handleInspectionFieldChange("frontWidth")}
                placeholder="e.g. 30"
              />
            </div>

            <div className="consultant-application-detail__form-group consultant-application-detail__form-group--checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={inspectionForm.isOwnedByApplicant}
                  onChange={handleInspectionFieldChange("isOwnedByApplicant")}
                />
                Owned by Applicant
              </label>
            </div>
          </div>

          {!inspectionForm.isOwnedByApplicant && (
            <div className="consultant-application-detail__form-group">
              <label htmlFor="monthlyRent">Monthly Rent (VND)</label>
              <input
                id="monthlyRent"
                type="number"
                min="0"
                value={inspectionForm.monthlyRent}
                onChange={handleInspectionFieldChange("monthlyRent")}
                placeholder="e.g. 5000000"
              />
            </div>
          )}

          <div className="consultant-application-detail__form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              value={inspectionForm.notes}
              onChange={handleInspectionFieldChange("notes")}
              placeholder="Additional notes about the site..."
              rows={3}
            />
          </div>

          <div className="consultant-application-detail__form-group">
            <label htmlFor="images">Image URLs (one per line)</label>
            <textarea
              id="images"
              value={inspectionForm.images}
              onChange={handleInspectionFieldChange("images")}
              placeholder="https://cdn.example.com/image1.jpg
https://cdn.example.com/image2.jpg"
              rows={3}
            />
          </div>
        </div>
      </Modal>
    </section>
  );
};

export default ConsultantApplicationDetailPage;