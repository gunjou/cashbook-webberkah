import { ChevronLeft, ChevronRight, ListFilter } from "lucide-react";

const PurchaseRequestPagination = ({
  page,
  perPage,
  total,
  totalPages,
  loading,
  onPageChange,
  onPerPageChange,
}) => {
  if (!total) return null;

  const startItem = (page - 1) * perPage + 1;
  const endItem = Math.min(page * perPage, total);

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  ).filter(
    (item) => item === 1 || item === totalPages || Math.abs(item - page) <= 1,
  );

  return (
    <div className="px-4 py-3 panel-glass rounded-card">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Information */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <ListFilter size={15} className="text-primary" />
          </div>

          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-600">
              Riwayat Pengajuan
            </p>

            <p className="mt-0.5 text-xs text-primary-strong">
              Menampilkan{" "}
              <span className="font-semibold">
                {startItem}–{endItem}
              </span>{" "}
              dari <span className="font-semibold">{total}</span> item
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap text-[11px] font-medium text-neutral-600">
              Tampilkan
            </span>

            <select
              value={perPage}
              onChange={(e) => onPerPageChange(e.target.value)}
              disabled={loading}
              className="rounded-2xl bg-white/70 ring-1 ring-ink/8 focus:ring-2 focus:ring-primary-500 h-8 px-2 text-[11px] font-semibold text-primary-strong outline-none transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              {[25, 50, 100].map((option) => (
                <option key={option} value={option}>
                  {option} / halaman
                </option>
              ))}
            </select>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => onPageChange(page - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-primary-strong transition hover:bg-primary/10 hover:text-primary disabled:cursor-not-allowed disabled:opacity-30 glass-button"
                aria-label="Halaman sebelumnya"
              >
                <ChevronLeft size={15} />
              </button>

              {pageNumbers.map((pageNumber, index) => {
                const previousPage = pageNumbers[index - 1];

                return (
                  <div key={pageNumber} className="flex items-center gap-1">
                    {previousPage && pageNumber - previousPage > 1 && (
                      <span className="px-1 text-[11px] font-semibold text-neutral-600">
                        ...
                      </span>
                    )}

                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => onPageChange(pageNumber)}
                      className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-[11px] font-semibold transition ${
                        page === pageNumber
                          ? "glass-primary shadow-sm"
                          : "border border-primary-200 bg-white text-primary-strong hover:bg-primary/10 hover:text-primary"
                      } disabled:cursor-not-allowed disabled:opacity-50`}
                      aria-label={`Halaman ${pageNumber}`}
                      aria-current={page === pageNumber ? "page" : undefined}
                    >
                      {pageNumber}
                    </button>
                  </div>
                );
              })}

              <button
                type="button"
                disabled={page >= totalPages || loading}
                onClick={() => onPageChange(page + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full transition disabled:cursor-not-allowed disabled:opacity-30 glass-primary"
                aria-label="Halaman berikutnya"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseRequestPagination;
