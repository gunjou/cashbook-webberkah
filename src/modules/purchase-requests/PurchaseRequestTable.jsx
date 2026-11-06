import { ArrowDown, ArrowUp, CheckCircle2, Flag } from "lucide-react";
import CurrencyText from "../../components/CurrencyText";
import Loading from "../../components/Loading";
import { PRIORITY_STYLE, STATUS_STYLE } from "../../utils/status";

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
  viewMode,
  startIndex = 0,
  enableSort = true,
  selectedIds = [],
  onToggleSelect,
  onToggleSelectAll,
}) => {
  const selectedSet = new Set(selectedIds);
  const allSelected =
    data.length > 0 && data.every((item) => selectedSet.has(item.id_request));
  const someSelected =
    !allSelected && data.some((item) => selectedSet.has(item.id_request));

  if (loading) {
    return (
      <div className="overflow-hidden panel-glass rounded-card">
        <div className="flex h-64 items-center justify-center">
          <Loading.Data text="Memuat pengajuan..." />
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="panel-glass rounded-card">
        <div className="flex h-64 flex-col items-center justify-center px-5 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Flag size={22} className="text-primary" />
          </div>
          <p className="text-sm font-semibold text-primary-strong">
            Tidak Ada Data
          </p>
          <p className="mt-1 text-xs text-neutral-600">
            Belum terdapat data pengajuan pada filter yang dipilih.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden panel-glass rounded-card">
      <div
        className={`w-full min-w-0 max-w-full overflow-x-auto overflow-y-auto ${
          viewMode === "HISTORY"
            ? "max-h-[calc(100vh-350px)]"
            : "max-h-[calc(100vh-300px)]"
        }`}
      >
        <table className="w-max min-w-[1100px] md:w-full md:min-w-0">
          <thead className="sticky top-0 z-20">
            <tr className="border-b border-primary-200 bg-white">
              <th className="w-10 px-3 py-2 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={() => onToggleSelectAll?.(!allSelected)}
                  className="h-4 w-4 cursor-pointer accent-primary"
                  title="Pilih semua"
                />
              </th>

              <th className="w-12 px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-wider text-neutral-600">
                No
              </th>

              <th className="w-44 px-4 py-2 text-left">
                {enableSort && (
                  <button
                    type="button"
                    onClick={() => onSort?.("date")}
                    className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-600 transition hover:text-primary-strong"
                  >
                    Pengajuan
                    {sortConfig?.key === "date" &&
                      (sortConfig.direction === "asc" ? (
                        <ArrowUp size={13} />
                      ) : (
                        <ArrowDown size={13} />
                      ))}
                  </button>
                )}

                {!enableSort && (
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-600">
                    Pengajuan
                  </span>
                )}
              </th>

              <th className="w-44 px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-600">
                Pemohon
              </th>

              <th className="min-w-[280px] px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-600">
                Pekerjaan
              </th>

              <th className="px-4 py-2 text-center">
                {enableSort ? (
                  <button
                    type="button"
                    onClick={() => onSort?.("priority")}
                    className="mx-auto flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-600 transition hover:text-primary-strong"
                  >
                    Priority
                    {sortConfig?.key === "priority" &&
                      (sortConfig.direction === "asc" ? (
                        <ArrowUp size={13} />
                      ) : (
                        <ArrowDown size={13} />
                      ))}
                  </button>
                ) : (
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-600">
                    Priority
                  </span>
                )}
              </th>

              <th className="w-36 px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wider text-neutral-600">
                Total
              </th>

              <th className="w-32 px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-wider text-neutral-600">
                Status
              </th>

              <th className="w-24 px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-wider text-neutral-600">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-primary-200">
            {data.map((item, index) => {
              const status = STATUS_STYLE[item.status] || STATUS_STYLE.ACTIVE;

              const priority =
                PRIORITY_STYLE[item.priority] || PRIORITY_STYLE.NORMAL;

              const isSelected = selectedSet.has(item.id_request);

              return (
                <tr
                  key={item.id_request}
                  className={`group transition hover:bg-primary/5 ${isSelected ? "bg-primary/5" : ""}`}
                >
                  <td className="px-3 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect?.(item.id_request)}
                      className="h-4 w-4 cursor-pointer accent-primary"
                    />
                  </td>

                  <td
                    onClick={() => onDetail?.(item.id_request)}
                    className="cursor-pointer px-1 py-2 text-center"
                  >
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[11px] font-semibold text-neutral-600">
                      {String(startIndex + index + 1).padStart(2, "0")}
                    </span>
                  </td>

                  <td
                    onClick={() => onDetail?.(item.id_request)}
                    className="cursor-pointer px-2 py-2"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-medium text-neutral-600 whitespace-nowrap">
                        {item.request_number || "-"}
                      </span>

                      <span className="text-xs font-semibold text-primary-strong whitespace-nowrap">
                        {formatDate(item.tanggal_request)}
                      </span>
                    </div>
                  </td>

                  <td
                    onClick={() => onDetail?.(item.id_request)}
                    className="cursor-pointer px-2 py-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary">
                        <span className="text-xs font-bold text-[var(--brand-on)]">
                          {getInitials(item.nama_pegawai)}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-ink">
                          {item.nama_panggilan || "-"}
                        </p>

                        <span className="mt-1 inline-block rounded-md bg-primary/10 px-2 py-1 text-[11px] font-medium text-primary-strong">
                          {item.nama_departemen || "-"}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td
                    onClick={() => onDetail?.(item.id_request)}
                    className="cursor-pointer px-4 py-2"
                  >
                    <div className="max-w-[480px]">
                      <p className="text-xs line-clamp-2 font-semibold leading-5 text-ink">
                        {item.note || item.nama_pekerjaan || "-"}
                      </p>

                      {item.note && item.nama_pekerjaan && (
                        <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-neutral-600">
                          {item.nama_pekerjaan}
                        </p>
                      )}
                    </div>
                  </td>

                  <td
                    onClick={() => onDetail?.(item.id_request)}
                    className="cursor-pointer px-4 py-2 text-center"
                  >
                    <span
                      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${priority.className}`}
                    >
                      <Flag size={13} />
                      {priority.label}
                    </span>
                  </td>

                  <td
                    onClick={() => onDetail?.(item.id_request)}
                    className="cursor-pointer px-4 py-2 text-right"
                  >
                    <span className="whitespace-nowrap text-sm font-bold text-primary-strong">
                      <CurrencyText value={item.total_amount} />
                    </span>
                  </td>

                  <td
                    onClick={() => onDetail?.(item.id_request)}
                    className="cursor-pointer px-4 py-2 text-center"
                  >
                    <span
                      className={`inline-flex min-w-[80px] justify-center rounded-full px-3 py-1.5 text-xs font-semibold ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </td>

                  <td className="px-4 py-2 text-center">
                    {item.status === "APPROVED" && (
                      <button
                        type="button"
                        onClick={() => onPaid(item)}
                        className="ios-button"
                        title="Tandai Bayar"
                      >
                        <CheckCircle2
                          size={16}
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                        Bayar
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
