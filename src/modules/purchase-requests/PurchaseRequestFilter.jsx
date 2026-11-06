import { useEffect, useState } from "react";
import { CalendarDays, RefreshCcw, Search } from "lucide-react";

const PurchaseRequestFilter = ({
  filter,
  setFilter,
  onReset,
  viewMode,
}) => {
  const [searchInput, setSearchInput] = useState(filter.search || "");

  // Sinkron saat filter di-reset / ganti mode
  useEffect(() => {
    setSearchInput(filter.search || "");
  }, [filter.search]);

  // Debounce agar tidak request setiap ketikan
  useEffect(() => {
    const timer = setTimeout(() => {
      const value = searchInput.trim();
      setFilter((prev) =>
        (prev.search || "") === value ? prev : { ...prev, search: value },
      );
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput, setFilter]);

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
    <div className="p-3 panel-glass rounded-card">
      <div className="flex flex-col gap-2 lg:flex-row">
        <div className="flex w-full max-w-full flex-wrap items-center gap-1 p-1 lg:w-auto lg:shrink-0 rounded-2xl glass-inset">
          {statusTabs.map((tab) => {
            const isActive = filter.status === tab.value;

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() =>
                  setFilter((prev) => ({ ...prev, status: tab.value }))
                }
                className={`h-9 min-w-24 rounded-lg px-3 text-[11px] font-semibold uppercase tracking-wider transition ${isActive ? "glass-primary shadow-sm" : "text-neutral-600 hover:bg-primary/10"}`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600"
            />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Cari pemohon, pekerjaan, keterangan..."
              className="rounded-2xl bg-white/70 ring-1 ring-ink/8 focus:ring-2 focus:ring-primary-500 w-full py-2.5 pl-9 pr-3 text-sm text-ink outline-none transition"
            />
          </div>

          <div className="relative min-w-0 flex-1">
            <CalendarDays
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600"
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
              className="rounded-2xl bg-white/70 ring-1 ring-ink/8 focus:ring-2 focus:ring-primary-500 w-full py-2.5 pl-9 pr-3 text-sm text-ink outline-none transition"
            />
          </div>

          <div className="relative min-w-0 flex-1">
            <CalendarDays
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600"
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
              className="rounded-2xl bg-white/70 ring-1 ring-ink/8 focus:ring-2 focus:ring-primary-500 w-full py-2.5 pl-9 pr-3 text-sm text-ink outline-none transition"
            />
          </div>

          <button
            type="button"
            onClick={onReset}
            className="flex h-[42px] shrink-0 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium transition glass-button text-ink"
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
