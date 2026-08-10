import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

import CurrencyText from "../../components/CurrencyText";
import { formatPeriod } from "../../utils/date";

const DashboardRecentTransaction = ({ transactions, loading }) => {
  if (loading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between border-b border-border pb-3 last:border-none"
          >
            <div className="flex-1">
              <div className="h-3 w-36 rounded bg-gray-200" />
              <div className="mt-2 h-2.5 w-52 rounded bg-gray-100" />
            </div>

            <div className="h-4 w-20 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    );
  }

  if (!transactions.length) {
    return (
      <div className="flex h-[220px] items-center justify-center text-sm text-muted">
        Belum ada transaksi.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((item) => {
        const isIncome = item.transaction_type === "IN";

        return (
          <div
            key={item.id_transaction}
            className="flex items-start justify-between border-b border-border pb-3 last:border-none"
          >
            <div className="flex min-w-0 flex-1 gap-2.5">
              {/* Icon */}

              <div
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  isIncome
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {isIncome ? (
                  <ArrowDownLeft size={16} />
                ) : (
                  <ArrowUpRight size={16} />
                )}
              </div>

              {/* Content */}

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p
                    className="truncate text-sm font-medium text-secondary"
                    title={item.transaction_description}
                  >
                    {item.transaction_description.length > 25
                      ? `${item.transaction_description.slice(0, 25)}...`
                      : item.transaction_description}
                  </p>

                  <div
                    className={`shrink-0 text-sm font-semibold ${
                      isIncome ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isIncome ? "+" : "-"}
                    <CurrencyText value={item.amount} />
                  </div>
                </div>

                <div className="mt-1 text-xs text-muted">
                  {/* Desktop */}
                  <p className="hidden truncate sm:block">
                    {item.category_name}
                    {" • "}
                    {item.account_name}
                    {" • "}
                    {formatPeriod(item.transaction_date)}{" "}
                    {item.created_at.slice(11, 16)}
                  </p>

                  {/* Mobile */}
                  <div className="block sm:hidden">
                    <p className="truncate">
                      {item.category_name}
                      {" • "}
                      {item.account_name}
                    </p>

                    <p className="mt-0.5">
                      {formatPeriod(item.transaction_date)}{" "}
                      {item.created_at.slice(11, 16)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardRecentTransaction;
