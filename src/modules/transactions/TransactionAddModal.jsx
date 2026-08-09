import { useEffect, useState } from "react";

import {
  ArrowDownLeft,
  ArrowUpRight,
  ImagePlus,
  Loader2,
  Save,
  X,
} from "lucide-react";

import Loading from "../../components/Loading";

import {
  createTransaction,
  getAccountDropdown,
  getCategoryDropdown,
  uploadAttachment,
} from "./transaction.service";

import { formatCurrencyInput, parseCurrencyInput } from "../../utils/currency";
import swal from "../../lib/swal";

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

const TransactionAddModal = ({ open, onClose, onSuccess }) => {
  /* ==========================
      State
  ========================== */

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const [attachmentFile, setAttachmentFile] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState("");

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

    return "border-border bg-surface focus:border-primary focus:ring-2 focus:ring-primary/10";
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
    if (!open) {
      return;
    }

    loadDropdown();
  }, [open]);

  useEffect(() => {
    return () => {
      if (attachmentPreview) {
        URL.revokeObjectURL(attachmentPreview);
      }
    };
  }, [attachmentPreview]);

  /* ==========================
    API
  ========================== */

  const loadDropdown = async () => {
    try {
      setLoading(true);

      const [accounts, categories] = await Promise.all([
        getAccountDropdown(),
        getCategoryDropdown(),
      ]);

      setAccounts(accounts);
      setCategories(categories);
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

  const handleUpload = ({ target }) => {
    const file = target.files?.[0];

    if (!file) return;

    if (attachmentPreview) {
      URL.revokeObjectURL(attachmentPreview);
    }

    setAttachmentFile(file);
    setAttachmentPreview(URL.createObjectURL(file));
  };

  const handleRemoveAttachment = () => {
    if (attachmentPreview) {
      URL.revokeObjectURL(attachmentPreview);
    }

    setAttachmentFile(null);
    setAttachmentPreview("");
  };

  const resetForm = () => {
    handleRemoveAttachment();

    setForm(initialForm);
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);

      let uploadedAttachmentUrl = "";

      if (attachmentFile) {
        const result = await uploadAttachment(attachmentFile);
        uploadedAttachmentUrl = result.url;
      }

      await createTransaction({
        ...form,
        amount: parseCurrencyInput(form.amount),
        attachment_url: uploadedAttachmentUrl,
      });

      resetForm();

      onSuccess?.();
      onClose?.();

      swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Transaksi berhasil ditambahkan.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.message ?? "Terjadi kesalahan.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose?.();
  };

  if (!open) return null;

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-modal"
      >
        {/* ==========================
          Header
        ========================== */}

        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-secondary">
              Tambah Transaksi
            </h2>

            <p className="mt-1 text-sm text-muted">
              Tambahkan transaksi baru ke dalam cashbook.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-2 transition hover:bg-surface"
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
                    <label className="mb-1.5 block text-sm font-medium text-secondary">
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
                    <label className="mb-1.5 block text-sm font-medium text-secondary">
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
                    <label className="mb-1.5 block text-sm font-medium text-secondary">
                      Jenis Transaksi
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <div className="grid grid-cols-2 rounded-xl border border-border bg-surface p-1">
                      <button
                        type="button"
                        onClick={() => handleTransactionType("IN")}
                        className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                          form.transaction_type === "IN"
                            ? "border border-primary bg-primary text-white font-semibold shadow-sm"
                            : "text-muted"
                        }`}
                      >
                        <ArrowDownLeft size={16} />
                        Pemasukan
                      </button>

                      <button
                        type="button"
                        onClick={() => handleTransactionType("OUT")}
                        className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                          form.transaction_type === "OUT"
                            ? "border border-rose bg-rose-400 text-white font-semibold shadow-sm"
                            : "text-muted"
                        }`}
                      >
                        <ArrowUpRight size={16} />
                        Pengeluaran
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-secondary">
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
                        : "border-border bg-surface"
                  }`}
                >
                  <div
                    className={`flex items-center px-4 text-base font-bold sm:px-5 sm:text-lg ${
                      form.amount
                        ? "bg-primary text-white"
                        : "border-r border-border bg-surface text-muted"
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
                  <label className=" block text-sm font-medium text-secondary">
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

                <div className="grid gap-4 lg:grid-cols-[1fr_1.3fr]">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-secondary">
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
                    <label className="block text-sm font-medium text-secondary">
                      Bukti Transaksi
                      <span className="ml-2 text-xs font-normal text-muted">
                        (Opsional)
                      </span>
                    </label>

                    {!attachmentFile ? (
                      <label className="flex h-[52px] cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-surface transition hover:border-primary hover:bg-primary/5">
                        <input
                          hidden
                          type="file"
                          accept="image/*"
                          onChange={handleUpload}
                        />

                        <ImagePlus size={18} className="text-primary" />

                        <span className="text-sm font-medium">Pilih Bukti</span>
                      </label>
                    ) : (
                      <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={attachmentPreview}
                            alt="Attachment"
                            className="h-12 w-12 shrink-0 rounded-lg border border-border object-cover"
                          />

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-secondary">
                              {attachmentFile.name}
                            </p>

                            <p className="text-xs text-muted">
                              {(attachmentFile.size / 1024).toFixed(1)} KB
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <label className="cursor-pointer rounded-md border border-border bg-white px-2.5 py-1 text-xs transition hover:bg-surface">
                              Ganti
                              <input
                                hidden
                                type="file"
                                accept="image/*"
                                onChange={handleUpload}
                              />
                            </label>

                            <button
                              type="button"
                              onClick={handleRemoveAttachment}
                              className="rounded-md border border-red-200 bg-white px-2.5 py-1 text-xs text-red-600 transition hover:bg-red-50"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ==========================
                    Footer
                ========================== */}

                <div className="flex flex-col gap-4 border-t border-border bg-card px-5 py-2.5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-xs text-muted">
                    <span className="font-semibold text-red-500">*</span> Wajib
                    diisi sebelum transaksi dapat disimpan.
                  </div>

                  <div className="flex w-full gap-3 sm:w-auto">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={saving}
                      className="flex-1 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                    >
                      Batal
                    </button>

                    <button
                      type="submit"
                      disabled={saving}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
                    >
                      {saving ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Menyimpan...
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
export default TransactionAddModal;
