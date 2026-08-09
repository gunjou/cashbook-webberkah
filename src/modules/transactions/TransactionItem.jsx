import { useState } from "react";

import {
  ChevronDown,
  ChevronRight,
  Eye,
  Paperclip,
  Pencil,
} from "lucide-react";

import CurrencyText from "../../components/CurrencyText";

const TransactionItem = ({
  transaction,
  showDate = false,
  onViewAttachment,
  onViewDetail,
  onEditTransaction,
}) => {
  const [expanded, setExpanded] = useState(false);

  /* ==========================
      Helpers
  ========================== */
  const isIncome = transaction.transaction_type === "IN";
  const hasAttachment = Boolean(transaction.attachment_url);
  const transactionDate = new Date(transaction.transaction_date);
  const createdDate = new Date(transaction.created_at);

  const dateLabel = new Intl.DateTimeFormat("id-ID", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(transactionDate);

  const timeLabel = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(createdDate);

  const transactionLabel = showDate ? `${dateLabel} ${timeLabel}` : timeLabel;

  return (
    <>
      {/* ==========================
          Desktop Layout
      ========================== */}

      <div className="hidden sm:block">
        {/* Transaction Row */}

        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="flex w-full items-center gap-3 px-5 py-2 text-left transition hover:bg-neutral-50"
        >
          {/* Expand */}

          <div className="w-4 shrink-0 text-gray-500">
            {expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
          </div>

          {/* Time */}

          <div className="w-20 shrink-0 text-xs text-gray-600">
            {transactionLabel}
          </div>

          {/* Category */}

          <div
            className="w-28 shrink-0 truncate text-xs font-semibold uppercase tracking-wide text-gray-500"
            title={transaction.category_name}
          >
            {transaction.category_name}
          </div>

          {/* Description */}

          <div
            className="flex-1 line-clamp-2 leading-5 text-sm text-gray-900"
            title={transaction.transaction_description}
          >
            {transaction.transaction_description}
          </div>

          {/* Attachment */}

          <div className="flex w-6 shrink-0 justify-center">
            {hasAttachment && <Paperclip size={14} className="text-gray-400" />}
          </div>

          {/* Amount */}

          <div
            className={`w-36 shrink-0 text-right text-sm font-bold ${
              isIncome ? "text-green-700" : "text-red-700"
            }`}
          >
            {isIncome ? "+" : "-"}
            <CurrencyText value={transaction.amount} />
          </div>
        </button>
        {/* ==========================
            Expanded Desktop
        ========================== */}

        {expanded && (
          <div className="border-t border-dashed border-neutral-300 bg-neutral-50 px-9 py-4">
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Reference */}

              <div>
                <p className="text-[11px] uppercase tracking-widest text-gray-500">
                  Reference Number
                </p>

                <p className="mt-1 text-sm text-gray-900">
                  {transaction.reference_number || "-"}
                </p>
              </div>

              {/* Created By */}

              <div>
                <p className="text-[11px] uppercase tracking-widest text-gray-500">
                  Created By
                </p>

                <p className="mt-1 text-sm text-gray-900">
                  {transaction.created_by || "-"}
                </p>
              </div>

              {/* Notes */}

              {transaction.notes && (
                <div className="lg:col-span-2">
                  <p className="text-[11px] uppercase tracking-widest text-gray-500">
                    Notes
                  </p>

                  <p className="mt-1 whitespace-pre-wrap text-sm text-gray-800">
                    {transaction.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Action */}

            <div className="mt-4 flex flex-wrap gap-2 border-t border-dashed border-neutral-300 pt-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetail?.(transaction);
                }}
                className="flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs transition hover:bg-neutral-100"
              >
                <Eye size={15} />
                Detail
              </button>

              {hasAttachment && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewAttachment?.(transaction);
                  }}
                  className="flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs transition hover:bg-neutral-100"
                >
                  <Paperclip size={15} />
                  Bukti
                </button>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditTransaction?.(transaction.id_transaction);
                }}
                className="flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs transition hover:bg-neutral-100"
              >
                <Pencil size={15} />
                Edit
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ==========================
          Mobile Layout
      ========================== */}

      <div className="sm:hidden">
        {/* Transaction Row */}

        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="w-full px-4 py-3 text-left transition active:bg-neutral-100"
        >
          <div className="flex items-start justify-between gap-3">
            {/* Left */}

            <div className="min-w-0 flex-1">
              {/* Time */}

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-gray-500">
                  {transactionLabel}
                </span>

                {hasAttachment && (
                  <Paperclip size={12} className="text-gray-400" />
                )}
              </div>

              {/* Description */}

              <h3
                className="mt-1 line-clamp-2 text-[12px] font-semibold leading-5 text-gray-600"
                title={transaction.transaction_description}
              >
                {transaction.transaction_description}
              </h3>

              {/* Category */}

              <p
                className="mt-1 truncate text-[11px] uppercase tracking-wide text-gray-500"
                title={transaction.category_name}
              >
                {transaction.category_name}
              </p>
            </div>

            {/* Right */}

            <div className="ml-3 flex flex-col items-end">
              <span
                className={`text-sm font-bold ${
                  isIncome ? "text-green-700" : "text-red-700"
                }`}
              >
                {isIncome ? "+" : "-"}
                <CurrencyText value={transaction.amount} />
              </span>

              <div className="mt-2 text-gray-400">
                {expanded ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronRight size={18} />
                )}
              </div>
            </div>
          </div>
        </button>
        {/* ==========================
            Expanded Mobile
        ========================== */}

        {expanded && (
          <div className="border-t border-dashed border-neutral-300 bg-neutral-50 px-4 py-4">
            {/* Information */}

            <div className="space-y-4">
              {/* Reference */}

              <div>
                <p className="text-[11px] uppercase tracking-widest text-gray-500">
                  Reference Number
                </p>

                <p className="mt-1 break-all text-sm text-gray-900">
                  {transaction.reference_number || "-"}
                </p>
              </div>

              {/* Created By */}

              <div>
                <p className="text-[11px] uppercase tracking-widest text-gray-500">
                  Created By
                </p>

                <p className="mt-1 text-sm text-gray-900">
                  {transaction.created_by || "-"}
                </p>
              </div>

              {/* Notes */}

              {transaction.notes && (
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-gray-500">
                    Notes
                  </p>

                  <p className="mt-1 whitespace-pre-wrap text-sm text-gray-800">
                    {transaction.notes}
                  </p>
                </div>
              )}
            </div>

            {/* ==========================
                Action
            ========================== */}

            <div className="mt-5 grid grid-cols-1 gap-2 border-t border-dashed border-neutral-300 pt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetail?.(transaction);
                }}
                className="flex items-center justify-center gap-2 rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-sm transition hover:bg-neutral-100"
              >
                <Eye size={16} />
                Detail Transaksi
              </button>

              {hasAttachment && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewAttachment?.(transaction);
                  }}
                  className="flex items-center justify-center gap-2 rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-sm transition hover:bg-neutral-100"
                >
                  <Paperclip size={16} />
                  Lihat Bukti
                </button>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditTransaction?.(transaction);
                }}
                className="flex items-center justify-center gap-2 rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-sm transition hover:bg-neutral-100"
              >
                <Pencil size={16} />
                Edit Transaksi
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TransactionItem;
