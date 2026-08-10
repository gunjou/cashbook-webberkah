import { useEffect, useState } from "react";

import MainLayout from "../../layouts/MainLayout";

import DashboardToolbar from "./DashboardToolbar";
import DashboardSummary from "./DashboardSummary";

import {
  getAccountDropdown,
  getDashboardCashflow,
  getDashboardExpenseAccount,
  getDashboardExpenseCategory,
  getDashboardRecentTransactions,
  getDashboardSummary,
} from "./dashboard.service";
import DashboardCashflowChart from "./DashboardCashflowChart";
import DashboardRecentTransaction from "./DashboardRecentTransaction";
import DashboardExpenseCategory from "./DashboardExpenseCategory";
import DashboardExpenseAccount from "./DashboardExpenseAccount";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  const [summary, setSummary] = useState({
    current_balance: 0,
    total_income: 0,
    total_expense: 0,
    net_cashflow: 0,
  });
  const [accounts, setAccounts] = useState([]);
  const [period, setPeriod] = useState("week");
  const [account, setAccount] = useState("");
  const [cashflow, setCashflow] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [expenseCategory, setExpenseCategory] = useState([]);
  const [expenseAccount, setExpenseAccount] = useState([]);

  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingCashflow, setLoadingCashflow] = useState(false);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const [loadingExpense, setLoadingExpense] = useState(false);
  const [loadingExpenseAccount, setLoadingExpenseAccount] = useState(false);

  useEffect(() => {
    loadAccounts();
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAccounts = async () => {
    try {
      const data = await getAccountDropdown();

      setAccounts(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRefresh = () => {
    loadDashboard();
  };

  const handlePeriodChange = (value) => {
    setPeriod(value);
    const filters = {
      ...getCurrentFilter(),
      period: value,
    };
    loadDashboard(filters);
  };

  const handleAccountChange = (value) => {
    setAccount(value);

    const filters = {
      ...getCurrentFilter(),
    };
    if (value) {
      filters.id_account = value;
    } else {
      delete filters.id_account;
    }
    loadDashboard(filters);
  };

  const getCurrentFilter = () => {
    const params = {};

    if (period) {
      params.period = period;
    }

    if (account) {
      params.id_account = account;
    }

    return params;
  };

  const loadDashboard = async (params = getCurrentFilter()) => {
    await Promise.all([
      loadDashboardSummary(params),
      loadDashboardCashflow(params),
      loadDashboardRecentTransactions(params),
      loadDashboardExpenseCategory(params),
      loadDashboardExpenseAccount(params),
      // loadExpense(params),
      // loadFinancialHealth(params),
    ]);
  };

  const loadDashboardSummary = async (params = {}) => {
    try {
      setLoadingSummary(true);

      const data = await getDashboardSummary(params);

      setSummary(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSummary(false);
    }
  };

  const loadDashboardCashflow = async (params = {}) => {
    try {
      setLoadingCashflow(true);

      const data = await getDashboardCashflow(params);

      setCashflow(data);
    } finally {
      setLoadingCashflow(false);
    }
  };

  const loadDashboardRecentTransactions = async (params = {}) => {
    try {
      setLoadingRecent(true);

      const data = await getDashboardRecentTransactions(params);

      setRecentTransactions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingRecent(false);
    }
  };

  const loadDashboardExpenseCategory = async (params = {}) => {
    try {
      setLoadingExpense(true);

      const data = await getDashboardExpenseCategory(params);

      setExpenseCategory(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingExpense(false);
    }
  };

  const loadDashboardExpenseAccount = async (params = {}) => {
    try {
      setLoadingExpenseAccount(true);

      const data = await getDashboardExpenseAccount(params);

      setExpenseAccount(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingExpenseAccount(false);
    }
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        {/* ==========================
            Header
        ========================== */}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary">Dashboard</h1>

            <p className="mt-1 text-sm text-muted">
              Monitor kondisi keuangan perusahaan secara real-time.
            </p>
          </div>

          <DashboardToolbar
            period={period}
            account={account}
            accounts={accounts}
            onPeriodChange={handlePeriodChange}
            onAccountChange={handleAccountChange}
            onRefresh={handleRefresh}
          />
        </div>

        {/* ==========================
            Summary
        ========================== */}

        <DashboardSummary summary={summary} loading={loadingSummary} />

        {/* ==========================
            Main Content
        ========================== */}

        <div className="grid gap-5 xl:grid-cols-3">
          {/* Cashflow */}

          <div className="xl:col-span-2 rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="font-semibold text-secondary">Cashflow Trend</h2>

                <p className="mt-1 text-sm text-muted">
                  Grafik pemasukan dan pengeluaran.
                </p>
              </div>

              <div className="flex items-center gap-5 text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#8EC86A]" />

                  <span className="text-muted">Income</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#F83A83]" />

                  <span className="text-muted">Expense</span>
                </div>
              </div>
            </div>

            <DashboardCashflowChart
              data={cashflow}
              loading={loadingCashflow}
              period={period}
            />
          </div>

          {/* Recent Transaction */}

          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-secondary">
                  Recent Transaction
                </h2>

                <p className="mt-1 text-sm text-muted">Aktivitas terbaru</p>
              </div>

              <Link
                to="/transactions"
                className="text-sm font-medium text-primary transition hover:underline"
              >
                Lihat Semua →
              </Link>
            </div>

            <DashboardRecentTransaction
              transactions={recentTransactions}
              loading={loadingRecent}
            />
          </div>
        </div>

        {/* ==========================
            Bottom Section
        ========================== */}

        <div className="grid gap-5 xl:grid-cols-3">
          {/* Expense */}

          <div className="xl:col-span-2 rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="mb-4">
              <h2 className="font-semibold text-secondary">
                Expense by Category
              </h2>

              <p className="mt-1 text-sm text-muted">
                Distribusi pengeluaran berdasarkan kategori.
              </p>
            </div>

            <DashboardExpenseCategory
              data={expenseCategory}
              loading={loadingExpense}
            />
          </div>

          {/* Expense by Account */}

          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="mb-4">
              <h2 className="font-semibold text-secondary">
                Expense by Account
              </h2>

              <p className="mt-1 text-sm text-muted">
                Distribusi pengeluaran berdasarkan account.
              </p>
            </div>

            <DashboardExpenseAccount
              data={expenseAccount}
              loading={loadingExpenseAccount}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
