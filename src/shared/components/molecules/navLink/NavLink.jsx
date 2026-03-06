import './NavLink.css';
const NavLink = ({ 
  href = '#', 
  children, 
  isActive = false,
  className = '',
  ...props 
}) => {
  const classNames = [
    'nav-link',
    isActive && 'nav-link--active',
    className
  ].filter(Boolean).join(' ');
  return (
    <a href={href} className={classNames} {...props}>
      {children}
    </a>
  );
};
export default NavLink;