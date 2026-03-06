import './Badge.css';
const Badge = ({ 
  children, 
  variant = 'default',
  className = '',
  ...props 
}) => {
  const classNames = [
    'badge',
    `badge--${variant}`,
    className
  ].filter(Boolean).join(' ');
  return (
    <span className={classNames} {...props}>
      {children}
    </span>
  );
};
export default Badge;