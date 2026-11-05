import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

// Preview lampiran (gambar/PDF) sebelum submit.
// `file` untuk file lokal yang baru dipilih, `url` untuk lampiran tersimpan.
const AttachmentPreviewModal = ({ open, file = null, url = "", onClose }) => {
  const [localUrl, setLocalUrl] = useState("");

  const isPdf = file
    ? file.type === "application/pdf" || /\.pdf$/i.test(file.name)
    : /\.pdf$/i.test(url.split(/[?#]/)[0]);

  useEffect(() => {
    if (!open || !file) return undefined;

    const objectUrl = URL.createObjectURL(
      isPdf ? new Blob([file], { type: "application/pdf" }) : file,
    );

    setLocalUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
      setLocalUrl("");
    };
  }, [open, file, isPdf]);

  useEffect(() => {
    if (!open) return undefined;

    const handleEsc = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);

    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  const previewUrl = file ? localUrl : url;
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
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
          <p className="min-w-0 truncate text-sm font-semibold text-secondary">
            {title}
          </p>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 transition hover:bg-surface"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-1 items-center justify-center overflow-auto bg-surface p-4">
          {previewUrl &&
            (isPdf ? (
              <iframe
                src={previewUrl}
                title={title}
                className="h-[75vh] w-full rounded-lg border border-border bg-white"
              />
            ) : (
              <img
                src={previewUrl}
                alt={title}
                className="max-h-[75vh] max-w-full rounded-lg border border-border bg-white object-contain"
              />
            ))}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default AttachmentPreviewModal;
