import { useEffect, useState } from "react";
import { FileText, ImagePlus, Plus, X } from "lucide-react";

import AttachmentFileName from "./AttachmentFileName";
import AttachmentPreviewModal from "./AttachmentPreviewModal";
import {
  ATTACHMENT_ACCEPT,
  ATTACHMENT_MAX_FILES,
  validateAttachment,
} from "../modules/purchase-requests/purchase-request.service";
import notify from "../lib/notify";

const fileIdentity = (file) => `${file.name}|${file.size}|${file.lastModified}`;

const formatSize = (size) =>
  size >= 1024 * 1024
    ? `${(size / 1024 / 1024).toFixed(1)} MB`
    : `${(size / 1024).toFixed(1)} KB`;

// Lampiran lama tanpa ekstensi .pdf tetap diperlakukan sebagai gambar.
const isPdfUrl = (url) => /\.pdf$/i.test(url.split(/[?#]/)[0]);

const Thumbnail = ({ src }) =>
  src ? (
    <img
      src={src}
      alt=""
      className="h-10 w-10 shrink-0 rounded-lg border border-primary-200 object-cover"
    />
  ) : (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center glass-inset rounded-xl">
      <FileText size={18} className="text-primary" />
    </div>
  );

const FileThumbnail = ({ file }) => {
  const [src, setSrc] = useState("");

  useEffect(() => {
    if (!file.type.startsWith("image/")) return undefined;

    const objectUrl = URL.createObjectURL(file);
    setSrc(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return <Thumbnail src={src} />;
};

const Row = ({ thumbnail, name, detail, onPreview, onRemove, disabled }) => (
  <li className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-2">
    {thumbnail}

    <div className="min-w-0 flex-1">
      <AttachmentFileName name={name} onClick={onPreview} />
      <p className="text-xs text-neutral-600">{detail}</p>
    </div>

    <button
      type="button"
      onClick={onRemove}
      disabled={disabled}
      aria-label={`Hapus ${name}`}
      className="shrink-0 rounded-full p-1.5 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 glass-button"
    >
      <X size={14} />
    </button>
  </li>
);

// `files` adalah file baru yang akan digabung backend menjadi 1 PDF sesuai urutan.
// `savedUrl` adalah lampiran tersimpan; file baru akan menggantikannya saat disimpan.
const AttachmentMultiInput = ({
  files,
  onChange,
  savedUrl = "",
  onRemoveSaved,
  uploadProgress = null,
  disabled = false,
}) => {
  const [preview, setPreview] = useState(null);

  const handleSelect = ({ target }) => {
    const selected = Array.from(target.files ?? []);
    target.value = ""; // agar file yang sama bisa dipilih ulang

    const known = new Set(files.map(fileIdentity));
    const accepted = [];
    const problems = [];

    selected.forEach((file) => {
      const identity = fileIdentity(file);
      if (known.has(identity)) return;

      const error = validateAttachment(file);
      if (error) {
        problems.push(`${file.name}: ${error}`);
        return;
      }

      known.add(identity);
      accepted.push(file);
    });

    const room = ATTACHMENT_MAX_FILES - files.length;

    if (accepted.length > room) {
      problems.push(`Maksimal ${ATTACHMENT_MAX_FILES} file lampiran.`);
    }

    if (problems.length) {
      notify.fire({
        icon: "warning",
        title: "File Tidak Valid",
        text: problems.join(" "),
      });
    }

    const added = accepted.slice(0, room);
    if (added.length) onChange([...files, ...added]);
  };

  const showSaved = savedUrl && !files.length;
  const isEmpty = !files.length && !savedUrl;
  const isFull = files.length >= ATTACHMENT_MAX_FILES;

  const input = (
    <input
      hidden
      multiple
      type="file"
      accept={ATTACHMENT_ACCEPT}
      onChange={handleSelect}
      disabled={disabled}
    />
  );

  return (
    <div className="space-y-2">
      {isEmpty ? (
        <label className="flex h-[52px] cursor-pointer items-center justify-center gap-2 rounded-full border-dashed transition hover:border-primary hover:bg-primary/5 glass-button">
          {input}
          <ImagePlus size={18} className="text-primary" />
          <span className="text-sm font-medium text-ink">
            Pilih Bukti (Gambar / PDF)
          </span>
        </label>
      ) : (
        <>
          <ul className="max-h-52 space-y-2 overflow-y-auto">
            {showSaved && (
              <Row
                thumbnail={<Thumbnail src={isPdfUrl(savedUrl) ? "" : savedUrl} />}
                name={savedUrl.split(/[?#]/)[0].split("/").pop()}
                detail="File tersimpan"
                onPreview={() => setPreview({ url: savedUrl })}
                onRemove={onRemoveSaved}
                disabled={disabled}
              />
            )}

            {files.map((file) => (
              <Row
                key={fileIdentity(file)}
                thumbnail={<FileThumbnail file={file} />}
                name={file.name}
                detail={formatSize(file.size)}
                onPreview={() => setPreview({ file })}
                onRemove={() =>
                  onChange(files.filter((item) => item !== file))
                }
                disabled={disabled}
              />
            ))}
          </ul>

          {uploadProgress !== null && (
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-primary-200">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          {!isFull && (
            <label className="flex cursor-pointer items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium text-ink transition hover:bg-white glass-button">
              {input}
              <Plus size={14} className="text-primary" />
              {showSaved ? "Ganti Bukti" : "Tambah Bukti"}
            </label>
          )}
        </>
      )}

      <p className="text-xs text-neutral-600">
        {savedUrl && files.length > 0
          ? "File baru akan menggantikan bukti tersimpan. "
          : ""}
        Maks. {ATTACHMENT_MAX_FILES} file, digabung menjadi 1 PDF.
      </p>

      <AttachmentPreviewModal
        open={Boolean(preview)}
        file={preview?.file ?? null}
        url={preview?.url ?? ""}
        onClose={() => setPreview(null)}
      />
    </div>
  );
};

export default AttachmentMultiInput;
