import { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Circle,
  FileImage,
  FileText,
  Flag,
  Image,
  Landmark,
  MessageSquare,
  User,
  X,
} from "lucide-react";

import { downloadPurchaseRequestPdf } from "./purchase-request.service";

import CurrencyText from "../../components/CurrencyText";
import Loading from "../../components/Loading";
import swal from "../../lib/swal";
import { MdDownload } from "react-icons/md";

const STATUS_STYLE = {
  REQUESTED: {
    label: "Requested",
    className: "bg-yellow-500/10 text-yellow-600",
  },
  REVIEWED: {
    label: "Reviewed",
    className: "bg-emerald-500/10 text-emerald-600",
  },
  APPROVED: { label: "Approved", className: "bg-green-500/10 text-green-600" },
  REJECTED: { label: "Rejected", className: "bg-red-500/10 text-red-600" },
  PAID: { label: "Paid", className: "bg-sky-500/10 text-sky-600" },
};

const PRIORITY_STYLE = {
  NORMAL: { label: "Normal", className: "bg-surface text-muted" },
  URGENT: { label: "Urgent", className: "bg-yellow-500/10 text-yellow-600" },
  TOP_URGENT: { label: "Top Urgent", className: "bg-red-500/10 text-red-600" },
};

const formatDate = (value) => {
  if (!value) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
};

