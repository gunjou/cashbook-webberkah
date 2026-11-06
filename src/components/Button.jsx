import { forwardRef } from "react";
import { ChevronRight } from "lucide-react";

const VARIANTS = {
  primary: "glass-primary",
  light: "glass-button text-ink",
};

const SIZES = {
  md: "h-11 px-5",
  lg: "h-13 px-6",
};

const Button = forwardRef(({
  variant = "primary",
  size = "md",
  chevrons = false,
  type = "button",
  className = "",
  children,
  ...props
}, ref) => (
  <button
    ref={ref}
    type={type}
    className={`inline-flex items-center justify-center gap-2 rounded-full text-[15px] font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
    {...props}
  >
    {children}

    {chevrons && (
      <span className="flex" aria-hidden="true">
        {[0, 1, 2].map((index) => (
          <ChevronRight
            key={index}
            strokeWidth={1.5}
            className="-ml-2.5 size-4 first:ml-0 motion-safe:animate-chevron-walk"
            style={{ animationDelay: `${index * 150}ms` }}
          />
        ))}
      </span>
    )}
  </button>
));

Button.displayName = "Button";

export default Button;
