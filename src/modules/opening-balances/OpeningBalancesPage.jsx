import { useEffect, useRef, useState } from "react";
import {
  Download,
  ChevronDown,
  Plus,
  Search,
  WandSparkles,
} from "lucide-react";
import { FaRegFilePdf } from "react-icons/fa";
import { RiFileExcel2Line } from "react-icons/ri";

import MainLayout from "../../layouts/MainLayout";

import swal from "../../lib/swal";
import Loading from "../../components/Loading";

import {
  createOpeningBalance,
  getOpeningBalanceDisplay,
  updateOpeningBalance,
} from "./opening-balance.service";
import OpeningBalanceCard from "./OpeningBalanceCard";
import OpeningBalanceAddModal from "./OpeningBalanceAddModal";
import OpeningBalanceEditModal from "./OpeningBalanceEditModal";
import OpeningBalanceHistoryModal from "./OpeningBalanceHistoryModal";

const OpeningBalancePage = () => {
  const exportRef = useRef(null);

  const [search, setSearch] = useState("");
  const [openExport, setOpenExport] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openingBalances, setOpeningBalances] = useState([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingOpeningBalanceId, setEditingOpeningBalanceId] = useState(null);
  const [selectedAccountId, setSelectedAccountId] = useState(null);

  useEffect(() => {
    fetchOpeningBalances();
  }, []);

  const fetchOpeningBalances = async () => {
    try {
      setLoading(true);

      const data = await getOpeningBalanceDisplay();

      setOpeningBalances(data);
    } catch (error) {
      swal.fire({
        icon: "error",
        title: "Gagal Memuat Data",
        text: error.response?.data?.message ?? "Terjadi kesalahan.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportRef.current && !exportRef.current.contains(event.target)) {
        setOpenExport(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOpeningBalances = openingBalances.filter((item) => {
    const keyword = search.toLowerCase();
    return (
      item.account_name.toLowerCase().includes(keyword) ||
      item.notes?.toLowerCase().includes(keyword)
    );
  });

  const handleExportPDF = () => {
    console.log("Export PDF");
    setOpenExport(false);
  };

  const handleExportExcel = () => {
    console.log("Export Excel");
    setOpenExport(false);
  };

  const handleGenerate = () => {
    console.log("Generate Opening Balance");
  };

  const handleCreate = async (payload) => {
    try {
      await createOpeningBalance(payload);
      setShowAddModal(false);
      await fetchOpeningBalances();

      swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Opening Balance berhasil ditambahkan.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.message ?? "Terjadi kesalahan.",
      });
    }
  };

  const handleUpdateOpeningBalance = async (payload) => {
    try {
      await updateOpeningBalance(editingOpeningBalanceId, payload);
      setEditingOpeningBalanceId(null);
      await fetchOpeningBalances();

      swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Opening Balance berhasil diperbarui.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.message ?? "Terjadi kesalahan.",
      });
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 p-6">
        {/* Header */}

        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <h1 className="text-3xl font-bold text-secondary">
              Opening Balance
            </h1>

            <p className="mt-1 text-muted">
              Monitoring saldo awal setiap account berdasarkan periode.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Export */}

            <div ref={exportRef} className="relative">
              <button
                onClick={() => setOpenExport((prev) => !prev)}
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
                <div className="absolute left-0 z-20 mt-2 w-52 overflow-hidden rounded-xl border border-border bg-card shadow-card lg:left-0 lg:right-auto">
                  <button
                    onClick={handleExportPDF}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm transition text-red-600 hover:bg-red-600/10 hover:text-red-600"
                  >
                    <FaRegFilePdf size={18} />
                    Export PDF
                  </button>

                  <button
                    onClick={handleExportExcel}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm transition text-green-600 hover:bg-green-600/10 hover:text-green-600"
                  >
                    <RiFileExcel2Line size={18} />
                    Export Excel
                  </button>
                </div>
              )}
            </div>

            {/* Generate */}

            <button
              onClick={handleGenerate}
              className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-3 font-semibold text-white transition hover:opacity-90"
            >
              <WandSparkles size={18} />
              Generate
            </button>

            {/* Add */}

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-3 font-semibold text-white transition hover:opacity-90"
            >
              <Plus size={18} />
              Tambah Manual
            </button>
          </div>
        </div>

        {/* Search */}

        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          />

          <input
            type="text"
            placeholder="Cari account..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-card py-3 pl-11 pr-4 text-text outline-none transition focus:border-primary"
          />
        </div>
        {/* Content */}

        {loading ? (
          <div className="rounded-2xl border border-border bg-card py-20 shadow-card">
            <Loading.Data text="Memuat Opening Balance..." />
          </div>
        ) : filteredOpeningBalances.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card py-20 text-center shadow-card">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Search size={34} className="text-primary" />
            </div>

            <h3 className="mt-6 text-xl font-semibold text-secondary">
              Tidak ada Opening Balance
            </h3>

            <p className="mt-2 text-muted">
              Account yang Anda cari tidak ditemukan.
            </p>
          </div>
        ) : (
          <>
            {/* Summary */}

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-5 py-4 shadow-card">
              <div>
                <h2 className="font-semibold text-secondary">
                  Opening Balance Terakhir
                </h2>

                <p className="mt-1 text-sm text-muted">
                  Menampilkan snapshot opening balance terbaru setiap account.
                </p>
              </div>

              <span className="rounded-full bg-primary/15 px-4 py-2 text-sm font-medium text-secondary">
                {filteredOpeningBalances.length} Account
              </span>
            </div>

            {/* Grid */}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {filteredOpeningBalances.map((item) => (
                <OpeningBalanceCard
                  key={item.id_account}
                  data={item}
                  onHistory={setSelectedAccountId}
                  onEdit={setEditingOpeningBalanceId}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* =========================
          History Modal
      ========================= */}
      <OpeningBalanceHistoryModal
        accountId={selectedAccountId}
        onClose={() => setSelectedAccountId(null)}
      />

      {/* =========================
          Add Manual
      ========================= */}
      <OpeningBalanceAddModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleCreate}
      />

      {/* =========================
          UPDATE
      ========================= */}
      <OpeningBalanceEditModal
        openingBalanceId={editingOpeningBalanceId}
        onClose={() => setEditingOpeningBalanceId(null)}
        onSave={handleUpdateOpeningBalance}
      />

      {/* =========================
          Generate
      ========================= */}
      {/*
      <OpeningBalanceGenerateModal
        open={openGenerateModal}
        onClose={() => setOpenGenerateModal(false)}
      />
      */}
    </MainLayout>
  );
};

export default OpeningBalancePage;
