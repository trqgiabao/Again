import './FilterButton.css';
const FilterButton = ({ 
  children, 
  isActive = false,
  className = '',
  ...props 
}) => {
  const classNames = [
    'filter-button',
    isActive && 'filter-button--active',
    className
  ].filter(Boolean).join(' ');
  return (
    <button className={classNames} {...props}>
      {children}
    </button>
  );
};
export default FilterButton;