const formatDateTime = (value) => {
  if (!value) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

const formatFileDate = (date) => {
  if (!date) return "";

  const [year, month, day] = date.split("-");
  return `${day}-${month}-${year}`;
};

const sanitizeFileName = (value = "") =>
  value
    .replace(/[<>:"/\\|?*]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const PurchaseRequestDetailModal = ({
  open,
  data,
  loading = false,
  onClose,
  onAttachment,
  onPaid,
}) => {
  const [actionLoading, setActionLoading] = useState(false);
  const [actionType, setActionType] = useState(null);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  const status = STATUS_STYLE[data?.status] || STATUS_STYLE.REQUESTED;
  const priority = PRIORITY_STYLE[data?.priority] || PRIORITY_STYLE.NORMAL;

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) onClose?.();
  };

  const handleAttachment = (attachment) => {
    onAttachment?.(attachment);
  };

  const handlePaid = () => {
    onPaid?.(data);
  };

  const handleDownload = async () => {
    if (!data?.id_request) return;

    try {
      setActionLoading(true);
      setActionType("download");

      const blob = await downloadPurchaseRequestPdf(data.id_request);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `Pengajuan ${sanitizeFileName(data.pegawai?.nama_panggilan || "Tanpa Nama")} - ${sanitizeFileName(data.nama_pekerjaan || "Tanpa Pekerjaan")} ${formatFileDate(data.tanggal_request)}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Gagal mendownload PDF:", error);

      await swal.fire({
        icon: "error",
        title: "Download Gagal",
        text:
          error?.response?.data?.message || "Gagal mendownload PDF pengajuan.",
      });
    } finally {
      setActionLoading(false);
      setActionType(null);
    }
  };

  //   const handleDummyAction = async (type, message) => {
  //     if (actionLoading) return;

  //     try {
  //       setActionLoading(true);
  //       setActionType(type);

  //       await new Promise((resolve) => setTimeout(resolve, 500));

  //       await swal.fire({
  //         icon: "info",
  //         title: "Segera Hadir",
  //         text: message,
  //         timer: 1200,
  //         showConfirmButton: false,
  //       });
  //     } finally {
  //       setActionLoading(false);
  //       setActionType(null);
  //     }
  //   };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onMouseDown={handleBackdropClick}
    >
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-modal">
        {/* Header */}

        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold text-secondary">
                Detail Pengajuan
              </h2>
              <span
                className={`rounded-full px-3 py-1 text-[9px] font-semibold uppercase tracking-wider ${status.className}`}
              >
                {status.label}
              </span>
            </div>

            <p className="mt-1 text-xs text-muted">
              {data?.request_number || "-"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              disabled={actionLoading}
              className="flex h-9 items-center gap-2 rounded-lg border border-border bg-secondary px-3 text-[10px] font-black uppercase tracking-wider text-card transition-all hover:bg-secondary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {actionLoading && actionType === "download" ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-card border-t-transparent" />
              ) : (
                <MdDownload size={16} />
              )}
              Download
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface text-muted transition hover:bg-primary/10 hover:text-secondary"
            >
              <X size={19} />
            </button>
          </div>
        </div>

        {/* Content */}

        <div className="overflow-y-auto">
          {loading ? (
            <div className="flex h-96 items-center justify-center">
              <Loading.Data text="Memuat detail pengajuan..." />
            </div>
          ) : !data ? (
            <div className="flex h-96 flex-col items-center justify-center text-center">
              <FileText size={32} className="text-muted" />
              <p className="mt-3 text-sm font-semibold text-secondary">
                Data tidak ditemukan
              </p>
            </div>
          ) : (
            <div className="space-y-5 px-5 py-5">
              {/* Pekerjaan */}

              <section className="rounded-xl border border-border bg-surface p-4">
                <div className="mb-3 flex items-center gap-2">
                  <FileText size={19} className="text-primary" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary">
                    Pekerjaan
                  </h3>
                </div>

                <p className="text-sm font-semibold text-text">
                  {data.nama_pekerjaan || "-"}
                </p>

                {data.note && (
                  <p className="mt-2 text-xs leading-5 text-muted">
                    {data.note}
                  </p>
                )}
              </section>

              {/* Request Information */}

              <div className="grid gap-3 md:grid-cols-3">
                <DetailInfo
                  icon={User}
                  label="Pemohon"
                  value={data.pegawai?.nama_lengkap || data.nama_pegawai || "-"}
                />

                <DetailInfo
                  icon={Landmark}
                  label="Departemen"
                  value={
                    data.departemen?.nama_departemen ||
                    data.nama_departemen ||
                    "-"
                  }
                />

                <DetailInfo
                  icon={CalendarDays}
                  label="Tanggal"
                  value={formatDate(data.tanggal_request)}
                />
              </div>

              {/* Priority & Total */}

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-border bg-surface p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                        Priority
                      </p>
                      <span
                        className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${priority.className}`}
                      >
                        <Flag size={14} />
                        {priority.label}
                      </span>
                    </div>

                    <Flag size={28} className="text-primary" />
                  </div>
                </div>

                <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                        Total Pengajuan
                      </p>
                      <p className="mt-2 text-xl font-bold text-secondary">
                        <CurrencyText value={data.total_amount} />
                      </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
                      <span className="text-sm font-bold">Rp</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detail Items */}

              <section>
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary">
                      Detail Item
                    </h3>
                    <p className="mt-1 text-[11px] text-muted">
                      Daftar kebutuhan yang diajukan.
                    </p>
                  </div>

                  <span className="rounded-md bg-primary/10 px-2 py-1 text-[10px] font-semibold text-secondary">
                    {data.items?.length || 0} Item
                  </span>
                </div>

                <div className="overflow-hidden rounded-xl border border-border">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                      <thead className="bg-surface">
                        <tr className="border-b border-border">
                          <th className="w-12 px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-muted">
                            No
                          </th>
                          <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted">
                            Keterangan
                          </th>
                          <th className="w-24 px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-muted">
                            Unit
                          </th>
                          <th className="w-32 px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-muted">
                            Harga
                          </th>
                          <th className="w-20 px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-muted">
                            Jumlah
                          </th>
                          <th className="w-36 px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-muted">
                            Total
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-border">
                        {data.items?.map((item, index) => (
                          <tr
                            key={item.id_item || index}
                            className="transition hover:bg-primary/5"
                          >
                            <td className="px-4 py-3 text-center text-xs text-muted">
                              {item.item_no || index + 1}
                            </td>
                            <td className="px-4 py-3 text-xs font-medium text-text">
                              {item.keterangan || "-"}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="rounded-md bg-surface px-2 py-1 text-[9px] font-semibold uppercase text-muted">
                                {item.unit || "-"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right text-xs text-muted">
                              <CurrencyText value={item.harga_satuan} />
                            </td>
                            <td className="px-4 py-3 text-center text-xs font-semibold text-text">
                              {item.jumlah || 0}
                            </td>
                            <td className="px-4 py-3 text-right text-xs font-bold text-secondary">
                              <CurrencyText value={item.total} />
                            </td>
                          </tr>
                        ))}
                      </tbody>

                      <tfoot>
                        <tr className="border-t border-border bg-primary/5">
                          <td
                            colSpan="5"
                            className="px-4 py-4 text-right text-[10px] font-semibold uppercase tracking-wider text-muted"
                          >
                            Total Pengajuan
                          </td>
                          <td className="px-4 py-4 text-right text-sm font-bold text-secondary">
                            <CurrencyText value={data.total_amount} />
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </section>

              {/* Payment */}

              {data.payment && (
                <section className="rounded-xl border border-border bg-surface p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <MessageSquare size={19} className="text-primary" />
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary">
                      Pembayaran
                    </h3>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <DetailField
                      label="Deskripsi"
                      value={data.payment.description}
                    />
                    <DetailField label="Bank" value={data.payment.bank} />
                    <DetailField
                      label="No. Rekening"
                      value={data.payment.account_number}
                    />
                    <DetailField
                      label="Nama Rekening"
                      value={data.payment.account_name}
                    />
                  </div>
                </section>
              )}

              {/* Attachment */}

              {data.attachment?.path && (
                <section>
                  <div className="mb-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary">
                      Attachment
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAttachment(data.attachment)}
                    className="group flex w-full items-center gap-4 rounded-xl border border-border bg-surface p-4 text-left transition hover:border-primary/40 hover:bg-primary/5"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white">
                      <Image size={22} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                        Lampiran
                      </p>
                      <p className="mt-1 truncate text-xs font-semibold text-text">
                        {data.attachment.name || "Attachment"}
                      </p>
                      <p className="mt-1 text-[10px] text-muted">
                        Klik untuk melihat lampiran
                      </p>
                    </div>
                  </button>
                </section>
              )}

              {/* History */}

              {data.history?.length > 0 && (
                <StatusHistory data={data} onAttachment={handleAttachment} />
              )}

              {/* Meta */}

              <div className="flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-4">
                <DetailField
                  label="Dibuat"
                  value={formatDateTime(data.created_at)}
                />
                <DetailField
                  label="Diperbarui"
                  value={formatDateTime(data.updated_at)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}

        {!loading && data && (
          <div className="flexshrink-0 border-t border-border bg-card px-5 py-4">
            <div className="flex flex-col gap-3">
              <p className="text-[10px] text-muted">
                Tandai PAID hanya bisa dilakukan untuk pengajuan dengan status
                APPROVED
              </p>

              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                {data?.status === "APPROVED" && (
                  <button
                    type="button"
                    onClick={handlePaid}
                    disabled={actionLoading}
                    className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <CheckCircle2 size={16} />
                    {actionLoading ? "Memproses..." : "Tandai Paid"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DetailInfo = ({ icon: Icon, label, value }) => (
  <div className="rounded-xl border border-border bg-surface p-4">
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon size={18} />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
          {label}
        </p>
        <p className="mt-1 truncate text-xs font-semibold text-text">
          {value || "-"}
        </p>
      </div>
    </div>
  </div>
);

const DetailField = ({ label, value }) => (
  <div>
    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
      {label}
    </p>
    <p className="mt-1 text-xs font-medium text-text">{value || "-"}</p>
  </div>
);

const StatusHistory = ({ data, onAttachment }) => {
  const normalStatuses = ["REQUESTED", "REVIEWED", "APPROVED", "PAID"];
  const rejectedStatuses = ["REQUESTED", "REVIEWED", "REJECTED"];

  const historyStatuses =
    data.status === "REJECTED" ? rejectedStatuses : normalStatuses;

  const historyMap = Object.fromEntries(
    (data.history || []).map((item) => [item.status, item]),
  );

  const lastStatusIndex = historyStatuses.findIndex(
    (status) => status === data.status,
  );

  return (
    <section>
      <div className="mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary">
          Riwayat Pengajuan
        </h3>

        <p className="mt-1 text-[11px] text-muted">
          Perjalanan status pengajuan dari awal hingga status terakhir.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-surface p-5">
        <div className="min-w-[620px]">
          <div className="relative flex">
            <div className="absolute left-[10%] right-[10%] top-5 h-px bg-border">
              <div
                className="h-full bg-primary transition-all"
                style={{
                  width:
                    lastStatusIndex <= 0
                      ? "0%"
                      : `${(lastStatusIndex / (historyStatuses.length - 1)) * 100}%`,
                }}
              />
            </div>

            {historyStatuses.map((status, index) => {
              const history = historyMap[status];

              const statusStyle =
                STATUS_STYLE[status] || STATUS_STYLE.REQUESTED;

              const isPassed = index <= lastStatusIndex;
              const isPaid = status === "PAID";

              return (
                <div
                  key={status}
                  className="relative z-10 flex min-w-0 flex-1 flex-col items-center"
                >
                  {/* Status Icon */}
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-4 border-surface ${
                      isPassed
                        ? "bg-primary text-white"
                        : "bg-card text-muted border-border"
                    }`}
                  >
                    {isPassed ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      <Circle size={15} />
                    )}
                  </div>

                  {/* Status */}
                  <span
                    className={`mt-3 rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider ${
                      isPassed ? statusStyle.className : "bg-card text-muted"
                    }`}
                  >
                    {statusStyle.label}
                  </span>

                  {/* History */}
                  {history ? (
                    <>
                      <p className="mt-2 max-w-[130px] truncate text-center text-[10px] font-semibold text-text">
                        {history.nama_pegawai || "-"}
                      </p>

                      <p className="mt-1 text-center text-[9px] text-muted">
                        {formatDateTime(history.created_at)}
                      </p>

                      {history.note && (
                        <p className="mt-2 line-clamp-2 max-w-[130px] text-center text-[9px] leading-4 text-muted">
                          {history.note}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="mt-2 text-center text-[9px] italic text-muted">
                      Belum dilakukan
                    </p>
                  )}

                  {/* Bukti Bayar */}
                  {isPaid && (
                    <div className="mt-3 flex flex-col items-center">
                      {data.payment?.bukti_bayar ? (
                        <button
                          type="button"
                          onClick={() =>
                            onAttachment?.({
                              name: "bukti_pembayaran.jpg",
                              path: data.payment.bukti_bayar,
                            })
                          }
                          className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-[9px] font-black uppercase tracking-wider text-white transition-all hover:opacity-90"
                        >
                          <FileImage size={13} />
                          Lihat Bukti
                        </button>
                      ) : (
                        <span className="text-center text-[9px] italic text-muted">
                          Bukti Bayar Tidak Tersedia
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PurchaseRequestDetailModal;
