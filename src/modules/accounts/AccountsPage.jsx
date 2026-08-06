import { useState, useEffect, useRef } from "react";
import {
  Download,
  Plus,
  Search,
  Pencil,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { RiFileExcel2Line } from "react-icons/ri";
import { FaRegFilePdf } from "react-icons/fa";

import MainLayout from "../../layouts/MainLayout";
import {
  createAccount,
  getAccounts,
  updateAccount,
  deleteAccount,
} from "./account.service";
import swal from "../../lib/swal";
import AccountDetailModal from "./AccountDetailModal";
import AccountAddModal from "./AccountAddModal";
import AccountEditModal from "./AccountEditModal";
import Loading from "../../components/Loading";
import { exportAccountPDF } from "../../reports/pdf/account.report";
import { getUser } from "../auth/auth.service";
import { exportAccountExcel } from "../../reports/excel/account.report";

const AccountsPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);

  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [addFormModal, setAddFormModal] = useState(false);
  const [editingAccountId, setEditingAccountId] = useState(null);

  const [openExport, setOpenExport] = useState(false);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [kind, setKind] = useState("");

  const exportRef = useRef(null);

  const user = getUser();

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);

      const data = await getAccounts();

      setAccounts(data);
      setFilteredAccounts(data);
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
    let result = [...accounts];

    if (search) {
      const keyword = search.toLowerCase();

      result = result.filter((item) =>
        [
          item.account_name,
          item.bank_name,
          item.branch_name,
          item.account_holder,
          item.account_number,
        ]
          .join(" ")
          .toLowerCase()
          .includes(keyword),
      );
    }

    if (kind) {
      result = result.filter((item) => item.account_kind === kind);
    }

    setFilteredAccounts(result);
  }, [accounts, search, kind]);

  const handleCreateAccount = async (payload) => {
    try {
      await createAccount(payload);

      await swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Account berhasil ditambahkan.",
        timer: 1200,
        showConfirmButton: false,
      });

      setAddFormModal(false);

      fetchAccounts();
    } catch (error) {
      swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.message ?? "Terjadi kesalahan.",
      });
    }
  };

  const handleUpdateAccount = async (id, payload) => {
    try {
      await updateAccount(id, payload);

      await swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Account berhasil diperbarui.",
        timer: 1200,
        showConfirmButton: false,
      });

      setEditingAccountId(null);

      fetchAccounts();
    } catch (error) {
      swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.message ?? "Terjadi kesalahan.",
      });
    }
  };

  const handleDeleteAccount = async (id) => {
    const result = await swal.fire({
      icon: "warning",
      title: "Hapus Account",
      text: "Account yang dihapus tidak dapat dikembalikan.",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteAccount(id);

      await swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Account berhasil dihapus.",
        timer: 1200,
        showConfirmButton: false,
      });

      fetchAccounts();
    } catch (error) {
      swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.message ?? "Terjadi kesalahan.",
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportRef.current && !exportRef.current.contains(event.target)) {
        setOpenExport(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleExportPDF = () => {
    exportAccountPDF(filteredAccounts, user);

    setOpenExport(false);
  };

  const handleExportExcel = async () => {
    await exportAccountExcel(filteredAccounts, user);

    setOpenExport(false);
  };

  return (
    <MainLayout>
      <div className="space-y-6 p-6">
        {/* Header */}

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary">Account</h1>

            <p className="mt-1 text-muted">
              Kelola daftar akun kas dan bank perusahaan.
            </p>
          </div>

          <div className="flex gap-3">
            <div ref={exportRef} className="relative">
              <button
                onClick={() => setOpenExport((prev) => !prev)}
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-text transition hover:bg-primary/15"
              >
                <Download size={18} />
                Export
                <ChevronDown
                  size={16}
                  className={`transition duration-200 ${
                    openExport ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openExport && (
                <div className="absolute left-0 z-20 mt-2 w-52 overflow-hidden rounded-xl border border-border bg-card shadow-card sm:left-auto sm:right-0">
                  <button
                    onClick={handleExportPDF}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 transition hover:bg-red-500/10 hover:text-red-600"
                  >
                    <FaRegFilePdf size={18} />
                    Export .pdf
                  </button>

                  <button
                    onClick={handleExportExcel}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-green-600 transition hover:bg-green-500/10 hover:text-green-600"
                  >
                    <RiFileExcel2Line size={18} />
                    Export .xlsx
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setAddFormModal(true)}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-3 font-semibold text-white transition hover:opacity-90"
            >
              <Plus size={18} />
              Tambah Account
            </button>
          </div>
        </div>

        {/* Filter */}

        {/* <div className="rounded-xl border border-border bg-card p-4 shadow-card"> */}
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari account..."
              className="w-full rounded-lg border border-border bg-surface py-3 pl-10 pr-4 text-text outline-none focus:border-primary"
            />
          </div>

          <select
            value={kind}
            onChange={(e) => setKind(e.target.value)}
            className="rounded-lg border border-border bg-surface px-4 py-3 text-text outline-none focus:border-primary"
          >
            <option value="">Semua Jenis</option>
            <option value="CASH">Cash</option>
            <option value="BANK">Bank</option>
            <option value="EWALLET">E-Wallet</option>
          </select>
        </div>
        {/* </div> */}

        {/* Desktop Table */}

        <div className="hidden overflow-hidden rounded-xl border border-border bg-card shadow-card lg:block">
          <table className="w-full">
            <thead className="bg-secondary text-white">
              {/* <thead className="border-b border-border bg-surface"> */}
              <tr className="text-center text-sm">
                <th className="px-5 py-4">No</th>
                <th className="px-5 py-4 text-left">Nama Account</th>
                <th className="px-5 py-4">Kind</th>
                <th className="px-5 py-4">Bank</th>
                <th className="px-5 py-4">Cabang</th>
                <th className="px-5 py-4">No. Rekening</th>
                <th className="px-5 py-4">Account Holder</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-muted">
                    <Loading.Data text="Memuat data..." />
                  </td>
                </tr>
              ) : filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-muted">
                    Tidak ada data.
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((account, index) => (
                  <tr
                    key={account.id_account}
                    className="group border-b text-center border-border transition hover:bg-primary hover:opacity-80"
                  >
                    <td
                      onClick={() => setSelectedAccountId(account.id_account)}
                      className="px-5 py-2 cursor-pointer"
                    >
                      {index + 1}
                    </td>

                    <td
                      onClick={() => setSelectedAccountId(account.id_account)}
                      className="px-5 py-2 text-left font-medium cursor-pointer"
                    >
                      {account.account_name}
                    </td>

                    <td
                      onClick={() => setSelectedAccountId(account.id_account)}
                      className="px-5 py-2 cursor-pointer"
                    >
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          account.account_kind === "BANK"
                            ? "bg-primary text-white"
                            : "bg-secondary text-white"
                        }`}
                      >
                        {account.account_kind}
                      </span>
                    </td>

                    <td
                      onClick={() => setSelectedAccountId(account.id_account)}
                      className="px-5 py-2 cursor-pointer"
                    >
                      {account.bank_name ?? "-"}
                    </td>

                    <td
                      onClick={() => setSelectedAccountId(account.id_account)}
                      className="px-5 py-2 cursor-pointer"
                    >
                      {account.branch_name ?? "-"}
                    </td>

                    <td
                      onClick={() => setSelectedAccountId(account.id_account)}
                      className="px-5 py-2 cursor-pointer"
                    >
                      {account.account_number ?? "-"}
                    </td>

                    <td
                      onClick={() => setSelectedAccountId(account.id_account)}
                      className="px-5 py-2 cursor-pointer"
                    >
                      {account.account_holder ?? "-"}
                    </td>

                    <td className="px-5 py-2">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingAccountId(account.id_account);
                          }}
                          className="rounded-lg p-2 text-text transition hover:bg-primary/15"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAccount(account.id_account);
                          }}
                          className="rounded-lg p-2 text-red-600 transition hover:bg-red-500/10"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card */}

        <div className="space-y-4 lg:hidden">
          {loading ? (
            <div className="rounded-xl border border-border bg-card p-6 text-center text-muted shadow-card">
              <Loading.Data text="Memuat data..." />
            </div>
          ) : filteredAccounts.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-6 text-center text-muted shadow-card">
              Tidak ada account.
            </div>
          ) : (
            filteredAccounts.map((account) => (
              <div
                key={account.id_account}
                onClick={() => setSelectedAccountId(account.id_account)}
                className="rounded-xl border border-border bg-card p-4 shadow-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-secondary">
                      {account.account_name}
                    </h3>

                    <p className="mt-1 text-sm text-muted">
                      {account.bank_name ?? "-"}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      account.account_kind === "BANK"
                        ? "bg-primary text-white"
                        : "bg-secondary text-white"
                    }`}
                  >
                    {account.account_kind}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm text-text">
                  <p>
                    <span className="font-medium">Cabang :</span>{" "}
                    {account.branch_name ?? "-"}
                  </p>

                  <p>
                    <span className="font-medium">Rekening :</span>{" "}
                    {account.account_number ?? "-"}
                  </p>

                  <p>
                    <span className="font-medium">Holder :</span>{" "}
                    {account.account_holder ?? "-"}
                  </p>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingAccountId(account.id_account);
                    }}
                    className="rounded-lg p-2 text-text transition hover:bg-primary/15"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAccount(account.id_account);
                    }}
                    className="rounded-lg p-2 text-red-600 transition hover:bg-red-500/10"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <AccountDetailModal
        accountId={selectedAccountId}
        onClose={() => setSelectedAccountId(null)}
      />

      <AccountAddModal
        open={addFormModal}
        onClose={() => setAddFormModal(false)}
        onSave={handleCreateAccount}
      />

      <AccountEditModal
        accountId={editingAccountId}
        onClose={() => setEditingAccountId(null)}
        onSave={handleUpdateAccount}
      />
    </MainLayout>
  );
};

export default AccountsPage;
