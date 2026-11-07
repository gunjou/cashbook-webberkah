import { useEffect, useState } from "react";

import {
  ArrowDownLeft,
  ArrowUpRight,
  Loader2,
  Save,
  X,
} from "lucide-react";

import Loading from "../../components/Loading";
import AttachmentMultiInput from "../../components/AttachmentMultiInput";

import {
  getAccountDropdown,
  getCategoryDropdown,
  getTransactionDetail,
  updateTransaction,
} from "./transaction.service";

import { uploadAttachments } from "../purchase-requests/purchase-request.service";

import { formatCurrencyInput, parseCurrencyInput } from "../../utils/currency";
import notify from "../../lib/notify";

/* ==========================
    Initial Form
========================== */

const initialForm = {
  id_account: "",
  id_category: "",
  transaction_date: new Date().toISOString().slice(0, 10),
  transaction_type: "OUT",
  amount: "",
  transaction_description: "",
  reference_number: "",
  attachment_url: "",
};

const TransactionEditModal = ({ open, idTransaction, onClose, onSuccess }) => {
  /* ==========================
      State
  ========================== */

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const [attachmentFiles, setAttachmentFiles] = useState([]);

  const [uploadProgress, setUploadProgress] = useState(null);

  /* ==========================
      Helper
  ========================== */
  const isFilled = (value) =>
    value !== "" && value !== null && value !== undefined;

  const getInputClass = (value, error = false) => {
    if (error) {
      return "border-red-500 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100";
    }
    if (isFilled(value)) {
      return "border-primary bg-primary/5 focus:border-primary focus:ring-2 focus:ring-primary/10";
    }

    return "border-primary-200 bg-white focus:border-primary focus:ring-2 focus:ring-primary/10";
  };

  const handleAmountChange = (e) => {
    setForm((prev) => ({
      ...prev,
      amount: formatCurrencyInput(e.target.value),
    }));

    if (errors.amount) {
      setErrors((prev) => ({
        ...prev,
        amount: "",
      }));
    }
  };

  const handleTransactionType = (type) => {
    setForm((prev) => ({
      ...prev,
      transaction_type: type,
    }));
  };

  /* ==========================
      Effect
  ========================== */
  useEffect(() => {
    if (!open || !idTransaction) return;

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, idTransaction]);

  /* ==========================
    API
  ========================== */

  const loadData = async () => {
    try {
      setLoading(true);

      const [accountData, categoryData, detail] = await Promise.all([
        getAccountDropdown(),
        getCategoryDropdown(),
        getTransactionDetail(idTransaction),
      ]);

      setAccounts(accountData);
      setCategories(categoryData);

      setForm({
        id_account: detail.account.id_account,
        id_category: detail.category.id_category,
        transaction_date: detail.transaction_date,
        transaction_type: detail.transaction_type,
        amount: formatCurrencyInput(detail.amount.toString()),
        transaction_description: detail.transaction_description,
        reference_number: detail.reference_number || "",
        attachment_url: detail.attachment_url || "",
      });

    } finally {
      setLoading(false);
    }
  };

  /* ==========================
    Validation
  ========================== */

  const validateForm = () => {
    const newErrors = {};

    if (!form.id_account) {
      newErrors.id_account = "Account wajib dipilih.";
    }

    if (!form.id_category) {
      newErrors.id_category = "Kategori wajib dipilih.";
    }

    if (!form.transaction_date) {
      newErrors.transaction_date = "Tanggal transaksi wajib diisi.";
    }

    if (!form.amount || parseCurrencyInput(form.amount) <= 0) {
      newErrors.amount = "Nominal wajib diisi.";
    }

    if (!form.transaction_description.trim()) {
      newErrors.transaction_description = "Deskripsi transaksi wajib diisi.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* ==========================
    Event
  ========================== */

  const handleChange = ({ target }) => {
    const { name, value } = target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  //   const resetForm = () => {
  //     setForm(initialForm);
  //     setErrors({});
  //   };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);

      let attachmentUrl = form.attachment_url;

      if (attachmentFiles.length) {
        attachmentUrl = await uploadAttachments(attachmentFiles, {
          onProgress: setUploadProgress,
        });
      }

      await updateTransaction(idTransaction, {
        ...form,
        amount: parseCurrencyInput(form.amount),
        attachment_url: attachmentUrl,
      });

      onSuccess?.();
      handleClose();
      notify.fire({
        icon: "success",
        title: "Berhasil",
        text: "Transaksi berhasil diupdate.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      notify.fire({
        icon: "error",
        title: "Gagal",
        text:
          error.response?.data?.message ??
          error.message ??
          "Terjadi kesalahan.",
      });
    } finally {
      setSaving(false);
      setUploadProgress(null);
    }
  };

  const handleClose = () => {
    setAttachmentFiles([]);

    setForm(initialForm);
    setErrors({});

    onClose?.();
  };

  if (!open) return null;

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-[55] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-3xl flex-col overflow-hidden panel-dialog rounded-card"
      >
        {/* ==========================
          Header
        ========================== */}

        <div className="flex items-center justify-between border-b border-primary-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-ink">
              Edit Transaksi
            </h2>

            <p className="mt-1 text-sm text-neutral-600">
              Menyesuaikan transaksi di cashbook.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-2 transition glass-button"
          >
            <X size={20} />
          </button>
        </div>

        {/* ==========================
          Body
        ========================== */}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex flex-1 flex-col"
        >
          <div className="max-h-[75vh] space-y-5 overflow-y-auto px-5 py-5">
            {loading ? (
              <Loading.Data text="Memuat data..." />
            ) : (
              <>
                {/* ==========================
                  Basic Information
                ========================== */}

                <div className="grid gap-4 lg:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-primary-strong">
                      Account
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <select
                      name="id_account"
                      value={form.id_account}
                      onChange={handleChange}
                      className={`w-full rounded-lg border px-3 py-2 outline-none transition ${getInputClass(
                        form.id_account,
                        errors.id_account,
                      )}`}
                    >
                      <option value="">Pilih Account</option>

                      {accounts.map((item) => (
                        <option key={item.id_account} value={item.id_account}>
                          {item.account_name}
                        </option>
                      ))}
                    </select>

                    {errors.id_account && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.id_account}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-primary-strong">
                      Kategori
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <select
                      name="id_category"
                      value={form.id_category}
                      onChange={handleChange}
                      className={`w-full rounded-lg border px-3 py-2 outline-none transition ${getInputClass(
                        form.id_category,
                        errors.id_category,
                      )}`}
                    >
                      <option value="">Pilih Kategori</option>

                      {categories.map((item) => (
                        <option key={item.id_category} value={item.id_category}>
                          {item.name}
                        </option>
                      ))}
                    </select>

                    {errors.id_category && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.id_category}
                      </p>
                    )}
                  </div>
                </div>

                {/* ==========================
                  Transaction Type & Date
                ========================== */}

                <div className="grid gap-4 lg:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-primary-strong">
                      Jenis Transaksi
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <div className="grid grid-cols-2 p-1 rounded-2xl glass-inset">
                      <button
                        type="button"
                        disabled
                        onClick={() => handleTransactionType("IN")}
                        className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                          form.transaction_type === "IN"
                            ? "border border-primary glass-primary font-semibold shadow-sm"
                            : "text-neutral-600"
                        }`}
                      >
                        <ArrowDownLeft size={16} />
                        Pemasukan
                      </button>

                      <button
                        type="button"
                        disabled
                        onClick={() => handleTransactionType("OUT")}
                        className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                          form.transaction_type === "OUT"
                            ? "border border-rose bg-rose-400 text-white font-semibold shadow-sm"
                            : "text-neutral-600"
                        }`}
                      >
                        <ArrowUpRight size={16} />
                        Pengeluaran
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-primary-strong">
                      Tanggal
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <input
                      type="date"
                      name="transaction_date"
                      value={form.transaction_date}
                      onChange={handleChange}
                      className={`w-full rounded-lg border px-3 py-2 outline-none transition ${getInputClass(
                        form.transaction_date,
                        errors.transaction_date,
                      )}`}
                    />

                    {errors.transaction_date && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.transaction_date}
                      </p>
                    )}
                  </div>
                </div>

                {/* ==========================
                  Amount
                ========================== */}

                <div
                  className={`flex overflow-hidden rounded-xl border-2 transition ${
                    errors.amount
                      ? "border-red-500 bg-red-50"
                      : form.amount
                        ? "border-primary bg-primary/5"
                        : "border-primary-200 bg-white"
                  }`}
                >
                  <div
                    className={`flex items-center px-4 text-base font-bold sm:px-5 sm:text-lg ${
                      form.amount
                        ? "glass-primary"
                        : "border-r border-primary-200 bg-white text-neutral-600"
                    }`}
                  >
                    Rp
                  </div>

                  <input
                    value={form.amount}
                    onChange={handleAmountChange}
                    placeholder="0"
                    className="min-w-0 flex-1 bg-transparent px-4 py-2 text-xl font-bold tracking-wide outline-none sm:text-2xl"
                  />
                </div>

                {/* ==========================
                  Description
                ========================== */}

                <div>
                  <label className="mb-1 block text-sm font-medium text-primary-strong">
                    Deskripsi
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <textarea
                    rows={1}
                    name="transaction_description"
                    value={form.transaction_description}
                    onChange={handleChange}
                    placeholder="Contoh: Pembayaran..."
                    className={`w-full resize-none rounded-lg border px-3 py-2 outline-none transition ${getInputClass(
                      form.transaction_description,
                      errors.transaction_description,
                    )}`}
                  />

                  {errors.transaction_description && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.transaction_description}
                    </p>
                  )}
                </div>

                {/* ==========================
                    Attachment & Reference
                ========================== */}

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-primary-strong">
                      Reference Number
                    </label>

                    <input
                      name="reference_number"
                      value={form.reference_number}
                      onChange={handleChange}
                      placeholder="Opsional"
                      className={`w-full rounded-lg border px-3 py-3 outline-none transition ${getInputClass(
                        form.reference_number,
                      )}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-primary-strong">
                      Bukti Transaksi
                      <span className="ml-2 text-xs font-normal text-neutral-600">
                        (Opsional)
                      </span>
                    </label>

                    <AttachmentMultiInput
                      files={attachmentFiles}
                      onChange={setAttachmentFiles}
                      savedUrl={form.attachment_url}
                      onRemoveSaved={() =>
                        setForm((prev) => ({ ...prev, attachment_url: "" }))
                      }
                      uploadProgress={uploadProgress}
                      disabled={saving}
                    />
                  </div>
                </div>

                {/* ==========================
                    Footer
                ========================== */}

                <div className="flex flex-col gap-4 border-t border-primary-200 px-5 py-2.5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-xs text-neutral-600">
                    <span className="font-semibold text-red-500">*</span> Wajib
                    diisi sebelum transaksi dapat disimpan.
                  </div>

                  <div className="flex w-full gap-3 sm:w-auto">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={saving}
                      className="flex-1 rounded-full px-4 py-2 text-sm font-medium transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none glass-button"
                    >
                      Batal
                    </button>

                    <button
                      type="submit"
                      disabled={saving}
                      className="flex flex-1 items-center justify-center gap-2 rounded-full glass-primary px-5 py-2 text-sm font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
                    >
                      {saving ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          {uploadProgress !== null && uploadProgress < 100
                            ? `Upload ${uploadProgress}%`
                            : "Menyimpan..."}
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          Simpan
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
export default TransactionEditModal;
