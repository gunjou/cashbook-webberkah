import { ArrowDownLeft, ArrowUpRight, Landmark, Wallet } from "lucide-react";

import CurrencyText from "../../components/CurrencyText";

const DashboardSummary = ({ summary, loading }) => {
  const cards = [
    {
      title: "Current Balance",
      subtitle: "Saldo seluruh account",
      value: summary.current_balance,
      icon: Wallet,
      iconClass: "bg-neutral-200 text-primary-strong",
    },
    {
      title: "Income",
      subtitle: "Total pemasukan",
      value: summary.total_income,
      icon: ArrowDownLeft,
      iconClass: "bg-green-100 text-green-600",
    },
    {
      title: "Expense",
      subtitle: "Total pengeluaran",
      value: summary.total_expense,
      icon: ArrowUpRight,
      iconClass: "bg-red-100 text-red-600",
    },
    {
      title: "Net Cashflow",
      subtitle: "Income - Expense",
      value: summary.net_cashflow,
      icon: Landmark,
      iconClass: "bg-blue-100 text-blue-600",
    },
  ];

  return (
    // Kolom mengikuti lebar konten, bukan viewport, karena sidebar ikut memakan ruang.
    <div className="[container-type:inline-size]">
      <div className="grid grid-cols-1 gap-4 [@container_(min-width:28rem)]:grid-cols-2 [@container_(min-width:60rem)]:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
  
          return (
            <div
              key={card.title}
              className="p-4 panel-glass rounded-card [container-type:inline-size]"
            >
              {loading ? (
                <div className="animate-pulse">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Title */}
                      <div className="h-3 w-24 rounded bg-neutral-200" />
                      {/* Amount */}
                      <div className="mt-4 h-6 w-full max-w-36 rounded bg-neutral-200" />
                      {/* Subtitle */}
                      <div className="mt-3 h-3 w-28 rounded bg-neutral-200" />
                    </div>
                    {/* Icon */}
                    <div className="ml-3 h-10 w-10 rounded-lg bg-neutral-200" />
                  </div>
                </div>
              ) : (
                <div className="transition hover:-translate-y-0.5">
                  <div className="flex items-start justify-between">
                    <p className="min-w-0 text-xs font-medium uppercase tracking-wide text-neutral-600">
                      {card.title}
                    </p>
  
                    <div
                      className={`ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${card.iconClass}`}
                    >
                      <Icon size={20} />
                    </div>
                  </div>
  
                  <div
                    className={`mt-2 text-[clamp(1rem,10cqi,1.5rem)] font-bold [overflow-wrap:anywhere] ${
                      card.value < 0 ? "text-red-400" : "text-primary-strong"
                    }`}
                  >
                    <CurrencyText value={card.value} />
                  </div>
  
                  <p className="mt-1 text-xs text-neutral-600">{card.subtitle}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardSummary;
