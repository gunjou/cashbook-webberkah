import api from "../../api/axios";

/* ==========================
   DASHBOARD SUMMARY
========================== */
export const getDashboardSummary = async (params = {}) => {
  const response = await api.get("/cashbook/dashboard/summary", {
    params,
  });

  return response.data.data;
};

/* ==========================
   DROPDOWN ACCOUNT
========================== */
export const getAccountDropdown = async () => {
  const response = await api.get("/cashbook/accounts/dropdown");

  return response.data.data;
};

/* ==========================
   DASHBOARD CASHFLOW
========================== */
export const getDashboardCashflow = async (params = {}) => {
  const response = await api.get("/cashbook/dashboard/cashflow", {
    params,
  });

  return response.data.data;
};

/* ==========================
   DASHBOARD RECENT TRANSACTIONS
========================== */
export const getDashboardRecentTransactions = async (params = {}) => {
  const response = await api.get("/cashbook/dashboard/recent-transactions", {
    params,
  });

  return response.data.data;
};

/* ==========================
   DASHBOARD EXPENSE CATEGORY
========================== */
export const getDashboardExpenseCategory = async (params = {}) => {
  const response = await api.get("/cashbook/dashboard/expense-category", {
    params,
  });

  return response.data.data;
};

/* ==========================
   DASHBOARD EXPENSE ACCOUNT
========================== */
export const getDashboardExpenseAccount = async (params = {}) => {
  const response = await api.get("/cashbook/dashboard/expense-account", {
    params,
  });

  return response.data.data;
};
