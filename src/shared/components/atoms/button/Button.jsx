import "./Button.css";
 const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const classNames = [
    'button',
    `button--${variant}`,
    `button--${size}`,
    fullWidth && 'button--full-width',
    className
  ].filter(Boolean).join(' ');
  return (
    <button className={classNames} {...props}>
      {children}
    </button>
  );
};

export default Button;