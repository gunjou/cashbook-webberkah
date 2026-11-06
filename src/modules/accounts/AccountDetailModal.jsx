import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { getAccountDetail } from "./account.service";
import { formatDateTime } from "../../lib/date";
import notify from "../../lib/notify";
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

      notify.fire({
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden lg:max-w-2xl panel-dialog rounded-card"
      >
        {/* Header */}

        <div className="flex items-center justify-between border-b border-primary-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-ink">Detail Account</h2>

            <p className="text-sm text-neutral-600">Informasi lengkap account.</p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 transition text-primary-strong hover:text-ink glass-button"
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
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-600">
                  Informasi Account
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-1 sm:grid-cols-[150px_1fr] sm:gap-4">
                    <p className="text-sm text-neutral-600">Nama Account</p>

                    <p className="font-medium text-ink">
                      {account?.account_name}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-1 sm:grid-cols-[150px_1fr] sm:gap-4">
                    <p className="text-sm text-neutral-600">Jenis</p>

                    <div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          account?.account_kind === "BANK"
                            ? "glass-primary"
                            : "bg-primary-100 text-ink"
                        }`}
                      >
                        {account?.account_kind}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-1 sm:grid-cols-[150px_1fr] sm:gap-4">
                    <p className="text-sm text-neutral-600">Bank</p>

                    <p className="text-ink">{account?.bank_name ?? "-"}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-1 sm:grid-cols-[150px_1fr] sm:gap-4">
                    <p className="text-sm text-neutral-600">Tipe Account</p>

                    <p className="text-ink">{account?.account_type ?? "-"}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-1 sm:grid-cols-[150px_1fr] sm:gap-4">
                    <p className="text-sm text-neutral-600">Cabang</p>

                    <p className="text-ink">{account?.branch_name ?? "-"}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-1 sm:grid-cols-[150px_1fr] sm:gap-4">
                    <p className="text-sm text-neutral-600">No. Rekening</p>

                    <p className="break-all text-ink">
                      {account?.account_number ?? "-"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-1 sm:grid-cols-[150px_1fr] sm:gap-4">
                    <p className="text-sm text-neutral-600">Account Holder</p>

                    <p className="text-ink">
                      {account?.account_holder ?? "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Audit */}

              <div className="p-4 rounded-2xl glass-inset">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-600">
                  Informasi Audit
                </h3>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-1 sm:grid-cols-[130px_1fr] sm:gap-4">
                    <p className="text-sm text-neutral-600">Created By</p>

                    <p className="text-ink">{account?.created_by ?? "-"}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-1 sm:grid-cols-[130px_1fr] sm:gap-4">
                    <p className="text-sm text-neutral-600">Created At</p>

                    <p className="text-ink">
                      {formatDateTime(account?.created_at) ?? "-"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-1 sm:grid-cols-[130px_1fr] sm:gap-4">
                    <p className="text-sm text-neutral-600">Updated By</p>

                    <p className="text-ink">{account?.updated_by ?? "-"}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-1 sm:grid-cols-[130px_1fr] sm:gap-4">
                    <p className="text-sm text-neutral-600">Updated At</p>

                    <p className="text-ink">
                      {formatDateTime(account?.updated_at) ?? "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}

        <div className="flex justify-end border-t border-primary-200 px-5 py-4">
          <button
            onClick={onClose}
            className="rounded-full glass-primary px-5 py-2 font-semibold transition hover:opacity-90"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountDetailModal;
