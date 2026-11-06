import { useEffect, useState } from "react";

import { X } from "lucide-react";

import notify from "../../lib/notify";
import Loading from "../../components/Loading";

const OpeningBalanceGenerateModal = ({ open, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);

  const [effectiveDate, setEffectiveDate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) return;

    resetForm();
  }, [open]);

  const resetForm = () => {
    setEffectiveDate(new Date().toISOString().slice(0, 10));
    setNotes("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!effectiveDate) {
      return notify.fire({
        icon: "warning",
        title: "Data Belum Lengkap",
        text: "Tanggal efektif wajib diisi.",
      });
    }

    try {
      setLoading(true);

      await onSave({
        effective_date: effectiveDate,
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
              Generate Opening Balance
            </h2>

            <p className="text-sm text-neutral-600">
              Generate opening balance berdasarkan saldo transaksi.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-primary-strong transition hover:text-ink glass-button"
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
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <p className="text-sm text-yellow-800">
                Generate Opening Balance akan membuat checkpoint saldo seluruh
                account berdasarkan transaksi sampai tanggal efektif yang
                dipilih.
              </p>
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

            {/* Notes */}

            <div>
              <label className="mb-2 block text-sm font-medium text-ink">
                Catatan
              </label>

              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Masukkan catatan checkpoint (opsional)"
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
              className="flex min-w-[170px] items-center justify-center rounded-full px-5 py-2 font-semibold transition disabled:cursor-not-allowed disabled:opacity-70 glass-button text-ink"
            >
              {loading ? <Loading.Button text="Generating..." /> : "Generate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OpeningBalanceGenerateModal;
