import { ArrowDownLeft, ArrowUpRight, Landmark, Wallet } from "lucide-react";

import CurrencyText from "../../components/CurrencyText";

const DashboardSummary = ({ summary, loading }) => {
  const cards = [
    {
      title: "Current Balance",
      subtitle: "Saldo seluruh account",
      value: summary.current_balance,
      icon: Wallet,
      iconClass: "bg-gray-200 text-secondary",
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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-xl border border-border bg-card p-4 shadow-card"
          >
            {loading ? (
              <div className="animate-pulse">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Title */}
                    <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700" />
                    {/* Amount */}
                    <div className="mt-4 h-6 w-36 rounded bg-gray-200 dark:bg-gray-700" />
                    {/* Subtitle */}
                    <div className="mt-3 h-3 w-28 rounded bg-gray-200 dark:bg-gray-700" />
                  </div>
                  {/* Icon */}
                  <div className="ml-3 h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between transition hover:-translate-y-0.5">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted">
                    {card.title}
                  </p>

                  <div
                    className={`mt-2 text-2xl font-bold ${
                      card.value < 0 ? "text-red-400" : "text-secondary"
                    }`}
                  >
                    <CurrencyText value={card.value} />
                  </div>

                  <p className="mt-1 text-xs text-muted">{card.subtitle}</p>
                </div>

                <div
                  className={`ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${card.iconClass}`}
                >
                  <Icon size={20} />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DashboardSummary;
