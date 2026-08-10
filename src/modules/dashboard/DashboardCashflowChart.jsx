import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import CurrencyText from "../../components/CurrencyText";
import Loading from "../../components/Loading";

const DashboardCashflowChart = ({ data, loading, period }) => {
  if (loading) {
    return (
      <div className="flex h-[320px] items-center justify-center">
        <Loading.Data text="Memuat grafik cashflow..." />
      </div>
    );
  }

  const formatTooltipDate = (date, period) => {
    if (!date) return "-";

    const d = new Date(date);

    if (period === "year") {
      return d.toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
      });
    }

    const weekday = d.toLocaleDateString("id-ID", {
      weekday: "long",
    });

    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();

    return `${weekday}, ${dd}-${mm}-${yyyy}`;
  };

  const CustomTooltip = ({ active, payload, period }) => {
    if (!active || !payload?.length) return null;

    const item = payload[0].payload;
    console.log(item);

    return (
      <div className="min-w-[220px] rounded-xl border border-border bg-card p-4 lg:p-5 shadow-xl">
        <p className="mb-3 font-semibold text-secondary">
          {formatTooltipDate(item.date, period)}
        </p>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#8EC86A]" />

              <span className="text-sm text-muted">IN</span>
            </div>

            <div className="text-sm font-medium">
              <CurrencyText value={item.income} />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#F83A83]" />

              <span className="text-sm text-muted">OUT</span>
            </div>

            <div className="text-sm font-medium">
              <CurrencyText value={item.expense} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 20,
            left: 10,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6FCF97" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#6FCF97" stopOpacity={0.02} />
            </linearGradient>

            <linearGradient id="expense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F299A4" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#F299A4" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

          <XAxis
            dataKey="label"
            interval={0}
            tick={{
              fontSize: 12,
            }}
            tickFormatter={(value) => value.slice(0, 3)}
          />

          <YAxis hide />

          <Tooltip
            cursor={{
              stroke: "#D1D5DB",
              strokeWidth: 1,
              strokeDasharray: "4 4",
            }}
            content={<CustomTooltip period={period} />}
          />

          <Area
            type="monotone"
            dataKey="income"
            name="Income"
            stroke="#8EC86A"
            strokeWidth={3}
            fill="url(#income)"
            activeDot={{
              r: 6,
            }}
          />

          <Area
            type="monotone"
            dataKey="expense"
            name="Expense"
            stroke="#F83A83"
            strokeWidth={3}
            fill="url(#expense)"
            activeDot={{
              r: 6,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashboardCashflowChart;
