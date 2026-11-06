const Card = ({ highlight = false, className = "", children, ...props }) => (
  <div
    className={`${highlight ? "card-highlight" : "card-glass"} ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default Card;
