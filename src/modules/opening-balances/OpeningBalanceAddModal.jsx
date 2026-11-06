import { useEffect, useState } from "react";
import { X } from "lucide-react";

import notify from "../../lib/notify";
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
      notify.fire({
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
      return notify.fire({
        icon: "warning",
        title: "Data Belum Lengkap",
        text: "Account wajib dipilih.",
      });
    }

    if (!effectiveDate) {
      return notify.fire({
        icon: "warning",
        title: "Data Belum Lengkap",
        text: "Tanggal efektif wajib diisi.",
      });
    }

    if (!openingBalance) {
      return notify.fire({
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden panel-dialog rounded-card"
      >
        {/* Header */}

        <div className="flex items-center justify-between border-b border-primary-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-ink">
              Tambah Opening Balance
            </h2>

            <p className="text-sm text-neutral-600">
              Tambahkan opening balance secara manual.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 transition text-primary-strong hover:text-ink glass-button"
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
              <label className="mb-2 block text-sm font-medium text-ink">
                Account
              </label>

              {loadingAccount ? (
                <div className="flex h-[50px] items-center px-4 glass-inset rounded-2xl">
                  <Loading.Inline text="Memuat account..." />
                </div>
              ) : (
                <select
                  value={idAccount}
                  onChange={(e) => setIdAccount(e.target.value)}
                  className="rounded-2xl bg-white/70 ring-1 ring-ink/8 focus:ring-2 focus:ring-primary-500 w-full px-4 py-3 text-ink outline-none transition"
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
              <label className="mb-2 block text-sm font-medium text-ink">
                Tanggal Efektif
              </label>

              <input
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="rounded-2xl bg-white/70 ring-1 ring-ink/8 focus:ring-2 focus:ring-primary-500 w-full px-4 py-3 text-ink outline-none transition"
              />
            </div>
            {/* Opening Balance */}

            <div>
              <label className="mb-2 block text-sm font-medium text-ink">
                Opening Balance
              </label>

              <div className="flex overflow-hidden rounded-full transition focus-within:border-primary glass-button">
                <div className="flex items-center border-r border-primary-200 bg-primary-50 px-4 font-medium text-neutral-600">
                  Rp
                </div>

                <input
                  type="text"
                  value={openingBalance}
                  onChange={handleBalanceChange}
                  placeholder="0"
                  className="flex-1 bg-transparent px-4 py-3 text-ink outline-none"
                />
              </div>
            </div>

            {/* Notes */}

            <div>
              <label className="mb-2 block text-sm font-medium text-ink">
                Catatan
              </label>

              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Masukkan catatan (opsional)"
                className="rounded-2xl bg-white/70 ring-1 ring-ink/8 focus:ring-2 focus:ring-primary-500 w-full resize-none px-4 py-3 text-ink outline-none transition"
              />
            </div>
          </div>

          {/* Footer */}

          <div className="flex justify-end gap-3 border-t border-primary-200 px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-full px-5 py-2 font-medium text-ink transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-70 glass-button"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex min-w-[170px] items-center justify-center rounded-full glass-primary px-5 py-2 font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
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
