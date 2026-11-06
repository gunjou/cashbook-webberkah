import { useEffect, useRef, useState } from "react";

const ZOOM_LEVELS = [1, 1.5, 2, 3];
const MAX_CANVAS_PIXELS = 12_000_000; // batas aman Safari iOS
const MAX_DEVICE_PIXEL_RATIO = 2;
const RENDER_MARGIN = "600px";

let pdfjsPromise = null;

// Dimuat saat dibutuhkan supaya tidak membebani bundle awal. Build legacy dipakai
// agar jalan di browser HP lama. Worker disalin utuh ke public/ oleh skrip npm:
// kalau ikut dibundel, minifier CRA merusak private field-nya (SyntaxError).
// Berekstensi .js karena server bisa mengirim .mjs dengan MIME yang salah.
const loadPdfjs = () => {
  pdfjsPromise ??= import("pdfjs-dist/legacy/build/pdf.mjs").then((pdfjs) => {
    pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`;

    return pdfjs;
  });

  return pdfjsPromise;
};

const PdfPage = ({ page, width, scrollerRef, onError }) => {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const [visible, setVisible] = useState(false);

  const base = page.getViewport({ scale: 1 });
  const height = (base.height / base.width) * width;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { root: scrollerRef.current, rootMargin: RENDER_MARGIN },
    );

    observer.observe(wrapperRef.current);

    return () => observer.disconnect();
  }, [scrollerRef]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!visible || !width || !canvas) return undefined;

    const ratio = Math.min(
      window.devicePixelRatio || 1,
      MAX_DEVICE_PIXEL_RATIO,
    );
    const wanted = (width / base.width) * ratio;
    const limit = Math.sqrt(MAX_CANVAS_PIXELS / (base.width * base.height));
    const viewport = page.getViewport({ scale: Math.min(wanted, limit) });

    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    const task = page.render({ canvas, viewport });

    task.promise.catch((error) => {
      if (error?.name === "RenderingCancelledException") return;

      console.error("Gagal menggambar halaman PDF", error);
      onError();
    });

    return () => {
      task.cancel();
      // Melepas memori halaman yang sudah jauh dari area terlihat.
      canvas.width = 0;
      canvas.height = 0;
    };
  }, [visible, width, page, base.width, base.height, onError]);

  return (
    <div
      ref={wrapperRef}
      className="mx-auto bg-white shadow-card"
      style={{ width, height }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
};

const PdfViewer = ({ blob, onError }) => {
  const scrollerRef = useRef(null);
  const [pages, setPages] = useState([]);
  const [containerWidth, setContainerWidth] = useState(0);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    let cancelled = false;
    let loadingTask = null;

    const load = async () => {
      try {
        const pdfjs = await loadPdfjs();
        const data = new Uint8Array(await blob.arrayBuffer());

        if (cancelled) return;

        loadingTask = pdfjs.getDocument({ data });

        const pdf = await loadingTask.promise;
        const loaded = await Promise.all(
          Array.from({ length: pdf.numPages }, (_, index) =>
            pdf.getPage(index + 1),
          ),
        );

        if (!cancelled) setPages(loaded);
      } catch (error) {
        if (cancelled) return;

        console.error("Gagal memuat PDF", error);
        onError();
      }
    };

    load();

    return () => {
      cancelled = true;
      setPages([]);
      loadingTask?.destroy();
    };
  }, [blob, onError]);

  // Lebar halaman mengikuti container, termasuk saat HP diputar.
  useEffect(() => {
    const scroller = scrollerRef.current;
    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });

    observer.observe(scroller);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <div className="flex shrink-0 items-center justify-center gap-1 border-b border-primary-200 p-2">
        {ZOOM_LEVELS.map((level) => (
          <button
            key={level}
            type="button"
            aria-pressed={zoom === level}
            onClick={() => setZoom(level)}
            className={`min-h-9 min-w-11 rounded-full px-3 text-xs font-semibold tabular-nums ${
              zoom === level ? "glass-primary" : "glass-button text-ink"
            }`}
          >
            {level}x
          </button>
        ))}
      </div>

      <div
        ref={scrollerRef}
        className="min-h-0 flex-1 overflow-auto bg-primary-50 p-2 sm:p-4"
      >
        {pages.length === 0 ? (
          <p className="py-10 text-center text-sm text-neutral-600">
            Memuat PDF...
          </p>
        ) : (
          <div className="flex w-max min-w-full flex-col gap-3">
            {pages.map((page) => (
              <PdfPage
                key={page.pageNumber}
                page={page}
                width={containerWidth * zoom}
                scrollerRef={scrollerRef}
                onError={onError}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfViewer;
