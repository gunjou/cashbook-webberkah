import { LOGO_PATHS as PATHS, LOGO_VIEW_BOX } from "../utils/logo-paths";

// Warnanya mengikuti tema lewat --logo-* (index.css).
const Logo = ({ title = "Cashbook", className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox={LOGO_VIEW_BOX}
    role="img"
    aria-label={title}
    className={className}
  >
    <path fillRule="evenodd" fill="var(--logo-main)" d={PATHS.main} />
    <path fillRule="evenodd" fill="var(--logo-deep)" d={PATHS.deep} />
    <path fillRule="evenodd" fill="var(--logo-accent)" d={PATHS.accent} />
  </svg>
);

export default Logo;
