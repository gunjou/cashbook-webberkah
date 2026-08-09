import { useEffect, useState } from "react";

import { CalendarDays, FolderOpen, Info, Tag, User, X } from "lucide-react";

import CurrencyText from "../../components/CurrencyText";
import Loading from "../../components/Loading";

import { detailDate, formatPeriod } from "../../utils/date";

import { getTransactionDetail } from "./transaction.service";

const TransactionDetailModal = ({
  open,
  transactionId,
  onClose,
  onViewAttachment,
  onEditTransaction,
}) => {
  const [loading, setLoading] = useState(false);

  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    if (!open || !transactionId) return;

    loadTransaction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, transactionId]);

  useEffect(() => {
    if (!open) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [open, onClose]);

  const loadTransaction = async () => {
    try {
      setLoading(true);

      const data = await getTransactionDetail(transactionId);

      setTransaction(data);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const isIncome = transaction?.transaction_type === "IN";
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-modal"
      >
        {/* Header */}

        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-secondary">
              Detail Transaksi
            </h2>

            <p className="mt-1 text-sm text-muted">
              Informasi lengkap transaksi
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-surface"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}

        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <Loading.Data text="Memuat detail transaksi..." />
          ) : (
            transaction && (
              <>
                {/* Nominal */}

                <div className="mb-8 text-center">
                  <p className="text-sm uppercase tracking-[0.25em] text-muted">
                    {transaction.transaction_type === "IN"
                      ? "PEMASUKAN"
                      : "PENGELUARAN"}
                  </p>

                  <h1
                    className={`mt-2 text-4xl font-bold ${
                      isIncome ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isIncome ? "+" : "-"}
                    <CurrencyText value={transaction.amount} />
                  </h1>

                  <p className="mt-3 text-lg font-medium text-text">
                    {transaction.transaction_description}
                  </p>
                </div>

                {/* Detail */}

                <div className="grid gap-6 md:grid-cols-2">
                  <InfoItem
                    icon={<FolderOpen size={18} />}
                    label="Account"
                    value={transaction.account.account_name}
                    subValue={transaction.account.bank_name}
                  />

                  <InfoItem
                    icon={<Tag size={18} />}
                    label="Kategori"
                    value={transaction.category.category_name}
                  />

                  <InfoItem
                    icon={<CalendarDays size={18} />}
                    label="Tanggal"
                    value={formatPeriod(transaction.transaction_date)}
                  />

                  <InfoItem
                    icon={<Info size={18} />}
                    label="Reference Number"
                    value={transaction.reference_number ?? "-"}
                  />

                  <InfoItem
                    icon={<User size={18} />}
                    label="Dibuat Oleh"
                    value={transaction.created_by}
                    subValue={detailDate(transaction.created_at)}
                  />

                  <InfoItem
                    icon={<User size={18} />}
                    label="Updated By"
                    value={transaction.updated_by ?? "-"}
                    subValue={detailDate(transaction.updated_at)}
                  />
                </div>
              </>
            )
          )}
        </div>

        {/* Footer */}

        {!loading && transaction && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-6 py-4">
            <button
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 transition hover:bg-surface"
            >
              Tutup
            </button>

            <div className="flex gap-3">
              {transaction.attachment_url && (
                <button
                  onClick={() => onViewAttachment?.(transaction)}
                  className="rounded-lg border border-border px-4 py-2 transition hover:bg-surface"
                >
                  Lihat Bukti
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  onClose?.();
                  onEditTransaction?.(transaction.id_transaction);
                }}
                className="rounded-lg bg-primary px-4 py-2 text-white transition hover:opacity-90"
              >
                Edit Transaksi
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value, subValue }) => (
  <div className="flex gap-3">
    {icon && <div className="mt-1 text-primary">{icon}</div>}

    <div>
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>

      <p className="mt-1 font-medium text-text">{value}</p>

      {subValue && <p className="mt-1 text-sm text-muted">{subValue}</p>}
    </div>
  </div>
);

export default TransactionDetailModal;
