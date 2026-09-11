import { ArrowDown, ArrowUp, CheckCircle2, Flag } from "lucide-react";
import CurrencyText from "../../components/CurrencyText";
import Loading from "../../components/Loading";

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
  ACTIVE: { label: "Aktif", className: "bg-primary/10 text-secondary" },
};

const PRIORITY_STYLE = {
  NORMAL: { label: "Normal", className: "bg-surface text-muted" },
  URGENT: { label: "Urgent", className: "bg-yellow-500/10 text-yellow-600" },
  TOP_URGENT: { label: "Top Urgent", className: "bg-red-500/10 text-red-600" },
};

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

const formatDate = (value) => {
  if (!value) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
};

const PurchaseRequestTable = ({
  data,
  loading,
  sortConfig,
  onSort,
  onDetail,
  onPaid,
}) => {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <div className="flex h-64 items-center justify-center">
          <Loading.Data text="Memuat pengajuan..." />
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="rounded-xl border border-border bg-card shadow-card">
        <div className="flex h-64 flex-col items-center justify-center px-5 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Flag size={22} className="text-primary" />
          </div>
          <p className="text-sm font-semibold text-secondary">Tidak Ada Data</p>
          <p className="mt-1 text-xs text-muted">
            Belum terdapat data pengajuan pada filter yang dipilih.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
      <div className="max-h-[calc(100vh-320px)] overflow-auto">
        <table className="w-full min-w-[1100px]">
          <thead className="sticky top-0 z-20">
            <tr className="border-b border-border bg-surface">
              <th className="w-12 px-4 py-4 text-center text-[10px] font-semibold uppercase tracking-wider text-muted">
                No
              </th>
              <th className="w-44 px-4 py-4 text-left">
                <button
                  type="button"
                  onClick={() => onSort?.("date")}
                  className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted transition hover:text-secondary"
                >
                  Pengajuan
                  {sortConfig?.key === "date" &&
                    (sortConfig.direction === "asc" ? (
                      <ArrowUp size={13} />
                    ) : (
                      <ArrowDown size={13} />
                    ))}
                </button>
              </th>
              <th className="w-44 px-4 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-muted">
                Pemohon
              </th>
              <th className="min-w-[280px] px-4 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-muted">
                Pekerjaan
              </th>
              <th className="w-32 px-4 py-4 text-center">
                <button
                  type="button"
                  onClick={() => onSort?.("priority")}
                  className="mx-auto flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted transition hover:text-secondary"
                >
                  Priority
                  {sortConfig?.key === "priority" &&
                    (sortConfig.direction === "asc" ? (
                      <ArrowUp size={13} />
                    ) : (
                      <ArrowDown size={13} />
                    ))}
                </button>
              </th>
              <th className="w-36 px-4 py-4 text-right text-[10px] font-semibold uppercase tracking-wider text-muted">
                Total
              </th>
              <th className="w-32 px-4 py-4 text-center text-[10px] font-semibold uppercase tracking-wider text-muted">
                Status
              </th>
              <th className="w-24 px-4 py-4 text-center text-[10px] font-semibold uppercase tracking-wider text-muted">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {data.map((item, index) => {
              const status = STATUS_STYLE[item.status] || STATUS_STYLE.ACTIVE;
              const priority =
                PRIORITY_STYLE[item.priority] || PRIORITY_STYLE.NORMAL;

              return (
                <tr
                  key={item.id_request}
                  className="group transition hover:bg-primary/5"
                >
                  <td
                    onClick={() => onDetail?.(item.id_request)}
                    className="cursor-pointer px-4 py-4 text-center"
                  >
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-surface text-[10px] font-semibold text-muted">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </td>

                  <td
                    onClick={() => onDetail?.(item.id_request)}
                    className="cursor-pointer px-4 py-4"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-medium text-muted">
                        {item.request_number || "-"}
                      </span>
                      <span className="text-xs font-semibold text-secondary">
                        {formatDate(item.tanggal_request)}
                      </span>
                    </div>
                  </td>

                  <td
                    onClick={() => onDetail?.(item.id_request)}
                    className="cursor-pointer px-4 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary">
                        <span className="text-xs font-bold text-white">
                          {getInitials(item.nama_pegawai)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-text">
                          {item.nama_panggilan || "-"}
                        </p>
                        <span className="mt-1 inline-block rounded-md bg-primary/10 px-2 py-1 text-[9px] font-medium text-secondary">
                          {item.nama_departemen || "-"}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td
                    onClick={() => onDetail?.(item.id_request)}
                    className="cursor-pointer px-4 py-4"
                  >
                    <div className="max-w-[480px]">
                      <p className="text-xs font-semibold leading-5 text-text">
                        {item.nama_pekerjaan || "-"}
                      </p>
                      {item.note && (
                        <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-muted">
                          {item.note}
                        </p>
                      )}
                    </div>
                  </td>

                  <td
                    onClick={() => onDetail?.(item.id_request)}
                    className="cursor-pointer px-4 py-4 text-center"
                  >
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[9px] uppercase font-bold whitespace-nowrap ${priority.className}`}
                    >
                      <Flag size={13} />
                      {priority.label}
                    </span>
                  </td>

                  <td
                    onClick={() => onDetail?.(item.id_request)}
                    className="cursor-pointer px-4 py-4 text-right"
                  >
                    <span className="whitespace-nowrap text-sm font-bold text-secondary">
                      <CurrencyText value={item.total_amount} />
                    </span>
                  </td>

                  <td
                    onClick={() => onDetail?.(item.id_request)}
                    className="cursor-pointer px-4 py-4 text-center"
                  >
                    <span
                      className={`inline-flex min-w-[80px] justify-center rounded-full px-3 py-1.5 text-[9px] font-semibold uppercase tracking-wide ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-center">
                    {/* <button
                      type="button"
                      onClick={() => onDetail?.(item.id_request)}
                      title="Detail"
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-secondary transition hover:bg-primary hover:text-white"
                    >
                      <Eye size={16} />
                    </button> */}

                    {item.status === "APPROVED" && (
                      <button
                        type="button"
                        onClick={() => onPaid(item)}
                        className="flex py-1.5 px-2.5 items-center justify-center rounded-lg text-white bg-secondary transition-all hover:bg-secondary-hover"
                        title="Tandai Bayar"
                      >
                        <div className="flex gap-1">
                          <CheckCircle2 size={16} />
                          <span className="text-[11px]">BAYAR</span>
                        </div>
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseRequestTable;
