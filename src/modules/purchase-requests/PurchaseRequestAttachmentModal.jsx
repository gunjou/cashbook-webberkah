import React, { useEffect } from "react";
import { X, ExternalLink, FileText, FileImage } from "lucide-react";

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

  const documentExtensions = [
    "pdf",
    "doc",
    "docx",
    "xls",
    "xlsx",
    "ppt",
    "pptx",
  ];

  const isImage = imageExtensions.includes(extension);
  const isPdf = extension === "pdf";
  const isDocument = documentExtensions.includes(extension);

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm"
      onMouseDown={handleBackdropClick}
    >
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {isImage ? (
                <FileImage size={17} className="text-primary" />
              ) : (
                <FileText size={17} className="text-primary" />
              )}

              <p className="text-xs font-black uppercase tracking-wider text-text">
                Attachment
              </p>
            </div>

            <p className="mt-1 truncate text-[10px] text-muted">{fileName}</p>
          </div>

          <div className="flex items-center gap-2">
            {!isImage && (
              <a
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                className="flex h-9 items-center gap-2 rounded-lg bg-primary px-3 text-[9px] font-black uppercase tracking-wider text-white transition-all hover:opacity-90"
              >
                <ExternalLink size={15} />
                Buka
              </a>
            )}

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface text-muted transition-all hover:bg-border hover:text-text"
              aria-label="Tutup attachment"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto bg-surface p-5">
          {isImage && (
            <img
              src={fileUrl}
              alt={fileName}
              className="max-h-[75vh] max-w-full rounded-lg object-contain shadow-lg"
            />
          )}

          {isPdf && (
            <iframe
              src={fileUrl}
              title={fileName}
              className="h-[75vh] w-full rounded-lg border border-border bg-white shadow-lg"
            />
          )}

          {isDocument && !isPdf && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card px-8 py-12 text-center shadow-lg">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <FileText size={32} className="text-primary" />
              </div>

              <p className="mt-4 max-w-lg truncate text-sm font-black text-text">
                {fileName}
              </p>

              <p className="mt-2 max-w-md text-xs leading-relaxed text-muted">
                Format file ini tidak dapat ditampilkan langsung di browser.
              </p>

              <a
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-5 flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white transition-all hover:opacity-90"
              >
                <ExternalLink size={16} />
                Buka File
              </a>
            </div>
          )}

          {!isImage && !isPdf && !isDocument && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card px-8 py-12 text-center shadow-lg">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface">
                <FileText size={32} className="text-muted" />
              </div>

              <p className="mt-4 max-w-lg truncate text-sm font-black text-text">
                {fileName}
              </p>

              <p className="mt-2 text-xs text-muted">
                Format file belum didukung untuk preview.
              </p>

              <a
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-5 flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white transition-all hover:opacity-90"
              >
                <ExternalLink size={16} />
                Buka File
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseRequestAttachmentModal;
