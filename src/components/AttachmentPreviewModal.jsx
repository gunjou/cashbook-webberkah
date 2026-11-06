import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import AttachmentViewer from "./AttachmentViewer";

// Preview lampiran (gambar/PDF) sebelum submit.
// `file` untuk file lokal yang baru dipilih, `url` untuk lampiran tersimpan.
const AttachmentPreviewModal = ({ open, file = null, url = "", onClose }) => {
  useEffect(() => {
    if (!open) return undefined;

    const handleEsc = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);

    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  const title = file?.name || url.split(/[?#]/)[0].split("/").pop();

  // Portal tetap mem-bubble event ke modal induk lewat React tree, jadi event
  // dihentikan di sini agar modal induk tidak ikut tertutup.
  return createPortal(
    <div
      onClick={(event) => {
        event.stopPropagation();
        onClose();
      }}
      onMouseDown={(event) => event.stopPropagation()}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[90dvh] w-full max-w-4xl flex-col overflow-hidden panel-dialog rounded-card"
      >
        <div className="flex items-center justify-between gap-3 border-b border-primary-200 px-5 py-3">
          <p className="min-w-0 truncate text-sm font-semibold text-primary-strong">
            {title}
          </p>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full p-2 transition glass-button"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex h-[70dvh] min-h-0 flex-col overflow-hidden bg-white">
          <AttachmentViewer file={file} url={url} name={title} />
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default AttachmentPreviewModal;
