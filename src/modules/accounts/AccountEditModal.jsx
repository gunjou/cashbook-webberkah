import { useEffect, useState } from "react";
import { X } from "lucide-react";

import swal from "../../lib/swal";
import { getAccountDetail } from "./account.service";
import Loading from "../../components/Loading";

const AccountEditModal = ({ accountId, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [accountName, setAccountName] = useState("");
  const [accountKind, setAccountKind] = useState("CASH");

  const [bankName, setBankName] = useState("");
  const [accountType, setAccountType] = useState("");
  const [branchName, setBranchName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");

  useEffect(() => {
    if (!accountId) return;

    fetchAccount();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId]);

  const fetchAccount = async () => {
    try {
      setFetching(true);

      const data = await getAccountDetail(accountId);

      setAccountName(data.account_name);
      setAccountKind(data.account_kind);

      setBankName(data.bank_name ?? "");
      setAccountType(data.account_type ?? "");
      setBranchName(data.branch_name ?? "");
      setAccountNumber(data.account_number ?? "");
      setAccountHolder(data.account_holder ?? "");
    } catch (error) {
      onClose();

      swal.fire({
        icon: "error",
        title: "Gagal Memuat Data",
        text: error.response?.data?.message ?? "Terjadi kesalahan.",
      });
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!accountName) {
      return swal.fire({
        icon: "warning",
        title: "Data Belum Lengkap",
        text: "Nama Account wajib diisi.",
      });
    }

    if (
      accountKind === "BANK" &&
      (!bankName || !accountNumber || !accountHolder)
    ) {
      return swal.fire({
        icon: "warning",
        title: "Data Belum Lengkap",
        text: "Data rekening bank wajib diisi.",
      });
    }

    if (accountKind === "EWALLET" && (!accountNumber || !accountHolder)) {
      return swal.fire({
        icon: "warning",
        title: "Data Belum Lengkap",
        text: "Data E-Wallet wajib diisi.",
      });
    }

    try {
      setLoading(true);

      await onSave(accountId, {
        account_name: accountName,
        account_kind: accountKind,
        bank_name: bankName || null,
        account_type: accountType || null,
        branch_name: branchName || null,
        account_number: accountNumber || null,
        account_holder: accountHolder || null,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!accountId) return null;

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
            <h2 className="text-lg font-bold text-secondary">Edit Account</h2>

            <p className="text-sm text-muted">Perbarui informasi account.</p>
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
          <div className="flex-1 overflow-y-auto p-5">
            {fetching ? (
              <div className="flex h-full items-center justify-center py-16">
                <Loading.Data text="Memuat data..." />
              </div>
            ) : (
              <div className="space-y-5">
                {/* Nama Account */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-text">
                    Nama Account
                  </label>

                  <input
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="Masukkan nama account"
                    className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text outline-none transition focus:border-primary"
                  />
                </div>

                {/* Jenis Account */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-text">
                    Jenis Account
                  </label>

                  <select
                    value={accountKind}
                    onChange={(e) => setAccountKind(e.target.value)}
                    className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text outline-none transition focus:border-primary"
                  >
                    <option value="CASH">Cash</option>
                    <option value="BANK">Bank</option>
                    <option value="EWALLET">E-Wallet</option>
                  </select>
                </div>

                {/* Informasi Bank */}

                {accountKind === "BANK" && (
                  <>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-text">
                        Nama Bank
                      </label>

                      <input
                        type="text"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="Contoh: Bank Mandiri"
                        className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text outline-none transition focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-text">
                        Jenis Rekening
                      </label>

                      <select
                        value={accountType}
                        onChange={(e) => setAccountType(e.target.value)}
                        className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text outline-none transition focus:border-primary"
                      >
                        <option value="">Pilih Jenis Rekening</option>
                        <option value="TABUNGAN">Tabungan</option>
                        <option value="TABUNGAN_BISNIS">Tabungan Bisnis</option>
                        <option value="GIRO">Giro</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-text">
                        Cabang
                      </label>

                      <input
                        type="text"
                        value={branchName}
                        onChange={(e) => setBranchName(e.target.value)}
                        placeholder="Contoh: Gerung"
                        className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text outline-none transition focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-text">
                        Nomor Rekening
                      </label>

                      <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="Masukkan nomor rekening"
                        className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text outline-none transition focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-text">
                        Pemilik Rekening
                      </label>

                      <input
                        type="text"
                        value={accountHolder}
                        onChange={(e) => setAccountHolder(e.target.value)}
                        placeholder="Masukkan nama pemilik rekening"
                        className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text outline-none transition focus:border-primary"
                      />
                    </div>
                  </>
                )}

                {/* Informasi E-Wallet */}

                {accountKind === "EWALLET" && (
                  <>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-text">
                        Nomor E-Wallet
                      </label>

                      <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="Masukkan nomor E-Wallet"
                        className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text outline-none transition focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-text">
                        Pemilik Account
                      </label>

                      <input
                        type="text"
                        value={accountHolder}
                        onChange={(e) => setAccountHolder(e.target.value)}
                        placeholder="Masukkan nama pemilik"
                        className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-text outline-none transition focus:border-primary"
                      />
                    </div>
                  </>
                )}
              </div>
            )}
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
              disabled={loading || fetching}
              className="flex min-w-[170px] items-center justify-center rounded-lg bg-primary px-5 py-2 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <Loading.Button text="Menyimpan..." />
              ) : (
                "Simpan Perubahan"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountEditModal;
