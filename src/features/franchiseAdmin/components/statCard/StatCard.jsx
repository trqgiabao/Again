import './StatCard.css';

const StatCard = ({ title, value, variant = 'default', subText }) => {
  return (
    <article className={`stat-card stat-card--${variant}`}>
      <p className="stat-card__title">{title}</p>
      <h3 className="stat-card__value">{value}</h3>
      {subText ? <p className="stat-card__subtext">{subText}</p> : null}
    </article>
  );
};

export default StatCard;