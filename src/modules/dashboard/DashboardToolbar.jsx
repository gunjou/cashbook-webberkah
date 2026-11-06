import { CalendarDays, Landmark, RefreshCw } from "lucide-react";

const periods = [
  {
    value: "today",
    label: "Hari Ini",
  },
  {
    value: "week",
    label: "Minggu Ini",
  },
  {
    value: "month",
    label: "Bulan Ini",
  },
  {
    value: "year",
    label: "Tahun Ini",
  },
];

const DashboardToolbar = ({
  period,
  account,
  accounts,
  onPeriodChange,
  onAccountChange,
  onRefresh,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Period */}

      <div className="relative">
        <CalendarDays
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600"
        />

        <select
          value={period}
          onChange={(e) => onPeriodChange?.(e.target.value)}
          className="rounded-2xl bg-white/70 ring-1 ring-ink/8 focus:ring-2 focus:ring-primary-500 min-w-[180px] appearance-none py-2.5 pl-10 pr-8 text-sm outline-none transition"
        >
          {periods.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      {/* Account */}

      <div className="relative">
        <Landmark
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600"
        />

        <select
          value={account}
          onChange={(e) => onAccountChange?.(e.target.value)}
          className="rounded-2xl bg-white/70 ring-1 ring-ink/8 focus:ring-2 focus:ring-primary-500 min-w-[220px] appearance-none py-2.5 pl-10 pr-8 text-sm outline-none transition"
        >
          <option value="">Semua Account</option>

          {accounts.map((item) => (
            <option key={item.id_account} value={item.id_account}>
              {item.account_name}
            </option>
          ))}
        </select>
      </div>

      {/* Refresh */}

      <button
        onClick={onRefresh}
        className="flex h-[42px] w-[42px] items-center justify-center rounded-full transition hover:bg-primary-100 hover:text-ink glass-button"
      >
        <RefreshCw size={18} />
      </button>
    </div>
  );
};

export default DashboardToolbar;
