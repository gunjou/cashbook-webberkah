// import { useEffect, useRef, useState } from "react";
import { useEffect, useState } from "react";

// import {
//   Download,
//   ChevronDown,
//   FileSpreadsheet,
//   FileText,
//   Pencil,
//   Plus,
//   Search,
//   Trash2,
// } from "lucide-react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";

import MainLayout from "../../layouts/MainLayout";
import Loading from "../../components/Loading";
import swal from "../../lib/swal";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "./category.service";
import CategoryAddModal from "./CategoryAddModal";
import CategoryEditModal from "./CategoryEditModal";
// import { getUser } from "../auth/auth.service";

const CategoryPage = () => {
  // const user = getUser();

  // const exportRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  // const [openExport, setOpenExport] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (exportRef.current && !exportRef.current.contains(event.target)) {
  //       setOpenExport(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);

  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const data = await getCategories();

      setCategories(data);
    } catch (error) {
      swal.fire({
        icon: "error",
        title: "Gagal Memuat Data",
        text: error.response?.data?.message ?? "Terjadi kesalahan.",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter((item) => {
    const keyword = search.toLowerCase();

    return (
      item.name.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword)
    );
  });

  // const handleExportPDF = () => {
  //   console.log("Export PDF");

  //   setOpenExport(false);
  // };

  // const handleExportExcel = () => {
  //   console.log("Export Excel");

  //   setOpenExport(false);
  // };

  const handleCreate = async (payload) => {
    try {
      await createCategory(payload);

      setShowAddModal(false);

      await fetchCategories();

      swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Kategori berhasil ditambahkan.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.message ?? "Terjadi kesalahan.",
      });
    }
  };

  const handleUpdate = async (payload) => {
    try {
      await updateCategory(editingCategoryId, payload);

      setEditingCategoryId(null);

      await fetchCategories();

      swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Kategori berhasil diperbarui.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.message ?? "Terjadi kesalahan.",
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await swal.fire({
      icon: "warning",
      title: "Hapus Kategori",
      text: "Kategori akan dihapus secara permanen.",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteCategory(id);

      await fetchCategories();

      swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Kategori berhasil dihapus.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.message ?? "Terjadi kesalahan.",
      });
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 p-6">
        {/* Header */}

        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h1 className="text-3xl font-bold text-secondary">Kategori</h1>

            <p className="mt-1 text-muted">
              Kelola seluruh kategori transaksi perusahaan.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Export */}

            {/* <div ref={exportRef} className="relative">
              <button
                onClick={() => setOpenExport((prev) => !prev)}
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-text transition hover:bg-primary/15"
              >
                <Download size={18} />
                Export
                <ChevronDown
                  size={16}
                  className={`transition duration-200 ${
                    openExport ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openExport && (
                <div className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-xl border border-border bg-card shadow-card lg:left-0 lg:right-auto">
                  <button
                    onClick={handleExportPDF}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-text transition hover:bg-red-500/10 hover:text-red-600"
                  >
                    <FileText size={18} />
                    Export PDF
                  </button>

                  <button
                    onClick={handleExportExcel}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-text transition hover:bg-green-500/10 hover:text-green-600"
                  >
                    <FileSpreadsheet size={18} />
                    Export Excel
                  </button>
                </div>
              )}
            </div> */}

            {/* Add */}

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-3 font-semibold text-white transition hover:opacity-90"
            >
              <Plus size={18} />
              Tambah Kategori
            </button>
          </div>
        </div>

        {/* Search */}

        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          />

          <input
            type="text"
            placeholder="Cari kategori..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-card py-3 pl-11 pr-4 text-text outline-none transition focus:border-primary"
          />
        </div>

        {/* Desktop Table */}

        <div className="hidden overflow-hidden rounded-xl border border-border bg-card shadow-card lg:block">
          <table className="w-full">
            <thead className="bg-secondary text-white">
              <tr>
                <th className="w-20 px-5 py-3 text-center text-md font-semibold">
                  No
                </th>

                <th className="px-5 py-3 text-left text-md font-semibold">
                  Nama Kategori
                </th>

                <th className="px-5 py-3 text-left text-md font-semibold">
                  Deskripsi
                </th>

                <th className="w-36 px-5 py-3 text-center text-md font-semibold">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4}>
                    <div className="flex justify-center py-12">
                      <Loading.Data text="Memuat kategori..." />
                    </div>
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-muted">
                    Belum ada kategori.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category, index) => (
                  <tr
                    key={category.id_category}
                    className="border-t border-border transition"
                  >
                    <td className="px-5 py-2 text-center">{index + 1}</td>

                    <td className="px-5 py-2 font-medium text-secondary">
                      {category.name}
                    </td>

                    <td className="max-w-xl truncate px-5 py-2 text-text">
                      {category.description}
                    </td>

                    <td
                      className="px-5 py-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() =>
                            setEditingCategoryId(category.id_category)
                          }
                          className="rounded-lg p-2 text-text transition hover:bg-primary hover:text-white"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() => handleDelete(category.id_category)}
                          className="rounded-lg p-2 text-red-600 transition hover:bg-red-500/10"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Mobile Card */}

        <div className="space-y-4 lg:hidden">
          {loading ? (
            <div className="rounded-xl border border-border bg-card p-6 text-center text-muted shadow-card">
              <Loading.Data text="Memuat kategori..." />
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-6 text-center text-muted shadow-card">
              Belum ada kategori.
            </div>
          ) : (
            filteredCategories.map((category) => (
              <div
                key={category.id_category}
                className="rounded-xl border border-border bg-card p-4 shadow-card transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-secondary">
                      {category.name}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-text">
                      {category.description}
                    </p>
                  </div>
                </div>

                <div
                  className="mt-5 flex justify-end gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setEditingCategoryId(category.id_category)}
                    className="rounded-lg p-2 text-text transition hover:bg-primary/15"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => handleDelete(category.id_category)}
                    className="rounded-lg p-2 text-red-600 transition hover:bg-red-500/10"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add */}

      <CategoryAddModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleCreate}
      />

      {/* Edit */}

      {editingCategoryId && (
        <CategoryEditModal
          categoryId={editingCategoryId}
          onClose={() => setEditingCategoryId(null)}
          onSave={handleUpdate}
        />
      )}
    </MainLayout>
  );
};

export default CategoryPage;
