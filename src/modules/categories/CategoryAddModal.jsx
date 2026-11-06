import { useEffect, useState } from "react";
import { X } from "lucide-react";

import notify from "../../lib/notify";

import Loading from "../../components/Loading";

const CategoryAddModal = ({ open, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!open) return;

    setName("");
    setDescription("");
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!name.trim()) {
      return notify.fire({
        icon: "warning",
        title: "Data Belum Lengkap",
        text: "Nama kategori wajib diisi.",
      });
    }

    try {
      setLoading(true);

      await onSave({
        name: name.trim(),
        description: description.trim() || null,
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
              Tambah Kategori
            </h2>

            <p className="text-sm text-neutral-600">
              Tambahkan kategori transaksi baru.
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
            {/* Nama */}

            <div>
              <label className="mb-2 block text-sm font-medium text-ink">
                Nama Kategori
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama kategori"
                className="rounded-2xl bg-white/70 ring-1 ring-ink/8 focus:ring-2 focus:ring-primary-500 w-full px-4 py-3 text-ink outline-none transition"
              />
            </div>

            {/* Deskripsi */}

            <div>
              <label className="mb-2 block text-sm font-medium text-ink">
                Deskripsi
              </label>

              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Masukkan deskripsi kategori (opsional)"
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
              className="flex min-w-[150px] items-center justify-center rounded-full glass-primary px-5 py-2 font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <Loading.Button text="Menyimpan..." />
              ) : (
                "Simpan Kategori"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryAddModal;
