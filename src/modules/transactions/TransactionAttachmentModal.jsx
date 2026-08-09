import { useEffect } from "react";

import { ExternalLink, ImageOff, X } from "lucide-react";

const TransactionAttachmentModal = ({ open, onClose, transaction = null }) => {
  useEffect(() => {
    if (!open) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [open, onClose]);

  if (!open) return null;

  const imageUrl = transaction?.attachment_url;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-modal"
      >
        {/* ==========================
            Header
        ========================== */}

        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-secondary">
              Bukti Transaksi
            </h2>

            <p className="mt-1 text-sm text-muted">
              {transaction?.transaction_description ?? "-"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-surface"
          >
            <X size={20} />
          </button>
        </div>

        {/* ==========================
            Image
        ========================== */}

        <div className="flex flex-1 items-center justify-center overflow-auto bg-surface p-6">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Attachment"
              className="max-h-[70vh] max-w-full rounded-xl border border-border bg-white object-contain shadow-card"
            />
          ) : (
            <div className="flex flex-col items-center text-muted">
              <ImageOff size={60} />

              <p className="mt-4">Tidak ada attachment.</p>
            </div>
          )}
        </div>

        {/* ==========================
            Footer
        ========================== */}

        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <div className="text-sm text-muted">
            {transaction?.reference_number || "-"}
          </div>

          {imageUrl && (
            <a
              href={imageUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm transition hover:bg-primary hover:text-white"
            >
              <ExternalLink size={16} />
              Buka di Tab Baru
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionAttachmentModal;
