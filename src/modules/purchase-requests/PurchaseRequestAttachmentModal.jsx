import React, { useEffect } from "react";
import { X, ExternalLink, FileText, FileImage } from "lucide-react";

import AttachmentViewer from "../../components/AttachmentViewer";

const PurchaseRequestAttachmentModal = ({ attachment, onClose }) => {
  useEffect(() => {
    if (!attachment) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [attachment, onClose]);

  if (!attachment) return null;

  const fileUrl = attachment.path;
  const fileName = attachment.name || "Lampiran";

  const extension =
    fileName.split(".").pop()?.toLowerCase() ||
    fileUrl.split(".").pop()?.split("?")[0].toLowerCase();

  const imageExtensions = ["jpg", "jpeg", "png", "webp", "gif"];

  const isImage = imageExtensions.includes(extension);

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm"
      onMouseDown={handleBackdropClick}
    >
      <div className="flex max-h-[92dvh] w-full max-w-5xl flex-col overflow-hidden panel-dialog rounded-card">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-primary-200 px-5 py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {isImage ? (
                <FileImage size={17} className="text-primary" />
              ) : (
                <FileText size={17} className="text-primary" />
              )}

              <p className="text-xs font-black uppercase tracking-wider text-ink">
                Attachment
              </p>
            </div>

            <p className="mt-1 truncate text-[11px] text-neutral-600">{fileName}</p>
          </div>

          <div className="flex items-center gap-2">
            {!isImage && (
              <a
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                className="flex h-9 items-center gap-2 rounded-full glass-primary px-3 text-[11px] font-black uppercase tracking-wider transition-all hover:opacity-90"
              >
                <ExternalLink size={15} />
                Buka
              </a>
            )}

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-neutral-600 transition-all hover:bg-primary-200 hover:text-ink"
              aria-label="Tutup attachment"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="flex h-[70dvh] min-h-0 flex-col overflow-hidden bg-white">
          <AttachmentViewer url={fileUrl} name={fileName} />
        </div>
      </div>
    </div>
  );
};

export default PurchaseRequestAttachmentModal;
