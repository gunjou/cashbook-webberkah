import { useEffect, useRef, useState } from "react";
import {
  ArrowLeftRight,
  CalendarDays,
  ChevronDown,
  Download,
  Landmark,
  Plus,
  Search,
  Tag,
} from "lucide-react";

import MainLayout from "../../layouts/MainLayout";
import Loading from "../../components/Loading";

import TransactionReceipt from "./TransactionReceipt";
import TransactionAttachmentModal from "./TransactionAttachmentModal";
import TransactionDetailModal from "./TransactionDetailModal";
import TransactionSummary from "./TransactionSummary";
import TransactionAddModal from "./TransactionAddModal";
import TransactionEditModal from "./TransactionEditModal";

import {
  getAccountDropdown,
  getCategoryDropdown,
  getTransactions,
} from "./transaction.service";
import TransactionTransferModal from "./TransactionTransferModal";
import { getUser } from "../auth/auth.service";
import { exportTransactionPDF } from "../../reports/pdf/transaction.report";
import { FaRegFilePdf } from "react-icons/fa";
import { RiFileExcel2Line } from "react-icons/ri";

/* =========================================================
 * Constants
 * ======================================================= */

const QUICK_FILTERS = [
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

const DEFAULT_SUMMARY = {
  total_income: 0,
  total_outcome: 0,
  cashflow: 0,
  transaction_count: 0,
};

/* =========================================================
 * Helpers
 * ======================================================= */

const getToday = () => new Date().toISOString().split("T")[0];

const getInitialCustomPeriod = () => {
  const today = getToday();

  return {
    date_from: today,
    date_to: today,
  };
};

/* =========================================================
 * Small Components
 * ======================================================= */

const QuickFilterButton = ({ filter, activeFilter, onClick }) => {
  const isActive = activeFilter === filter.key;

  return (
    <button
      type="button"
      onClick={() => onClick(filter.key)}
      className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
        isActive
          ? "bg-primary text-white"
          : "border border-border bg-surface hover:bg-primary/10"
      }`}
    >
      {filter.label}
    </button>
  );
};

const CustomPeriodDropdown = ({
  open,
  activeFilter,
  customPeriod,
  onToggle,
  onChange,
  onApply,
  containerRef,
}) => {
  const isActive = activeFilter === "custom";

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={onToggle}
        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
          isActive
            ? "bg-primary text-white"
            : "border border-border bg-surface hover:bg-primary/10"
        }`}
      >
        <CalendarDays size={16} />
        Custom
        <ChevronDown
          size={15}
          className={`transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="
            absolute z-20 mt-2 w-72 rounded-xl border border-border bg-card p-4 shadow-card
            left-1/2 -translate-x-1/2
            sm:left-0 sm:translate-x-0
          "
        >
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs text-muted">
                Tanggal Mulai
              </label>

              <input
                type="date"
                value={customPeriod.date_from}
                onChange={(event) =>
                  onChange({
                    ...customPeriod,
                    date_from: event.target.value,
                  })
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
                onChange={(event) =>
                  onChange({
                    ...customPeriod,
                    date_to: event.target.value,
                  })
                }
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>

            <button
              type="button"
              onClick={onApply}
              className="w-full rounded-lg bg-primary py-2 text-sm font-medium text-white transition hover:opacity-90"
            >
              Terapkan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const EmptyTransactionReceipt = () => {
  return (
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
  );
};

const TransactionHeader = ({
  exportRef,
  openExport,
  onToggleExport,
  onExportPDF,
  onExportExcel,
  onAddTransaction,
  onAddTransfer,
}) => {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-secondary">Transactions</h1>

        <p className="mt-2 text-muted">
          Kelola seluruh transaksi operasional perusahaan.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {/* Export */}
        <div ref={exportRef} className="relative">
          <button
            type="button"
            onClick={onToggleExport}
            aria-expanded={openExport}
            aria-haspopup="menu"
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-text transition hover:bg-primary hover:text-white"
          >
            <Download size={18} />
            Export
            <ChevronDown
              size={16}
              className={`transition ${openExport ? "rotate-180" : ""}`}
            />
          </button>

          {openExport && (
            <div
              role="menu"
              className="absolute left-0 z-20 mt-2 w-52 overflow-hidden rounded-xl border border-border bg-card shadow-card"
            >
              <button
                type="button"
                role="menuitem"
                onClick={onExportPDF}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 transition hover:bg-red-500/10"
              >
                <FaRegFilePdf size={18} />
                Export PDF
              </button>

              {false && (
                <button
                  type="button"
                  role="menuitem"
                  onClick={onExportExcel}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm text-green-600 transition hover:bg-green-500/10"
                >
                  <RiFileExcel2Line size={18} />
                  Export Excel
                </button>
              )}
            </div>
          )}
        </div>

        {/* Transfer Antar account */}
        <button
          type="button"
          onClick={onAddTransfer}
          className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <ArrowLeftRight size={18} />
          Transfer
        </button>

        {/* Add Transaction */}
        <button
          type="button"
          onClick={onAddTransaction}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <Plus size={18} />
          Tambah Transaksi
        </button>
      </div>
    </div>
  );
};

const TransactionFilters = ({
  activeFilter,
  openCustomPeriod,
  customPeriod,
  search,
  selectedAccount,
  selectedCategory,
  accounts,
  categories,
  customRef,
  onQuickFilter,
  onToggleCustomPeriod,
  onCustomPeriodChange,
  onApplyCustomPeriod,
  onSearchChange,
  onSearchKeyDown,
  onAccountChange,
  onCategoryChange,
}) => {
  return (
    <div className="relative flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-3 shadow-card">
      {/* Quick Filter */}
      <div className="flex flex-wrap gap-2">
        {QUICK_FILTERS.map((filter) => {
          if (filter.key === "custom") {
            return (
              <CustomPeriodDropdown
                key={filter.key}
                open={openCustomPeriod}
                activeFilter={activeFilter}
                customPeriod={customPeriod}
                containerRef={customRef}
                onToggle={() => onToggleCustomPeriod()}
                onChange={onCustomPeriodChange}
                onApply={onApplyCustomPeriod}
              />
            );
          }

          return (
            <QuickFilterButton
              key={filter.key}
              filter={filter}
              activeFilter={activeFilter}
              onClick={onQuickFilter}
            />
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
          onChange={(event) => onSearchChange(event.target.value)}
          onKeyDown={onSearchKeyDown}
          placeholder="Cari kategori atau deskripsi..."
          className="w-full rounded-lg border border-border bg-surface py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-primary"
        />
      </div>

      {/* Account */}

      <div className="relative">
        <Landmark
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />

        <select
          value={selectedAccount}
          onChange={(event) => onAccountChange(event.target.value)}
          className="w-[160px] appearance-none rounded-lg border border-border bg-surface py-2.5 pl-10 pr-8 text-sm outline-none transition focus:border-primary"
        >
          <option value="">All Account</option>

          {accounts.map((account) => (
            <option key={account.id_account} value={account.id_account}>
              {account.account_name}
            </option>
          ))}
        </select>
      </div>

      {/* Category */}

      <div className="relative">
        <Tag
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />

        <select
          value={selectedCategory}
          onChange={(event) => onCategoryChange(event.target.value)}
          className="w-[160px] appearance-none rounded-lg border border-border bg-surface py-2.5 pl-10 pr-8 text-sm outline-none transition focus:border-primary"
        >
          <option value="">All Kategori</option>

          {categories.map((category) => (
            <option key={category.id_category} value={category.id_category}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

/* =========================================================
 * Main Page
 * ======================================================= */

const TransactionPage = () => {
  /* -------------------------------------------------------
   * Refs
   * ----------------------------------------------------- */

  const customRef = useRef(null);
  const exportRef = useRef(null);

  /* -------------------------------------------------------
   * Filter State
   * ----------------------------------------------------- */

  const [activeFilter, setActiveFilter] = useState("today");
  const [openCustomPeriod, setOpenCustomPeriod] = useState(false);

  const [customPeriod, setCustomPeriod] = useState(getInitialCustomPeriod);

  const [search, setSearch] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  /* -------------------------------------------------------
   * Dropdown State
   * ----------------------------------------------------- */

  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);

  /* -------------------------------------------------------
   * Transaction State
   * ----------------------------------------------------- */

  const [summary, setSummary] = useState(DEFAULT_SUMMARY);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* -------------------------------------------------------
   * Modal State
   * ----------------------------------------------------- */

  const [openAttachment, setOpenAttachment] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [openExport, setOpenExport] = useState(false);

  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const [selectedTransactionId, setSelectedTransactionId] = useState(null);

  /* =======================================================
   * Data Loading
   * ===================================================== */

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

  /* =======================================================
   * Filter Helpers
   * ===================================================== */

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
    const currentSearch =
      overrides.search !== undefined ? overrides.search : search;

    if (currentSearch.trim()) {
      params.search = currentSearch.trim();
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

  /* =======================================================
   * Effects
   * ===================================================== */

  useEffect(() => {
    loadTransactions({
      period: "today",
    });

    loadDropdown();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (customRef.current && !customRef.current.contains(event.target)) {
        setOpenCustomPeriod(false);
      }

      if (exportRef.current && !exportRef.current.contains(event.target)) {
        setOpenExport(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* =======================================================
   * Transaction Handlers
   * ===================================================== */

  const handleViewAttachment = (transaction) => {
    setSelectedTransaction(transaction);
    setOpenAttachment(true);
  };

  const handleViewDetail = (transaction) => {
    setSelectedTransactionId(transaction.id_transaction);
    setOpenDetail(true);
  };

  const handleEditTransaction = (idTransaction) => {
    setSelectedTransactionId(idTransaction);
    setEditOpen(true);
  };

  const handleSuccess = () => {
    loadTransactions(getCurrentFilter());
  };

  const handleToggleExport = () => {
    setOpenExport((previous) => !previous);
  };

  const handleExportPDF = () => {
    const user = getUser();
    const filters = getCurrentFilter();

    const selected = accounts.find(
      (item) => item.id_account === Number(selectedAccount),
    );

    exportTransactionPDF(receipts, user, {
      period: activeFilter,
      date_from: filters.date_from,
      date_to: filters.date_to,
      account_name: selected?.account_name ?? null,
    });

    setOpenExport(false);
  };

  const handleExportExcel = () => {
    // TODO: sambungkan ke service export Excel.
    // Gunakan getCurrentFilter() agar hasil export mengikuti filter aktif.
    const params = getCurrentFilter();
    console.log("Export Excel", params);
    setOpenExport(false);
  };

  /* =======================================================
   * Filter Handlers
   * ===================================================== */

  const handleQuickFilter = (period) => {
    if (period === "custom") {
      setOpenCustomPeriod((previous) => !previous);
      return;
    }

    setOpenCustomPeriod(false);
    setActiveFilter(period);

    loadTransactions({
      period,
    });
  };

  const handleCustomPeriodChange = (period) => {
    setCustomPeriod(period);
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

  /* =======================================================
   * Search Handlers
   * ===================================================== */

  const handleSearchChange = (value) => {
    setSearch(value);

    if (value === "") {
      loadTransactions(
        getCurrentFilter({
          search: "",
        }),
      );
    }
  };

  const handleSearchKeyDown = (event) => {
    if (event.key !== "Enter") {
      return;
    }

    loadTransactions(getCurrentFilter());
  };

  /* =======================================================
   * Dropdown Handlers
   * ===================================================== */

  const handleAccountChange = (value) => {
    setSelectedAccount(value);

    loadTransactions(
      getCurrentFilter({
        id_account: value,
      }),
    );
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);

    loadTransactions(
      getCurrentFilter({
        id_category: value,
      }),
    );
  };

  /* =======================================================
   * Modal Handlers
   * ===================================================== */

  const closeAttachmentModal = () => {
    setOpenAttachment(false);
    setSelectedTransaction(null);
  };

  const closeDetailModal = () => {
    setOpenDetail(false);
    setSelectedTransactionId(null);
  };

  const closeEditModal = () => {
    setEditOpen(false);
    setSelectedTransactionId(null);
  };

  const handleEditFromDetail = (idTransaction) => {
    setOpenDetail(false);

    setTimeout(() => {
      setSelectedTransactionId(idTransaction);
      setEditOpen(true);
    }, 0);
  };

  /* =======================================================
   * Render
   * ===================================================== */

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <TransactionHeader
          exportRef={exportRef}
          openExport={openExport}
          onToggleExport={handleToggleExport}
          onExportPDF={handleExportPDF}
          onExportExcel={handleExportExcel}
          onAddTransaction={() => setOpenAddModal(true)}
          onAddTransfer={() => setTransferOpen(true)}
        />

        {/* Filters */}
        <TransactionFilters
          activeFilter={activeFilter}
          openCustomPeriod={openCustomPeriod}
          customPeriod={customPeriod}
          search={search}
          selectedAccount={selectedAccount}
          selectedCategory={selectedCategory}
          accounts={accounts}
          categories={categories}
          customRef={customRef}
          onQuickFilter={handleQuickFilter}
          onToggleCustomPeriod={() =>
            setOpenCustomPeriod((previous) => !previous)
          }
          onCustomPeriodChange={handleCustomPeriodChange}
          onApplyCustomPeriod={handleApplyCustomPeriod}
          onSearchChange={handleSearchChange}
          onSearchKeyDown={handleSearchKeyDown}
          onAccountChange={handleAccountChange}
          onCategoryChange={handleCategoryChange}
        />

        {/* Summary */}
        <TransactionSummary summary={summary} loading={loading} />

        {/* Receipts */}
        <div className="space-y-6">
          {loading ? (
            <div className="overflow-hidden border border-neutral-300 bg-white shadow-sm font-mono">
              <Loading.Data text="Memuat transaksi..." />
            </div>
          ) : receipts.length === 0 ? (
            <EmptyTransactionReceipt />
          ) : (
            receipts.map((receipt) => (
              <TransactionReceipt
                key={receipt.account.id_account}
                receipt={receipt}
                showDate={
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

      {/* Attachment Modal */}
      <TransactionAttachmentModal
        open={openAttachment}
        transaction={selectedTransaction}
        onClose={closeAttachmentModal}
      />

      {/* Detail Modal */}
      <TransactionDetailModal
        open={openDetail}
        transactionId={selectedTransactionId}
        onClose={closeDetailModal}
        onViewAttachment={handleViewAttachment}
        onEditTransaction={handleEditFromDetail}
      />

      {/* Add Transaction Modal */}
      <TransactionAddModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSuccess={handleSuccess}
      />

      {/* Add Transfer Modal */}
      <TransactionTransferModal
        open={transferOpen}
        onClose={() => setTransferOpen(false)}
        onSuccess={handleSuccess}
      />

      {/* Edit Transaction Modal */}
      <TransactionEditModal
        open={editOpen}
        idTransaction={selectedTransactionId}
        onClose={closeEditModal}
        onSuccess={handleSuccess}
      />
    </MainLayout>
  );
};

export default TransactionPage;
