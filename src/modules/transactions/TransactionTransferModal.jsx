import { useEffect, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";

import swal from "../../lib/swal";
import Loading from "../../components/Loading";

import {
  getAccountDropdown,
  getCategoryDropdown,
  transferBetweenAccounts,
} from "./transaction.service";

import { formatCurrencyInput, parseCurrencyInput } from "../../utils/currency";

const defaultFee = {
  id_category: "",
  amount: "",
  description: "",
};

const defaultForm = {
  id_from_account: "",
  id_to_account: "",
  transfer_type: "TRANSFER",
  amount: "",
  transaction_date: "",
  reference_number: "",
  description: "",
};

const getInitialForm = () => ({
  ...defaultForm,
  transaction_date: new Date().toISOString().split("T")[0],
});

const TransactionTransferModal = ({ open, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [loadingDropdown, setLoadingDropdown] = useState(false);

  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState(getInitialForm);
  const [fees, setFees] = useState([]);

  // ==========================
  // Reset Form
  // ==========================

  const resetForm = () => {
    setForm(getInitialForm());
    setFees([]);
  };

  // ==========================
  // Fetch Dropdown
  // ==========================

  const fetchDropdown = async () => {
    try {
      setLoadingDropdown(true);

      const [accountData, categoryData] = await Promise.all([
        getAccountDropdown(),
        getCategoryDropdown(),
      ]);

      setAccounts(accountData ?? []);
      setCategories(categoryData ?? []);
    } catch (error) {
      swal.fire({
        icon: "error",
        title: "Gagal Memuat Data",
        text:
          error.response?.data?.message ??
          "Terjadi kesalahan saat memuat data.",
      });

      onClose?.();
    } finally {
      setLoadingDropdown(false);
    }
  };

  // ==========================
  // Modal Open Effect
  // ==========================

  useEffect(() => {
    if (!open) return;

    resetForm();
    fetchDropdown();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // ==========================
  // Form Handler
  // ==========================

  const updateForm = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAmountChange = (value) => {
    updateForm("amount", formatCurrencyInput(value));
  };

  // ==========================
  // Fee Handler
  // ==========================

  const addFee = () => {
    setFees((prev) => [
      ...prev,
      {
        ...defaultFee,
      },
    ]);
  };

  const removeFee = (index) => {
    setFees((prev) => prev.filter((_, i) => i !== index));
  };

  const updateFee = (index, field, value) => {
    setFees((prev) =>
      prev.map((fee, i) => {
        if (i !== index) return fee;

        return {
          ...fee,
          [field]: field === "amount" ? formatCurrencyInput(value) : value,
        };
      }),
    );
  };

  // ==========================
  // Validation Helper
  // ==========================

  const showValidationError = (text) => {
    swal.fire({
      icon: "warning",
      title: "Data Belum Lengkap",
      text,
    });
  };

  // ==========================
  // Validate Form
  // ==========================

  const validateForm = () => {
    if (!form.id_from_account) {
      showValidationError("Account asal wajib dipilih.");
      return false;
    }

    if (!form.id_to_account) {
      showValidationError("Account tujuan wajib dipilih.");
      return false;
    }

    if (form.id_from_account === form.id_to_account) {
      swal.fire({
        icon: "warning",
        title: "Account Tidak Valid",
        text: "Account asal dan account tujuan tidak boleh sama.",
      });

      return false;
    }

    if (!form.transaction_date) {
      showValidationError("Tanggal transfer wajib diisi.");
      return false;
    }

    if (!form.amount) {
      showValidationError("Nominal transfer wajib diisi.");
      return false;
    }

    if (parseCurrencyInput(form.amount) <= 0) {
      swal.fire({
        icon: "warning",
        title: "Nominal Tidak Valid",
        text: "Nominal transfer harus lebih dari 0.",
      });

      return false;
    }

    if (!form.description.trim()) {
      showValidationError("Deskripsi transfer wajib diisi.");
      return false;
    }

    // ==========================
    // Validate Fees
    // ==========================

    for (let i = 0; i < fees.length; i++) {
      const fee = fees[i];

      if (!fee.id_category) {
        showValidationError(`Kategori pada Biaya #${i + 1} wajib dipilih.`);

        return false;
      }

      if (!fee.amount) {
        showValidationError(`Nominal pada Biaya #${i + 1} wajib diisi.`);

        return false;
      }

      if (parseCurrencyInput(fee.amount) <= 0) {
        swal.fire({
          icon: "warning",
          title: "Nominal Tidak Valid",
          text: `Nominal pada Biaya #${i + 1} harus lebih dari 0.`,
        });

        return false;
      }

      if (!fee.description.trim()) {
        showValidationError(`Deskripsi pada Biaya #${i + 1} wajib diisi.`);

        return false;
      }
    }

    return true;
  };

  // ==========================
  // Submit
  // ==========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading || loadingDropdown) return;

    if (!validateForm()) return;

    try {
      setLoading(true);

      await transferBetweenAccounts({
        ...form,

        id_from_account: Number(form.id_from_account),
        id_to_account: Number(form.id_to_account),

        amount: parseCurrencyInput(form.amount),

        fees: fees.map((fee) => ({
          id_category: Number(fee.id_category),
          amount: parseCurrencyInput(fee.amount),
          description: fee.description.trim(),
        })),
      });

      await swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Transfer berhasil dilakukan.",
        timer: 1500,
        showConfirmButton: false,
      });

      onSuccess?.();
      resetForm();
      onClose?.();
    } catch (error) {
      swal.fire({
        icon: "error",
        title: "Transfer Gagal",
        text:
          error.response?.data?.message ??
          "Terjadi kesalahan saat melakukan transfer.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Close Handler
  // ==========================

  const handleClose = () => {
    if (loading) return;

    resetForm();
    onClose?.();
  };

  // Jangan render apapun jika modal tidak terbuka
  if (!open) return null;

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-modal"
      >
        {/* ==========================
            Header
        ========================== */}

        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-secondary">
              Transfer Antar Account
            </h2>

            <p className="text-sm text-muted">
              Transfer saldo antar account beserta biaya tambahan.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="rounded-full p-2 text-secondary transition hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* ==========================
            Body
        ========================== */}

        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 space-y-5 overflow-y-auto p-5">
            {loadingDropdown ? (
              <Loading.Data text="Memuat data..." />
            ) : (
              <>
                {/* Account Asal */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-text">
                    Account Asal
                  </label>

                  <select
                    value={form.id_from_account}
                    onChange={(e) =>
                      updateForm("id_from_account", e.target.value)
                    }
                    className="w-full rounded-lg border border-border bg-surface px-4 py-3 outline-none transition focus:border-primary"
                  >
                    <option value="">Pilih Account</option>

                    {accounts.map((account) => (
                      <option
                        key={account.id_account}
                        value={account.id_account}
                      >
                        {account.account_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Account Tujuan */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-text">
                    Account Tujuan
                  </label>

                  <select
                    value={form.id_to_account}
                    onChange={(e) =>
                      updateForm("id_to_account", e.target.value)
                    }
                    className="w-full rounded-lg border border-border bg-surface px-4 py-3 outline-none transition focus:border-primary"
                  >
                    <option value="">Pilih Account</option>

                    {accounts.map((account) => (
                      <option
                        key={account.id_account}
                        value={account.id_account}
                      >
                        {account.account_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Transfer Type */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-text">
                    Jenis Transfer
                  </label>

                  <select
                    value={form.transfer_type}
                    onChange={(e) =>
                      updateForm("transfer_type", e.target.value)
                    }
                    className="w-full rounded-lg border border-border bg-surface px-4 py-3 outline-none transition focus:border-primary"
                  >
                    <option value="TRANSFER">Transfer</option>
                    <option value="CASH_WITHDRAWAL">Tarik Tunai</option>
                    <option value="CASH_DEPOSIT">Setor Tunai</option>
                  </select>
                </div>

                {/* Date */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-text">
                    Tanggal Transfer
                  </label>

                  <input
                    type="date"
                    value={form.transaction_date}
                    onChange={(e) =>
                      updateForm("transaction_date", e.target.value)
                    }
                    className="w-full rounded-lg border border-border bg-surface px-4 py-3 outline-none transition focus:border-primary"
                  />
                </div>

                {/* Amount */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-text">
                    Nominal Transfer
                  </label>

                  <div className="flex overflow-hidden rounded-lg border border-border bg-surface transition focus-within:border-primary">
                    <div className="flex items-center border-r border-border bg-card px-4 font-medium text-muted">
                      Rp
                    </div>

                    <input
                      type="text"
                      value={form.amount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      placeholder="0"
                      className="flex-1 bg-transparent px-4 py-3 outline-none"
                    />
                  </div>
                </div>

                {/* Reference */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-text">
                    Nomor Referensi
                  </label>

                  <input
                    type="text"
                    value={form.reference_number}
                    onChange={(e) =>
                      updateForm("reference_number", e.target.value)
                    }
                    placeholder="Masukkan nomor referensi"
                    className="w-full rounded-lg border border-border bg-surface px-4 py-3 outline-none transition focus:border-primary"
                  />
                </div>

                {/* Description */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-text">
                    Deskripsi
                  </label>

                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => updateForm("description", e.target.value)}
                    placeholder="Masukkan deskripsi transfer"
                    className="w-full resize-none rounded-lg border border-border bg-surface px-4 py-3 outline-none transition focus:border-primary"
                  />
                </div>

                {/* Fee Header */}

                <div className="flex items-center justify-between border-t border-border pt-4">
                  <div>
                    <h3 className="font-semibold text-secondary">
                      Biaya Tambahan
                    </h3>

                    <p className="text-sm text-muted">Opsional</p>
                  </div>

                  <button
                    type="button"
                    onClick={addFee}
                    disabled={loading}
                    className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm transition hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Plus size={16} />
                    Tambah
                  </button>
                </div>

                {/* Fee List */}

                {fees.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border bg-surface px-4 py-8 text-center text-sm text-muted">
                    Belum ada biaya tambahan.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {fees.map((fee, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-border bg-surface p-4"
                      >
                        {/* Fee Header */}

                        <div className="mb-4 flex items-center justify-between">
                          <h4 className="font-medium text-secondary">
                            Biaya #{index + 1}
                          </h4>

                          <button
                            type="button"
                            onClick={() => removeFee(index)}
                            disabled={loading}
                            className="rounded-lg p-2 text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        {/* Category */}

                        <div className="mb-4">
                          <label className="mb-2 block text-sm font-medium text-text">
                            Kategori
                          </label>

                          <select
                            value={fee.id_category}
                            onChange={(e) =>
                              updateFee(index, "id_category", e.target.value)
                            }
                            className="w-full rounded-lg border border-border bg-card px-4 py-3 outline-none transition focus:border-primary"
                          >
                            <option value="">Pilih Kategori</option>

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

                        {/* Amount */}

                        <div className="mb-4">
                          <label className="mb-2 block text-sm font-medium text-text">
                            Nominal
                          </label>

                          <div className="flex overflow-hidden rounded-lg border border-border bg-card transition focus-within:border-primary">
                            <div className="flex items-center border-r border-border px-4 font-medium text-muted">
                              Rp
                            </div>

                            <input
                              type="text"
                              value={fee.amount}
                              onChange={(e) =>
                                updateFee(index, "amount", e.target.value)
                              }
                              placeholder="0"
                              className="flex-1 bg-transparent px-4 py-3 outline-none"
                            />
                          </div>
                        </div>

                        {/* Description */}

                        <div>
                          <label className="mb-2 block text-sm font-medium text-text">
                            Deskripsi
                          </label>

                          <textarea
                            rows={2}
                            value={fee.description}
                            onChange={(e) =>
                              updateFee(index, "description", e.target.value)
                            }
                            placeholder="Contoh: Biaya admin transfer"
                            className="w-full resize-none rounded-lg border border-border bg-card px-4 py-3 outline-none transition focus:border-primary"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* ==========================
              Footer
          ========================== */}

          <div className="flex justify-end gap-3 border-t border-border px-5 py-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="rounded-lg border border-border bg-surface px-5 py-2 font-medium text-text transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={loading || loadingDropdown}
              className="flex min-w-[170px] items-center justify-center rounded-lg bg-primary px-5 py-2 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? <Loading.Button text="Memproses..." /> : "Transfer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionTransferModal;
