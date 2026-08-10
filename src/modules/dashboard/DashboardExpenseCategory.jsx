import CurrencyText from "../../components/CurrencyText";

const colors = [
  "bg-primary",
  "bg-green-500",
  "bg-blue-500",
  "bg-amber-500",
  "bg-purple-500",
];

const DashboardExpenseCategory = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i}>
            <div className="mb-1 flex justify-between">
              <div className="h-3 w-24 rounded bg-gray-200" />
              <div className="h-3 w-10 rounded bg-gray-200" />
            </div>

            <div className="mb-2 h-3 w-32 rounded bg-gray-200" />

            <div className="h-1.5 rounded-full bg-gray-200" />
          </div>
        ))}
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex h-[260px] items-center justify-center text-sm text-muted">
        Belum ada data pengeluaran.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={item.id_category}>
          {/* Header */}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  colors[index % colors.length]
                }`}
              />

              <span className="truncate text-sm font-medium text-secondary">
                {item.category_name}
              </span>
            </div>

            <span className="ml-3 text-xs font-semibold text-secondary">
              {item.percentage}%
            </span>
          </div>

          {/* Amount */}

          <div className="mt-0.5 text-xs text-muted">
            <CurrencyText value={item.amount} />
          </div>

          {/* Progress */}

          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface">
            <div
              className={`h-full rounded-full transition-all ${
                colors[index % colors.length]
              }`}
              style={{
                width: `${item.percentage}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardExpenseCategory;
