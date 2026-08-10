import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import CurrencyText from "../../components/CurrencyText";
import Loading from "../../components/Loading";

const COLORS = [
  "#4F7DF3",
  "#6FCF97",
  "#F2C94C",
  "#F299A4",
  "#8E9AFD",
  "#56CCF2",
];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;

  return (
    <div className="rounded-lg z-[999] border border-border bg-card p-3 shadow-lg">
      <p className="font-semibold text-secondary">{item.account_name}</p>

      <div className="mt-2 space-y-1 text-sm">
        <div className="flex justify-between gap-5">
          <span className="text-muted">Amount</span>

          <CurrencyText value={item.amount} />
        </div>

        <div className="flex justify-between gap-5">
          <span className="text-muted">Percentage</span>

          <span className="font-medium">{item.percentage}%</span>
        </div>
      </div>
    </div>
  );
};

const DashboardExpenseAccount = ({ data = [], loading = false }) => {
  if (loading) {
    return <Loading.Data text="Memuat expense account..." />;
  }

  if (!data.length) {
    return (
      <div className="flex h-[220px] items-center justify-center text-sm text-muted">
        Belum ada data.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="relative h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="account_name"
              innerRadius={58}
              outerRadius={82}
              paddingAngle={3}
              strokeWidth={2}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip
              content={<CustomTooltip />}
              offset={20}
              wrapperStyle={{
                zIndex: 1000,
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center */}

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-secondary">
            {data.length}
          </span>

          <span className="text-xs text-muted">Accounts</span>
        </div>
      </div>

      {/* Legend */}

      <div className="grid grid-cols-2 gap-2">
        {data.map((item, index) => (
          <div
            key={item.id_account}
            className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <span
                className="h-3 w-3 rounded-full shrink-0"
                style={{
                  backgroundColor: COLORS[index % COLORS.length],
                }}
              />

              <span className="truncate text-sm">{item.account_name}</span>
            </div>

            <span className="ml-2 text-sm font-semibold">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardExpenseAccount;
