const IconButton = ({ label, type = "button", className = "", children, ...props }) => (
  <button
    type={type}
    aria-label={label}
    title={label}
    className={`glass inline-flex size-11 shrink-0 items-center justify-center rounded-full text-ink transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default IconButton;
