import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { getAccountDetail } from "./account.service";
import { formatDateTime } from "../../lib/date";
import swal from "../../lib/swal";
import Loading from "../../components/Loading";

const AccountDetailModal = ({ accountId, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    if (!accountId) return;

    fetchAccount();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId]);

  const fetchAccount = async () => {
    try {
      setLoading(true);

      const data = await getAccountDetail(accountId);

      setAccount(data);
    } catch (error) {
      onClose();

      swal.fire({
        icon: "error",
        title: "Gagal Memuat Data",
        text: error.response?.data?.message ?? "Terjadi kesalahan.",
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
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-border bg-card shadow-modal lg:max-w-2xl"
      >
        {/* Header */}

        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-secondary">Detail Account</h2>

            <p className="text-sm text-muted">Informasi lengkap account.</p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 transition text-secondary hover:bg-primary hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}

        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex h-full min-h-[320px] flex-col items-center justify-center">
              <Loading.Data text="Memuat data..." />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Informasi Account */}

              <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
                  Informasi Account
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-1 sm:grid-cols-[150px_1fr] sm:gap-4">
                    <p className="text-sm text-muted">Nama Account</p>

                    <p className="font-medium text-text">
                      {account?.account_name}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-1 sm:grid-cols-[150px_1fr] sm:gap-4">
                    <p className="text-sm text-muted">Jenis</p>

                    <div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          account?.account_kind === "BANK"
                            ? "bg-primary text-white"
                            : "bg-secondary text-white"
                        }`}
                      >
                        {account?.account_kind}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-1 sm:grid-cols-[150px_1fr] sm:gap-4">
                    <p className="text-sm text-muted">Bank</p>

                    <p className="text-text">{account?.bank_name ?? "-"}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-1 sm:grid-cols-[150px_1fr] sm:gap-4">
                    <p className="text-sm text-muted">Tipe Account</p>

                    <p className="text-text">{account?.account_type ?? "-"}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-1 sm:grid-cols-[150px_1fr] sm:gap-4">
                    <p className="text-sm text-muted">Cabang</p>

                    <p className="text-text">{account?.branch_name ?? "-"}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-1 sm:grid-cols-[150px_1fr] sm:gap-4">
                    <p className="text-sm text-muted">No. Rekening</p>

                    <p className="break-all text-text">
                      {account?.account_number ?? "-"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-1 sm:grid-cols-[150px_1fr] sm:gap-4">
                    <p className="text-sm text-muted">Account Holder</p>

                    <p className="text-text">
                      {account?.account_holder ?? "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Audit */}

              <div className="rounded-xl border border-border bg-surface p-4">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
                  Informasi Audit
                </h3>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-1 sm:grid-cols-[130px_1fr] sm:gap-4">
                    <p className="text-sm text-muted">Created By</p>

                    <p className="text-text">{account?.created_by ?? "-"}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-1 sm:grid-cols-[130px_1fr] sm:gap-4">
                    <p className="text-sm text-muted">Created At</p>

                    <p className="text-text">
                      {formatDateTime(account?.created_at) ?? "-"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-1 sm:grid-cols-[130px_1fr] sm:gap-4">
                    <p className="text-sm text-muted">Updated By</p>

                    <p className="text-text">{account?.updated_by ?? "-"}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-1 sm:grid-cols-[130px_1fr] sm:gap-4">
                    <p className="text-sm text-muted">Updated At</p>

                    <p className="text-text">
                      {formatDateTime(account?.updated_at) ?? "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}

        <div className="flex justify-end border-t border-border px-5 py-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-primary px-5 py-2 font-semibold text-white transition hover:opacity-90"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountDetailModal;
