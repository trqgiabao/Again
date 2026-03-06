import './IconButton.css';
const IconButton = ({ 
  children, 
  variant = 'default',
  size = 'medium',
  className = '',
  badge,
  ...props 
}) => {
  const classNames = [
    'icon-button',
    `icon-button--${variant}`,
    `icon-button--${size}`,
    className
  ].filter(Boolean).join(' ');
  return (
    <button className={classNames} {...props}>
      {children}
      {badge !== undefined && (
        <span className="icon-button__badge">{badge}</span>
      )}
    </button>
  );
};
export default IconButton;