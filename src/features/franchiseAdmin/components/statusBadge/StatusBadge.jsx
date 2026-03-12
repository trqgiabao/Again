import "./StatusBadge.css";

const getStatusClassName = (status = "") => {
  const normalized = String(status).toLowerCase();

  if (normalized === "pending") return "status-badge status-badge--pending";
  if (normalized === "approved") return "status-badge status-badge--approved";
  if (normalized === "rejected") return "status-badge status-badge--rejected";

  return "status-badge status-badge--default";
};

const StatusBadge = ({ status }) => {
  return <span className={getStatusClassName(status)}>{status || "Unknown"}</span>;
};

export default StatusBadge;