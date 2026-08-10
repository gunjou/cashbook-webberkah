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
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />

        <select
          value={period}
          onChange={(e) => onPeriodChange?.(e.target.value)}
          className="min-w-[180px] appearance-none rounded-xl border border-border bg-card py-2.5 pl-10 pr-8 text-sm outline-none transition focus:border-primary"
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
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />

        <select
          value={account}
          onChange={(e) => onAccountChange?.(e.target.value)}
          className="min-w-[220px] appearance-none rounded-xl border border-border bg-card py-2.5 pl-10 pr-8 text-sm outline-none transition focus:border-primary"
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
        className="flex h-[42px] w-[42px] items-center justify-center rounded-xl border border-border bg-card transition hover:bg-primary hover:text-white"
      >
        <RefreshCw size={18} />
      </button>
    </div>
  );
};

export default DashboardToolbar;
