const Inline = ({ text = "Memuat..." }) => {
  return (
    <div className="flex items-center gap-2 text-sm text-muted">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <span>{text}</span>
    </div>
  );
};

const Button = ({ text = "Memproses..." }) => {
  return (
    <>
      <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
      {text}
    </>
  );
};

const Data = ({ text = "Memuat data..." }) => {
  return (
    <div className="flex min-h-[250px] flex-col items-center justify-center">
      <div className="mb-4 h-10 w-10 animate-spin rounded-full border-[3px] border-primary border-t-transparent" />

      <p className="text-sm text-muted">{text}</p>
    </div>
  );
};

const Fullscreen = ({ show, text = "Memuat..." }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-72 rounded-xl border border-border bg-card p-8 shadow-modal">
        <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-secondary" />

        <p className="text-center text-sm text-text">{text}</p>
      </div>
    </div>
  );
};

const Loading = {
  Button,
  Data,
  Fullscreen,
  Inline,
};

export default Loading;
