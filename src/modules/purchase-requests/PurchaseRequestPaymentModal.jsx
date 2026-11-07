import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Loader2,
  X,
} from "lucide-react";

import {
  getCashbookAccounts,
  getCashbookCategories,
} from "./purchase-request.service";
import AttachmentMultiInput from "../../components/AttachmentMultiInput";
import notify from "../../lib/notify";
import { formatCurrencyInput } from "../../utils/currency";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);
};

const formatToday = () => {
  const date = new Date();

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

const PurchaseRequestPaymentModal = ({
  open,
  data,
  loading = false,
  uploadProgress = null,
  onClose,
  onSubmit,
}) => {
  const [idAccount, setIdAccount] = useState("");
  const [idCategory, setIdCategory] = useState("");
  const [transactionDate, setTransactionDate] = useState(formatToday());
  const [additionalCost, setAdditionalCost] = useState("");

  const [attachmentFiles, setAttachmentFiles] = useState([]);

  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [masterLoading, setMasterLoading] = useState(false);

  const baseAmount = Number(data?.total_amount || 0);
  const additionalAmount = Number(additionalCost || 0);
  const [transactionDescription, setTransactionDescription] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");

  const totalAmount = useMemo(() => {
    return baseAmount + additionalAmount;
  }, [baseAmount, additionalAmount]);

  const namaPengaju =
    data?.pegawai?.nama_panggilan ||
    data?.pegawai?.nama_lengkap ||
    data?.nama_panggilan ||
    "Pengaju";

  const namaPekerjaan = data?.nama_pekerjaan || "Pengajuan";

  const generatedDescription = useMemo(() => {
    const description = `Pengajuan ${namaPengaju} - ${namaPekerjaan}`;

    if (additionalAmount > 0) {
      return `${description} + admin`;
    }

    return description;
  }, [namaPengaju, namaPekerjaan, additionalAmount]);

  useEffect(() => {
    if (!open) return;

    setTransactionDescription(generatedDescription);
  }, [open, generatedDescription]);

  /* ==========================
     LOAD MASTER
  ========================== */

  useEffect(() => {
    if (!open) return;

    const loadMaster = async () => {
      try {
        setMasterLoading(true);

        const [accountData, categoryData] = await Promise.all([
          getCashbookAccounts(),
          getCashbookCategories(),
        ]);

        setAccounts(accountData || []);
        setCategories(categoryData || []);
      } catch (error) {
        console.error("Load payment master error:", error);

        await notify.fire({
          icon: "error",
          title: "Gagal Memuat Data",
          text:
            error.response?.data?.message ||
            "Data account dan kategori gagal dimuat.",
        });

        onClose();
      } finally {
        setMasterLoading(false);
      }
    };

    loadMaster();
  }, [open, onClose]);

  /* ==========================
     RESET FORM
  ========================== */

  useEffect(() => {
    if (!open) return;

    setIdAccount("");
    setIdCategory("");
    setTransactionDate(formatToday());
    setAdditionalCost("");
    setAttachmentFiles([]);

    setTransactionDescription(
      `Pengajuan ${
        data?.pegawai?.nama_panggilan ||
        data?.pegawai?.nama_lengkap ||
        data?.nama_panggilan ||
        "Pengaju"
      } - ${data?.nama_pekerjaan || "Pengajuan"}`,
    );

    setReferenceNumber(data?.request_number || String(data?.id_request || ""));
  }, [open, data]);

  if (!open || !data) return null;

  /* ==========================
     SUBMIT
  ========================== */

  const handleSubmit = async () => {
    if (masterLoading) return;

    if (!idAccount) {
      notify.fire({
        icon: "warning",
        title: "Account Belum Dipilih",
        text: "Silakan pilih account pembayaran terlebih dahulu.",
      });

      return;
    }

    if (!idCategory) {
      notify.fire({
        icon: "warning",
        title: "Kategori Belum Dipilih",
        text: "Silakan pilih kategori transaksi terlebih dahulu.",
      });

      return;
    }

    if (!transactionDate) {
      notify.fire({
        icon: "warning",
        title: "Tanggal Belum Dipilih",
        text: "Silakan pilih tanggal pembayaran.",
      });

      return;
    }

    if (!referenceNumber.trim()) {
      await notify.fire({
        icon: "warning",
        title: "Reference Number Kosong",
        text: "Silakan isi reference number transaksi.",
      });
      return;
    }

    /* ==========================
       CONFIRM ADDITIONAL COST
    ========================== */

    if (!additionalCost || additionalAmount === 0) {
      const result = await notify.fire({
        icon: "question",
        title: "Tidak Ada Biaya Tambahan?",
        text: "Biaya tambahan masih kosong. Apakah memang tidak ada biaya admin atau biaya lainnya?",
        showCancelButton: true,
        confirmButtonText: "Ya, Tidak Ada",
        cancelButtonText: "Kembali",
      });

      if (!result.isConfirmed) return;
    }

    /* ==========================
       PAYMENT DATA
    ========================== */

    const paymentData = {
      id_request: data.id_request,
      id_account: Number(idAccount),
      id_category: Number(idCategory),
      transaction_date: transactionDate,
      transaction_type: "OUT",
      base_amount: baseAmount,
      additional_amount: additionalAmount,
      amount: totalAmount,
      transaction_description: transactionDescription.trim(),
      reference_number: referenceNumber.trim(),
      attachment_files: attachmentFiles,
    };

    onSubmit(paymentData);
  };

  const formLoading = loading || masterLoading;

  return (
    <div
      className="fixed inset-0 z-[65] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !formLoading) {
          onClose();
        }
      }}
    >
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden panel-dialog rounded-card">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-primary-200 px-5 py-4">
          <div className="min-w-0">
            <p className="text-sm font-black text-ink">Pembayaran Pengajuan</p>

            <p className="mt-1 truncate text-xs text-neutral-600">
              {data.request_number || `Pengajuan #${data.id_request}`}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={formLoading}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-neutral-600 transition-all hover:bg-primary-200 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {/* Request Summary */}
          <div className="p-4 rounded-2xl glass-inset">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[11px] font-black uppercase tracking-wider text-neutral-600">
                  Pengajuan
                </p>

                <p className="mt-1 truncate text-sm font-bold text-ink">
                  {namaPekerjaan}
                </p>

                <p className="mt-1 text-xs text-neutral-600">{namaPengaju}</p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-[11px] font-black uppercase tracking-wider text-neutral-600">
                  Nominal Pengajuan
                </p>

                <p className="mt-1 text-lg font-black text-ink">
                  {formatCurrency(baseAmount)}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="mt-5 space-y-4">
            {/* Account */}
            <div>
              <label className="mb-2 block text-sm font-medium text-primary-strong">
                Account Pembayaran
              </label>

              <select
                value={idAccount}
                onChange={(event) => setIdAccount(event.target.value)}
                disabled={formLoading}
                className="rounded-2xl bg-white/70 ring-1 ring-ink/8 focus:ring-2 focus:ring-primary-500 h-[46px] w-full px-3 text-sm text-ink outline-none transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">
                  {masterLoading ? "Memuat account..." : "Pilih account"}
                </option>

                {accounts.map((account) => (
                  <option key={account.id_account} value={account.id_account}>
                    {account.account_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-medium text-primary-strong">
                Kategori
              </label>

              <select
                value={idCategory}
                onChange={(event) => setIdCategory(event.target.value)}
                disabled={formLoading}
                className="rounded-2xl bg-white/70 ring-1 ring-ink/8 focus:ring-2 focus:ring-primary-500 h-[46px] w-full px-3 text-sm text-ink outline-none transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">
                  {masterLoading ? "Memuat kategori..." : "Pilih kategori"}
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id_category}
                    value={category.id_category}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Transaction Date */}
            <div>
              <label className="mb-2 block text-sm font-medium text-primary-strong">
                Tanggal Pembayaran
              </label>

              <div className="relative">
                <CalendarDays
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600"
                />

                <input
                  type="date"
                  value={transactionDate}
                  onChange={(event) => setTransactionDate(event.target.value)}
                  disabled={formLoading}
                  className="rounded-2xl bg-white/70 ring-1 ring-ink/8 focus:ring-2 focus:ring-primary-500 h-[46px] w-full pl-10 pr-3 text-sm text-ink outline-none transition disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="mb-2 block text-sm font-medium text-primary-strong">
                Reference Number
              </label>

              <input
                type="text"
                value={referenceNumber}
                onChange={(event) => setReferenceNumber(event.target.value)}
                disabled={formLoading}
                placeholder="Masukkan reference number"
                className="rounded-2xl bg-white/70 ring-1 ring-ink/8 focus:ring-2 focus:ring-primary-500 h-[46px] w-full px-3 text-sm text-ink outline-none transition disabled:cursor-not-allowed disabled:opacity-60"
              />

              <p className="mt-1 text-[11px] text-neutral-600">
                Reference number dibuat otomatis dari nomor pengajuan dan dapat
                disesuaikan.
              </p>
            </div>

            {/* Amount */}
            <div className="p-4 rounded-2xl glass-inset">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Nominal Pengajuan</span>

                <span className="text-sm font-semibold text-ink">
                  {formatCurrency(baseAmount)}
                </span>
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-primary-strong">
                  Biaya Tambahan
                  <span className="ml-2 text-xs font-normal text-neutral-600">
                    (Opsional)
                  </span>
                </label>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-600">
                    Rp
                  </span>

                  <input
                    type="text"
                    inputMode="numeric"
                    value={formatCurrencyInput(additionalCost)}
                    onChange={(event) => {
                      const numericValue = event.target.value.replace(
                        /\D/g,
                        "",
                      );

                      setAdditionalCost(numericValue);
                    }}
                    disabled={formLoading}
                    placeholder="0"
                    className="rounded-2xl bg-white/70 ring-1 ring-ink/8 focus:ring-2 focus:ring-primary-500 h-[46px] w-full pl-10 pr-3 text-sm text-ink outline-none transition disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <p className="mt-1 text-[11px] text-neutral-600">
                  Masukkan biaya admin bank atau biaya tambahan lainnya jika
                  ada.
                </p>
              </div>

              <div className="my-4 border-t border-primary-200" />

              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-ink">
                  Total Pembayaran
                </span>

                <span className="text-xl font-black text-primary">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-primary-strong">
                Deskripsi Transaksi
              </label>

              <input
                type="text"
                value={transactionDescription}
                onChange={(event) =>
                  setTransactionDescription(event.target.value)
                }
                disabled={formLoading}
                className="rounded-2xl bg-white/70 ring-1 ring-ink/8 focus:ring-2 focus:ring-primary-500 h-[46px] w-full px-3 text-sm text-ink outline-none transition disabled:cursor-not-allowed disabled:opacity-60"
              />

              <p className="mt-1 text-[11px] text-neutral-600">
                Deskripsi dibuat otomatis dan dapat disesuaikan sebelum
                pembayaran.
              </p>
            </div>

            {/* Payment Attachment */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary-strong">
                Bukti Pembayaran
                <span className="ml-2 text-xs font-normal text-neutral-600">
                  (Opsional)
                </span>
              </label>

              <AttachmentMultiInput
                files={attachmentFiles}
                onChange={setAttachmentFiles}
                uploadProgress={uploadProgress}
                disabled={formLoading}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-end gap-2 border-t border-primary-200 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={formLoading}
            className="rounded-full px-4 py-2.5 text-xs font-bold text-primary-strong transition hover:bg-primary-200 disabled:cursor-not-allowed disabled:opacity-50 glass-button"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={formLoading}
            className="flex items-center gap-2 rounded-full glass-primary px-5 py-2.5 text-xs font-black uppercase tracking-wider transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {formLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {masterLoading
                  ? "Memuat Data..."
                  : uploadProgress !== null && uploadProgress < 100
                    ? `Upload ${uploadProgress}%`
                    : "Memproses..."}
              </>
            ) : (
              <>
                <CheckCircle2 size={16} />
                Bayar Pengajuan
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseRequestPaymentModal;
