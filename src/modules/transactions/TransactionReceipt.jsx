import CurrencyText from "../../components/CurrencyText";

import TransactionItem from "./TransactionItem";

const TransactionReceipt = ({
  receipt,
  showDate = false,
  onViewAttachment,
  onViewDetail,
  onEditTransaction,
}) => {
  const account = receipt.account;
  const transactions = receipt.transactions;

  return (
    <section className="overflow-hidden border border-neutral-300 bg-white shadow-sm">
      {/* ==========================
          Receipt Header
      ========================== */}

      <div className="border-b border-dashed border-neutral-300 px-5 py-4 font-mono">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500">
              ACCOUNT
            </p>

            <h2 className="mt-1 text-xl sm:text-lg font-bold uppercase tracking-wide text-gray-900">
              {account.account_name}
            </h2>
          </div>

          <div className="text-right">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500">
              SALDO AWAL
            </p>

            <p className="mt-1 font-mono text-lg font-bold text-gray-900">
              <CurrencyText value={receipt.starting_balance} />
            </p>
          </div>
        </div>
      </div>

      {/* ==========================
          Transaction List
      ========================== */}

      <div className="divide-y divide-dashed divide-neutral-300">
        {transactions.length === 0 ? (
          <div className="px-5 py-10 text-center font-mono text-sm text-gray-500">
            Tidak ada transaksi.
          </div>
        ) : (
          transactions.map((transaction) => (
            <TransactionItem
              key={transaction.id_transaction}
              transaction={transaction}
              showDate={showDate}
              onViewAttachment={onViewAttachment}
              onViewDetail={onViewDetail}
              onEditTransaction={onEditTransaction}
            />
          ))
        )}
      </div>

      {/* ==========================
          Receipt Footer
      ========================== */}

      <div className="border-t border-dashed border-neutral-300 px-5 py-4 font-mono">
        <div className="space-y-1 text-sm">
          <div className="flex items-center justify-between">
            <span className="uppercase tracking-wide text-gray-500">
              Total Masuk
            </span>

            <span className="font-mono font-semibold text-green-700">
              <CurrencyText value={receipt.total_income} />
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="uppercase tracking-wide text-gray-500">
              Total Keluar
            </span>

            <span className="font-mono font-semibold text-red-700">
              <CurrencyText value={receipt.total_expense} />
            </span>
          </div>

          <div className="my-2 border-t border-dashed border-neutral-300" />

          <div className="flex items-center justify-between">
            <span className="text-base font-bold uppercase tracking-wide text-gray-900">
              Saldo Akhir
            </span>

            <span className="font-mono text-xl font-bold text-gray-900">
              <CurrencyText value={receipt.ending_balance} />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransactionReceipt;
