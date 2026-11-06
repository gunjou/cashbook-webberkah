// Sengaja bukan <dialog> native: top layer-nya akan menutupi SweetAlert dan
// mengubah urutan modal bertumpuk yang sekarang diatur lewat z-index.
const Dialog = ({
  open = true,
  onClose,
  zIndex = 50,
  className = "max-w-sm",
  children,
  ...props
}) => {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{ zIndex }}
      className="fixed inset-0 flex items-end justify-center bg-ink/30 p-4 backdrop-blur-sm sm:items-center"
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        className={`glass flex max-h-[90dvh] w-full flex-col overflow-hidden rounded-card bg-white/70 ${className}`}
        {...props}
      >
        {children}
      </div>
    </div>
  );
};

export default Dialog;
