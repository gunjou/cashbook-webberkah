import { useEffect, useState } from "react";
import { X } from "lucide-react";

import swal from "../../lib/swal";
import Loading from "../../components/Loading";

import { getAccountDropdown } from "./opening-balance.service";
import { formatCurrencyInput } from "../../utils/currency";

const OpeningBalanceAddModal = ({ open, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [loadingAccount, setLoadingAccount] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [idAccount, setIdAccount] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [openingBalance, setOpeningBalance] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) return;
    resetForm();
    fetchAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const resetForm = () => {
    setIdAccount("");
    setEffectiveDate("");
    setOpeningBalance("");
    setNotes("");
  };

  const fetchAccounts = async () => {
    try {
      setLoadingAccount(true);
      const data = await getAccountDropdown();
      setAccounts(data);
    } catch (error) {
      swal.fire({
        icon: "error",
        title: "Gagal Memuat Data",
        text: error.response?.data?.message ?? "Terjadi kesalahan.",
      });
      onClose();
    } finally {
      setLoadingAccount(false);
    }
  };

  const handleBalanceChange = (e) => {
    setOpeningBalance(formatCurrencyInput(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!idAccount) {
      return swal.fire({
        icon: "warning",
        title: "Data Belum Lengkap",
        text: "Account wajib dipilih.",
      });
    }

    if (!effectiveDate) {
      return swal.fire({
        icon: "warning",
        title: "Data Belum Lengkap",
        text: "Tanggal efektif wajib diisi.",
      });
    }

    if (!openingBalance) {
      return swal.fire({
        icon: "warning",
        title: "Data Belum Lengkap",
        text: "Opening Balance wajib diisi.",
      });
    }

    try {
      setLoading(true);
      await onSave({
        id_account: Number(idAccount),
        effective_date: effectiveDate,
        opening_balance: Number(openingBalance.replace(/\./g, "")),
        notes: notes.trim() || null,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-border bg-card shadow-modal"
      >
        {/* Header */}

        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-secondary">
              Tambah Opening Balance
            </h2>

            <p className="text-sm text-muted">
              Tambahkan opening balance secara manual.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 transition text-secondary hover:bg-primary hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}

        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 space-y-5 overflow-y-auto p-5">
            {/* Account */}

            <div>
              <label className="mb-2 block text-sm font-medium text-text">
                Account
              </label>

              {loadingAccount ? (
                <div className="flex h-[50px] items-center rounded-lg border border-border bg-surface px-4">
                  <Loading.Inline text="Memuat account..." />
                </div>
              ) : (
                <select
                  value={idAccount}
                  onChange={(e) => setIdAccount(e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text outline-none transition focus:border-primary"
                >
                  <option value="">Pilih Account</option>

                  {accounts.map((account) => (
                    <option key={account.id_account} value={account.id_account}>
                      {account.account_name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Effective Date */}

            <div>
              <label className="mb-2 block text-sm font-medium text-text">
                Tanggal Efektif
              </label>

              <input
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text outline-none transition focus:border-primary"
              />
            </div>
            {/* Opening Balance */}

            <div>
              <label className="mb-2 block text-sm font-medium text-text">
                Opening Balance
              </label>

              <div className="flex overflow-hidden rounded-lg border border-border bg-surface transition focus-within:border-primary">
                <div className="flex items-center border-r border-border bg-card px-4 font-medium text-muted">
                  Rp
                </div>

                <input
                  type="text"
                  value={openingBalance}
                  onChange={handleBalanceChange}
                  placeholder="0"
                  className="flex-1 bg-transparent px-4 py-3 text-text outline-none"
                />
              </div>
            </div>

            {/* Notes */}

            <div>
              <label className="mb-2 block text-sm font-medium text-text">
                Catatan
              </label>

              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Masukkan catatan (opsional)"
                className="w-full resize-none rounded-lg border border-border bg-surface px-4 py-3 text-text outline-none transition focus:border-primary"
              />
            </div>
          </div>

          {/* Footer */}

          <div className="flex justify-end gap-3 border-t border-border px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-border bg-surface px-5 py-2 font-medium text-text transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex min-w-[170px] items-center justify-center rounded-lg bg-primary px-5 py-2 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? <Loading.Button text="Menyimpan..." /> : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OpeningBalanceAddModal;
