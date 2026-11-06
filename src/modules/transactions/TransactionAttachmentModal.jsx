import { useEffect } from "react";

import { ExternalLink, ImageOff, X } from "lucide-react";

import AttachmentViewer from "../../components/AttachmentViewer";

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

  const fileUrl = transaction?.attachment_url;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90dvh] w-full max-w-5xl flex-col overflow-hidden panel-dialog rounded-card"
      >
        {/* ==========================
            Header
        ========================== */}

        <div className="flex items-center justify-between border-b border-primary-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-ink">
              Bukti Transaksi
            </h2>

            <p className="mt-1 text-sm text-neutral-600">
              {transaction?.transaction_description ?? "-"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 transition glass-button"
          >
            <X size={20} />
          </button>
        </div>

        {/* ==========================
            Preview
        ========================== */}

        <div className="flex h-[70dvh] min-h-0 flex-col overflow-hidden bg-white">
          {fileUrl ? (
            <AttachmentViewer url={fileUrl} name="Bukti Transaksi" />
          ) : (
            <div className="m-auto flex flex-col items-center text-neutral-600">
              <ImageOff size={60} />

              <p className="mt-4">Tidak ada attachment.</p>
            </div>
          )}
        </div>

        {/* ==========================
            Footer
        ========================== */}

        <div className="flex items-center justify-between border-t border-primary-200 px-6 py-4">
          <div className="text-sm text-neutral-600">
            {transaction?.reference_number || "-"}
          </div>

          {fileUrl && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-lg border border-primary-200 px-4 py-2 text-sm transition hover:bg-primary-100 hover:text-ink"
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
