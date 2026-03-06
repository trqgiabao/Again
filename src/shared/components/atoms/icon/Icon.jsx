import './Icon.css';
const Icon = ({ 
  children, 
  size = 20, 
  className = '',
  ...props 
}) => {
  return (
    <span 
      className={`icon ${className}`}
      style={{ width: size, height: size }}
      {...props}
    >
      {children}
    </span>
  );
};
export default Icon;