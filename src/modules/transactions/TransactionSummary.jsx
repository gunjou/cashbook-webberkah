import {
  ArrowDownCircle,
  ArrowUpCircle,
  ReceiptText,
  Wallet,
} from "lucide-react";

import CurrencyText from "../../components/CurrencyText";

const TransactionSummary = ({ summary, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 p-3 font-mono lg:grid-cols-4 panel-glass rounded-card">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="flex animate-pulse items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-neutral-200" />

            <div className="flex-1">
              <div className="h-3 w-20 rounded bg-neutral-200" />

              <div className="mt-2 h-4 w-28 rounded bg-neutral-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 p-3 font-mono lg:grid-cols-4 panel-glass rounded-card">
      {/* Income */}

      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-green-500/10 p-2">
          <ArrowDownCircle size={22} className="text-green-600" />
        </div>

        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wide text-neutral-600">
            Pemasukan
          </p>

          <p className="truncate text-sm font-bold text-green-600">
            <CurrencyText value={summary.total_income} />
          </p>
        </div>
      </div>

      {/* Expense */}

      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-red-500/10 p-2">
          <ArrowUpCircle size={22} className="text-red-600" />
        </div>

        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wide text-neutral-600">
            Pengeluaran
          </p>

          <p className="truncate text-sm font-bold text-red-600">
            <CurrencyText value={summary.total_outcome} />
          </p>
        </div>
      </div>

      {/* Cashflow */}

      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2">
          <Wallet size={22} className="text-primary" />
        </div>

        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wide text-neutral-600">
            Cashflow
          </p>

          <p
            className={`truncate text-sm font-bold ${
              summary.cashflow >= 0 ? "text-primary" : "text-red-600"
            }`}
          >
            <CurrencyText value={summary.cashflow} />
          </p>
        </div>
      </div>

      {/* Transaction */}

      <div className="flex items-center gap-3">
        <div className="rounded-full bg-primary-strong/10 p-2">
          <ReceiptText size={22} className="text-primary-strong" />
        </div>

        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wide text-neutral-600">
            Transaksi
          </p>

          <p className="text-sm font-bold text-primary-strong">
            {summary.transaction_count}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionSummary;
