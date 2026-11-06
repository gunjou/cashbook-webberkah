import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { ExternalLink, FileText } from "lucide-react";

import { detectFromBlob } from "../utils/file-detect";

const PdfViewer = lazy(() => import("./PdfViewer"));

const isPdfUrl = (url) => /\.pdf$/i.test(url.split(/[?#]/)[0]);

const Message = ({ text }) => (
  <p className="m-auto py-10 text-center text-sm text-neutral-600">{text}</p>
);

// Isi modal preview. `file` untuk file lokal, `url` untuk lampiran tersimpan.
// File di-fetch menjadi blob supaya tidak terhalang X-Frame-Options atau
// Content-Disposition, dan PDF digambar ke canvas karena iframe umumnya kosong di HP.
const AttachmentViewer = ({ file = null, url = "", name = "Lampiran" }) => {
  const [state, setState] = useState({ status: "loading" });
  const [fullSize, setFullSize] = useState(false);

  const showFallback = useCallback(() => {
    setState((current) => ({ ...current, status: "error" }));
  }, []);

  useEffect(() => {
    if (!file && !url) {
      setState({ status: "error" });
      return undefined;
    }

    // Hasil request yang sudah usang diabaikan. fetch sengaja tidak dibatalkan
    // dengan AbortController: pembatalan oleh StrictMode memunculkan AbortError.
    let cancelled = false;
    let objectUrl = "";

    setState({ status: "loading" });
    setFullSize(false);

    const load = async () => {
      try {
        let blob = file;

        if (!blob) {
          const response = await fetch(url);

          if (!response.ok) throw new Error(`HTTP ${response.status}`);

          blob = await response.blob();
        }

        const kind = await detectFromBlob(blob);

        if (cancelled) return;

        objectUrl = URL.createObjectURL(blob);

        setState({ status: kind === "other" ? "other" : "ready", kind, blob, src: objectUrl });
      } catch {
        if (cancelled) return;

        // Host yang menolak CORS: gambar masih bisa tampil lewat URL aslinya,
        // sedangkan PDF hanya mendapat tombol "Buka file".
        setState(
          url && !isPdfUrl(url)
            ? { status: "ready", kind: "image", src: url }
            : { status: "error" },
        );
      }
    };

    load();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [file, url]);

  const openUrl = url || state.src;

  if (state.status === "loading") return <Message text="Memuat lampiran..." />;

  if (state.status === "error" || state.status === "other") {
    return (
      <div className="m-auto flex flex-col items-center px-6 py-10 text-center">
        <FileText size={40} strokeWidth={1.5} aria-hidden="true" className="text-neutral-600" />

        <p className="mt-3 max-w-full truncate text-sm font-semibold text-ink">{name}</p>

        <p className="mt-1 text-sm text-neutral-600">
          {state.status === "other"
            ? "Format file ini tidak bisa ditampilkan di sini."
            : "Lampiran tidak bisa ditampilkan di sini."}
        </p>

        {openUrl && (
          <a
            href={openUrl}
            target="_blank"
            rel="noreferrer"
            className="glass-primary mt-5 inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold"
          >
            <ExternalLink size={16} aria-hidden="true" />
            Buka file
          </a>
        )}
      </div>
    );
  }

  if (state.kind === "pdf") {
    return (
      <Suspense fallback={<Message text="Memuat PDF..." />}>
        <PdfViewer blob={state.blob} onError={showFallback} />
      </Suspense>
    );
  }

  return (
    <div className={`min-h-0 w-full flex-1 overflow-auto p-2 sm:p-4 ${fullSize ? "" : "flex items-center justify-center"}`}>
      <button
        type="button"
        onClick={() => setFullSize((prev) => !prev)}
        aria-label={fullSize ? "Paskan ke layar" : "Lihat ukuran asli"}
        className={fullSize ? "block w-max cursor-zoom-out" : "flex h-full w-full cursor-zoom-in items-center justify-center"}
      >
        <img
          src={state.src}
          alt={name}
          onError={showFallback}
          className={fullSize ? "max-w-none" : "max-h-full max-w-full object-contain"}
        />
      </button>
    </div>
  );
};

export default AttachmentViewer;
