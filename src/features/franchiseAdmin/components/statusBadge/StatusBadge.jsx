import "./StatusBadge.css";

const STATUS_CLASS_MAP = {
  submitted:            "status-badge--submitted",
  assigned:             "status-badge--assigned",
  appointmentscheduled: "status-badge--appointment-scheduled",
  surveysubmitted:      "status-badge--survey-submitted",
  surveyapproved:       "status-badge--survey-approved",
  surveyrejected:       "status-badge--survey-rejected",
  packageselected:      "status-badge--package-selected",
  contractdrafting:     "status-badge--contract-drafting",
  contracted:           "status-badge--contracted",
  withdrawn:            "status-badge--withdrawn",
  approvedapplication:  "status-badge--approved",
  rejectedapplication:  "status-badge--rejected",
  // legacy
  pending:   "status-badge--submitted",
  approved:  "status-badge--approved",
  rejected:  "status-badge--rejected",
};

const getStatusClassName = (status = "") => {
  const key = String(status).toLowerCase().replace(/[^a-z]/g, "");
  return `status-badge ${STATUS_CLASS_MAP[key] || "status-badge--default"}`;
};

const StatusBadge = ({ status }) => {
  return <span className={getStatusClassName(status)}>{status || "Unknown"}</span>;
};

export default StatusBadge;