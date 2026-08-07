import {
  Wallet,
  Landmark,
  Smartphone,
  ArrowRight,
  Calendar,
  Pencil,
} from "lucide-react";
import { formatPeriod } from "../../utils/date";
import CurrencyText from "../../components/CurrencyText";

const OpeningBalanceCard = ({ data, onClick, onEdit, onHistory }) => {
  const getIcon = () => {
    // console.log("data.account_kind", data);
    switch (data.account_kind) {
      case "BANK":
        return <Landmark size={22} />;

      case "EWALLET":
        return <Smartphone size={22} />;

      default:
        return <Wallet size={22} />;
    }
  };

  return (
    <div
      onClick={onClick}
      className="group flex w-full flex-col rounded-2xl border border-border bg-card p-5 text-left shadow-card transition duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-lg"
    >
      {/* Header */}

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-secondary">
            {getIcon()}
          </div>

          <div>
            <h3 className="font-semibold text-secondary">
              {data.account_name}
            </h3>

            <p className="mt-1 text-xs uppercase tracking-wide text-muted">
              {data.account_kind}
            </p>
          </div>
        </div>

        <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-secondary">
          Latest
        </span>
      </div>

      {/* Opening Balance */}

      <div className="mt-6">
        <p className="text-sm text-muted">Opening Balance</p>

        <h2 className="mt-2 break-all text-2xl font-bold text-text">
          <CurrencyText value={data.opening_balance} />
        </h2>
      </div>

      {/* Footer */}

      <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-2 text-sm text-muted">
          <Calendar size={16} />

          {formatPeriod(data.effective_date)}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(data.id_opening_balance)}
            className="rounded-lg p-2 text-text transition hover:bg-primary hover:text-white"
          >
            <Pencil size={18} />
          </button>

          <div
            onClick={() => onHistory(data.id_account)}
            className="flex items-center gap-2 text-sm font-medium text-secondary transition cursor-pointer hover:px-2 hover:py-2 hover:rounded-lg hover:bg-primary hover:text-white group-hover:translate-x-1"
          >
            History
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpeningBalanceCard;
