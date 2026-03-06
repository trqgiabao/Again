import "./Input.css";
const Input = ({ 
  type = 'text',
  placeholder,
  className = '',
  error,
  ...props 
}) => {
  const classNames = [
    'input',
    error && 'input--error',
    className
  ].filter(Boolean).join(' ');
  return (
    <input 
      type={type}
      placeholder={placeholder}
      className={classNames}
      {...props}
    />
  );
};
export default Input;
