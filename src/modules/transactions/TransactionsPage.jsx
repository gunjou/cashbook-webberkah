import { useEffect, useState, useRef } from "react";

import {
  CalendarDays,
  ChevronDown,
  Download,
  Plus,
  Search,
} from "lucide-react";

import MainLayout from "../../layouts/MainLayout";

import TransactionReceipt from "./TransactionReceipt";
import {
  getAccountDropdown,
  getCategoryDropdown,
  getTransactions,
} from "./transaction.service";
import Loading from "../../components/Loading";
import TransactionAttachmentModal from "./TransactionAttachmentModal";
import TransactionDetailModal from "./TransactionDetailModal";
import TransactionSummary from "./TransactionSummary";
import TransactionAddModal from "./TransactionAddModal";
import TransactionEditModal from "./TransactionEditModal";

const quickFilters = [
  {
    key: "today",
    label: "Hari Ini",
  },
  {
    key: "yesterday",
    label: "Kemarin",
  },
  {
    key: "week",
    label: "Minggu Ini",
  },
  {
    key: "month",
    label: "Bulan Ini",
  },
  {
    key: "custom",
    label: "Custom",
  },
];

const TransactionPage = () => {
  const customRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState("today");

  const [openCustomPeriod, setOpenCustomPeriod] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const [customPeriod, setCustomPeriod] = useState({
    date_from: today,
    date_to: today,
  });
  const [search, setSearch] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const loadDropdown = async () => {
    try {
      const [accountData, categoryData] = await Promise.all([
        getAccountDropdown(),
        getCategoryDropdown(),
      ]);

      setAccounts(accountData);
      setCategories(categoryData);
    } catch (error) {
      console.error(error);
    }
  };

  const [summary, setSummary] = useState({
    total_income: 0,
    total_outcome: 0,
    cashflow: 0,
    transaction_count: 0,
  });
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openAttachment, setOpenAttachment] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  // const [openExport, setOpenExport] = useState(false);

  useEffect(() => {
    loadTransactions({
      period: "today",
    });

    loadDropdown();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTransactions = async (params = {}) => {
    try {
      setLoading(true);

      const data = await getTransactions(params);

      setSummary(data.summary);

      setReceipts(data.accounts.filter((item) => item.transaction_count > 0));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (customRef.current && !customRef.current.contains(e.target)) {
        setOpenCustomPeriod(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleViewAttachment = (transaction) => {
    setSelectedTransaction(transaction);
    setOpenAttachment(true);
  };

  const handleViewDetail = (transaction) => {
    setSelectedTransactionId(transaction.id_transaction);
    console.log(transaction.id_transaction);
    setOpenDetail(true);
  };

  const handleSuccess = () => {
    window.location.href = "/transactions";
  };

  const handleQuickFilter = (period) => {
    if (period === "custom") {
      setOpenCustomPeriod((prev) => !prev);
      return;
    }

    setOpenCustomPeriod(false);

    setActiveFilter(period);

    loadTransactions({
      period,
    });
  };

  const handleApplyCustomPeriod = () => {
    if (customPeriod.date_from > customPeriod.date_to) {
      alert("Tanggal mulai tidak boleh lebih besar dari tanggal selesai.");
      return;
    }

    setActiveFilter("custom");

    setOpenCustomPeriod(false);

    loadTransactions({
      period: "custom",
      date_from: customPeriod.date_from,
      date_to: customPeriod.date_to,
    });
  };

  const getCurrentFilter = (overrides = {}) => {
    const params = {};

    // Period
    if (activeFilter === "custom") {
      params.period = "custom";
      params.date_from = customPeriod.date_from;
      params.date_to = customPeriod.date_to;
    } else {
      params.period = activeFilter;
    }

    // Search
    if (search.trim()) {
      params.search = search.trim();
    }

    // Account
    const account =
      overrides.id_account !== undefined
        ? overrides.id_account
        : selectedAccount;

    if (account) {
      params.id_account = account;
    }

    // Category
    const category =
      overrides.id_category !== undefined
        ? overrides.id_category
        : selectedCategory;

    if (category) {
      params.id_category = category;
    }

    return params;
  };

  const handleEditTransaction = (idTransaction) => {
    setSelectedTransactionId(idTransaction);
    setEditOpen(true);
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary">Transactions</h1>

            <p className="mt-2 text-muted">
              Kelola seluruh transaksi operasional perusahaan.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Export */}

            <div className="relative">
              <button
                // onClick={() => setOpenExport((prev) => !prev)}
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium transition hover:bg-primary hover:text-white"
              >
                <Download size={18} />
                Export
                <ChevronDown size={16} />
              </button>

              {/*
              Dropdown Export
              Akan diimplementasikan nanti
            */}
            </div>

            {/* Add Transaction */}

            <button
              onClick={() => setOpenAddModal(true)}
              className="flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-white transition hover:opacity-90"
            >
              <Plus size={18} />
              Tambah Transaksi
            </button>
          </div>
        </div>

        {/* ==========================
    Toolbar Filter
========================== */}

        <div className="relative flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-3 shadow-card">
          {/* Quick Filter */}

          <div className="flex flex-wrap gap-2">
            {quickFilters.map((filter) => {
              if (filter.key === "custom") {
                return (
                  <div key={filter.key} ref={customRef} className="relative">
                    {/* Button Custom */}

                    <button
                      type="button"
                      onClick={() => handleQuickFilter("custom")}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                        activeFilter === "custom"
                          ? "bg-primary text-white"
                          : "border border-border bg-surface hover:bg-primary/10"
                      }`}
                    >
                      <CalendarDays size={16} />

                      {activeFilter === "custom" ? "Custom" : "Custom"}

                      <ChevronDown
                        size={15}
                        className={`transition ${
                          openCustomPeriod ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {openCustomPeriod && (
                      <div className="absolute left-0 z-20 mt-2 w-72 rounded-xl border border-border bg-card p-4 shadow-card">
                        <div className="space-y-4">
                          <div>
                            <label className="mb-1 block text-xs text-muted">
                              Tanggal Mulai
                            </label>

                            <input
                              type="date"
                              value={customPeriod.date_from}
                              onChange={(e) =>
                                setCustomPeriod((prev) => ({
                                  ...prev,
                                  date_from: e.target.value,
                                }))
                              }
                              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
                            />
                          </div>

                          <div>
                            <label className="mb-1 block text-xs text-muted">
                              Tanggal Selesai
                            </label>

                            <input
                              type="date"
                              value={customPeriod.date_to}
                              onChange={(e) =>
                                setCustomPeriod((prev) => ({
                                  ...prev,
                                  date_to: e.target.value,
                                }))
                              }
                              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
                            />
                          </div>

                          <button
                            onClick={handleApplyCustomPeriod}
                            className="w-full rounded-lg bg-primary py-2 text-sm font-medium text-white transition hover:opacity-90"
                          >
                            Terapkan
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => handleQuickFilter(filter.key)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    activeFilter === filter.key
                      ? "bg-primary text-white"
                      : "border border-border bg-surface hover:bg-primary/10"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          {/* Separator */}

          <div className="hidden h-8 w-px bg-border lg:block" />

          {/* Search */}

          <div className="relative min-w-[220px] flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />

            <input
              value={search}
              onChange={(e) => {
                const value = e.target.value;
                setSearch(value);

                if (value === "") {
                  loadTransactions(getCurrentFilter());
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  loadTransactions(getCurrentFilter());
                }
              }}
              placeholder="Cari kategori atau deskripsi..."
              className="w-full rounded-lg border border-border bg-surface py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-primary"
            />
          </div>

          {/* Account */}

          <select
            value={selectedAccount}
            onChange={(e) => {
              const value = e.target.value;

              setSelectedAccount(value);

              loadTransactions(
                getCurrentFilter({
                  id_account: value,
                }),
              );
            }}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none transition focus:border-primary"
          >
            <option value="">Semua Account</option>

            {accounts.map((account) => (
              <option key={account.id_account} value={account.id_account}>
                {account.account_name}
              </option>
            ))}
          </select>

          {/* Category */}

          <select
            value={selectedCategory}
            onChange={(e) => {
              const value = e.target.value;

              setSelectedCategory(value);

              loadTransactions(
                getCurrentFilter({
                  id_category: value,
                }),
              );
            }}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none transition focus:border-primary"
          >
            <option value="">Semua Kategori</option>

            {categories.map((category) => (
              <option key={category.id_category} value={category.id_category}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Date */}
          {/* <button className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm transition hover:bg-primary/10">
            <CalendarDays size={16} />
            Tanggal
          </button> */}
        </div>

        {/* Summary */}
        <TransactionSummary summary={summary} loading={loading} />

        {/* Receipt */}

        <div className="space-y-6">
          {loading ? (
            <div className="overflow-hidden border border-neutral-300 bg-white shadow-sm font-mono">
              <Loading.Data text="Memuat transaksi..." />
            </div>
          ) : receipts.length === 0 ? (
            <div className="overflow-hidden border border-neutral-300 bg-white shadow-sm">
              {/* Receipt Header */}

              <div className="border-b border-dashed border-neutral-300 px-5 py-4 font-mono">
                <p className="text-center text-[11px] uppercase tracking-[0.3em] text-gray-500">
                  TRANSACTION RECEIPT
                </p>

                <p className="mt-2 text-center text-lg font-bold tracking-wide text-gray-900">
                  BELUM ADA TRANSAKSI
                </p>
              </div>

              {/* Body */}

              <div className="flex flex-col items-center px-6 py-12 font-mono">
                {/* <div className="mb-6 text-5xl opacity-40">🧾</div> */}

                <p className="text-center text-sm text-gray-700">
                  Tidak ada transaksi pada periode yang dipilih.
                </p>

                <p className="mt-2 text-center text-xs uppercase tracking-[0.2em] text-gray-500">
                  Silakan ubah filter atau tambahkan transaksi baru.
                </p>
              </div>

              {/* Footer */}

              <div className="border-t border-dashed border-neutral-300 px-5 py-3">
                <p className="text-center font-mono text-[11px] tracking-[0.25em] text-gray-400">
                  *** END OF RECEIPT ***
                </p>
              </div>
            </div>
          ) : (
            receipts.map((receipt) => (
              <TransactionReceipt
                key={receipt.account.id_account}
                receipt={receipt}
                showDate={
                  // activeFilter !== "today" && activeFilter !== "yesterday"
                  activeFilter !== "today" && activeFilter !== "yesterday"
                }
                onViewDetail={handleViewDetail}
                onViewAttachment={handleViewAttachment}
                onEditTransaction={handleEditTransaction}
              />
            ))
          )}
        </div>
      </div>

      {/* ==============================
          Attachment Modal
        ============================== */}
      <TransactionAttachmentModal
        open={openAttachment}
        transaction={selectedTransaction}
        onClose={() => {
          setOpenAttachment(false);
          setSelectedTransaction(null);
        }}
      />

      {/* ==============================
          Detail Modal
        ============================== */}
      <TransactionDetailModal
        open={openDetail}
        transactionId={selectedTransactionId}
        onClose={() => {
          setOpenDetail(false);
          setSelectedTransactionId(null);
        }}
        onViewAttachment={handleViewAttachment}
        onEditTransaction={(idTransaction) => {
          setOpenDetail(false);

          setTimeout(() => {
            setSelectedTransactionId(idTransaction);
            setEditOpen(true);
          }, 0);
        }}
      />

      {/* ==============================
          Add Transaction Modal
        ============================== */}
      <TransactionAddModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSuccess={handleSuccess}
      />

      {/* ==============================
          Edit Transaction Modal
        ============================== */}
      <TransactionEditModal
        open={editOpen}
        idTransaction={selectedTransactionId}
        onClose={() => {
          setEditOpen(false);
          setSelectedTransactionId(null);
        }}
        onSuccess={handleSuccess}
      />
    </MainLayout>
  );
};

export default TransactionPage;
