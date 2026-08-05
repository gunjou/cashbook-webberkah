const FullscreenLoading = ({ show, text = "Memuat..." }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-sm">
      <div className="w-72 rounded-xl bg-white p-8 shadow-card">
        <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-secondary" />

        <p className="text-center text-sm font-medium text-gray-600">{text}</p>
      </div>
    </div>
  );
};

export default FullscreenLoading;
