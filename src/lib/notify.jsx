import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Info,
  XCircle,
} from "lucide-react";

import Button from "../components/Button";

const ICONS = {
  success: { Icon: CheckCircle2, className: "text-[#1f7a35]" },
  error: { Icon: XCircle, className: "text-[#c2000f]" },
  warning: { Icon: AlertTriangle, className: "text-[#c93400]" },
  info: { Icon: Info, className: "text-primary" },
  question: { Icon: HelpCircle, className: "text-primary" },
};

const IconBadge = ({ icon, className }) => {
  const entry = ICONS[icon];

  if (!entry) return null;

  const { Icon } = entry;

  return (
    <Icon
      aria-hidden="true"
      strokeWidth={1.75}
      className={`shrink-0 ${entry.className} ${className}`}
    />
  );
};

// Notifikasi singkat: tidak menghalangi halaman dan hilang sendiri.
const Toast = ({ options, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, options.timer);

    return () => clearTimeout(timer);
  }, [options, onClose]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex justify-center px-4">
      <div
        role="status"
        className="glass pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-[1.5rem] bg-white/70 px-4 py-3 motion-safe:animate-notify-drop"
      >
        <IconBadge icon={options.icon} className="size-6" />

        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink">{options.title}</p>

          {options.text && (
            <p className="text-sm text-neutral-600">{options.text}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Dialog yang perlu ditanggapi, termasuk konfirmasi.
const Alert = ({ options, onConfirm, onDismiss }) => {
  const panelRef = useRef(null);
  const confirmRef = useRef(null);
  const canDismiss = options.allowOutsideClick !== false;

  useEffect(() => {
    const previous = document.activeElement;

    confirmRef.current?.focus();

    return () => previous?.focus?.();
  }, []);

  useEffect(() => {
    // Capture: Escape tidak boleh ikut menutup modal di bawah dialog ini.
    const handleKey = (event) => {
      if (event.key === "Escape") {
        event.stopImmediatePropagation();
        onDismiss();
      }

      if (event.key === "Tab") {
        const buttons = panelRef.current.querySelectorAll("button");
        const first = buttons[0];
        const last = buttons[buttons.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKey, true);

    return () => window.removeEventListener("keydown", handleKey, true);
  }, [onDismiss]);

  return (
    <div
      onClick={canDismiss ? onDismiss : undefined}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/30 p-4 backdrop-blur-sm motion-safe:animate-notify-fade"
    >
      <div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="notify-title"
        aria-describedby={options.text ? "notify-text" : undefined}
        onClick={(event) => event.stopPropagation()}
        className="panel-dialog flex max-h-[85dvh] w-full max-w-xs flex-col items-center rounded-card p-5 text-center motion-safe:animate-notify-pop"
      >
        <IconBadge icon={options.icon} className="mb-3 size-10" />

        <h2 id="notify-title" className="text-lg font-semibold text-ink">
          {options.title}
        </h2>

        {options.text && (
          <p
            id="notify-text"
            className="mt-1 min-h-0 overflow-y-auto break-words text-sm text-neutral-600"
          >
            {options.text}
          </p>
        )}

        <div
          className={`mt-5 grid w-full shrink-0 gap-2 ${
            options.showCancelButton ? "grid-cols-2" : "grid-cols-1"
          }`}
        >
          {options.showCancelButton && (
            <Button variant="light" onClick={onDismiss}>
              {options.cancelButtonText || "Batal"}
            </Button>
          )}

          <Button ref={confirmRef} onClick={onConfirm}>
            {options.confirmButtonText || "OK"}
          </Button>
        </div>
      </div>
    </div>
  );
};

let show = null;
let pending = [];
let settleCurrent = null;

const Host = () => {
  const [options, setOptions] = useState(null);

  useEffect(() => {
    show = setOptions;
    pending.forEach((item) => setOptions(item));
    pending = [];

    return () => {
      show = null;
    };
  }, []);

  if (!options) return null;

  const isToast = Boolean(options.timer) && options.showConfirmButton === false;

  return isToast ? (
    <Toast key={options.id} options={options} onClose={options.dismiss} />
  ) : (
    <Alert
      key={options.id}
      options={options}
      onConfirm={options.confirm}
      onDismiss={options.dismiss}
    />
  );
};

const ensureHost = () => {
  if (document.getElementById("notify-root")) return;

  const container = document.createElement("div");

  container.id = "notify-root";
  document.body.appendChild(container);
  createRoot(container).render(<Host />);
};

let nextId = 0;

const fire = (options) =>
  new Promise((resolve) => {
    ensureHost();

    // Hanya satu notifikasi tampil; yang lama selesai sebagai "ditutup".
    settleCurrent?.(false);

    const settle = (isConfirmed) => {
      if (settleCurrent !== settle) return;

      settleCurrent = null;
      resolve({ isConfirmed, isDismissed: !isConfirmed });
      show?.((current) => (current?.settle === settle ? null : current));
    };

    settleCurrent = settle;

    const item = {
      ...options,
      id: (nextId += 1),
      settle,
      confirm: () => settle(true),
      dismiss: () => settle(false),
    };

    if (show) show(item);
    else pending.push(item);
  });

const notify = { fire };

export default notify;
