import { Building2, CalendarDays, RefreshCcw } from "lucide-react";

const PurchaseRequestFilter = ({
  filter,
  setFilter,
  departments,
  onReset,
  viewMode,
}) => {
  const statusTabs =
    viewMode === "ACTIVE"
      ? [
          { value: "APPROVED", label: "Approved" },
          { value: "REVIEWED", label: "Reviewed" },
          { value: "REQUESTED", label: "Requested" },
          { value: "ACTIVE", label: "All" },
        ]
      : [
          { value: "PAID", label: "Paid" },
          { value: "REJECTED", label: "Rejected" },
        ];

  return (
    <div className="rounded-xl border border-border bg-card p-3 shadow-card">
      <div className="flex flex-col gap-2 lg:flex-row">
        <div className="flex w-full max-w-full flex-wrap items-center gap-1 rounded-xl border border-border bg-surface p-1 lg:w-auto lg:shrink-0">
          {statusTabs.map((tab) => {
            const isActive = filter.status === tab.value;

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() =>
                  setFilter((prev) => ({ ...prev, status: tab.value }))
                }
                className={`h-9 min-w-24 rounded-lg px-3 text-[10px] font-semibold uppercase tracking-wider transition ${isActive ? "bg-primary text-white shadow-sm" : "text-muted hover:bg-primary/10"}`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <Building2
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <select
              value={filter.id_departemen}
              onChange={(e) =>
                setFilter((prev) => ({
                  ...prev,
                  id_departemen: e.target.value,
                }))
              }
              className="w-full appearance-none rounded-lg border border-border bg-surface py-2.5 pl-9 pr-3 text-sm text-text outline-none transition focus:border-primary"
            >
              <option value="">Semua Departemen</option>
              {departments
                .filter((item) => item.status === 1)
                .map((item) => (
                  <option key={item.id_departemen} value={item.id_departemen}>
                    {item.nama_departemen}
                  </option>
                ))}
            </select>
          </div>

          <div className="relative min-w-0 flex-1">
            <CalendarDays
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="date"
              value={filter.tanggal_mulai}
              onChange={(e) =>
                setFilter((prev) => ({
                  ...prev,
                  tanggal_mulai: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-border bg-surface py-2.5 pl-9 pr-3 text-sm text-text outline-none transition focus:border-primary"
            />
          </div>

          <div className="relative min-w-0 flex-1">
            <CalendarDays
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="date"
              value={filter.tanggal_selesai}
              onChange={(e) =>
                setFilter((prev) => ({
                  ...prev,
                  tanggal_selesai: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-border bg-surface py-2.5 pl-9 pr-3 text-sm text-text outline-none transition focus:border-primary"
            />
          </div>

          <button
            type="button"
            onClick={onReset}
            className="flex h-[42px] shrink-0 items-center justify-center gap-2 rounded-lg bg-secondary px-4 text-sm font-medium text-white transition hover:opacity-90"
          >
            <RefreshCcw size={16} />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseRequestFilter;
