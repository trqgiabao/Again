import './StatusBadge.css';

const StatusBadge = ({ status }) => {
  return <span className={`status-badge status-badge--${status.toLowerCase()}`}>{status}</span>;
};

export default StatusBadge;