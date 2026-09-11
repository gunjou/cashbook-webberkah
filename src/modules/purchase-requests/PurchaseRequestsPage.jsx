import { useCallback, useEffect, useState } from "react";
import { Download, History, List } from "lucide-react";

import MainLayout from "../../layouts/MainLayout";
import swal from "../../lib/swal";

import PurchaseRequestFilter from "./PurchaseRequestFilter";
import PurchaseRequestTable from "./PurchaseRequestTable";

import {
  createCashbookTransaction,
  getDepartments,
  getPurchaseRequestDetail,
  getPurchaseRequestHistory,
  getPurchaseRequests,
  payPurchaseRequest,
  uploadAttachment,
} from "./purchase-request.service";
import PurchaseRequestDetailModal from "./PurchaseRequestDetailModal";
import PurchaseRequestAttachmentModal from "./PurchaseRequestAttachmentModal";
import PurchaseRequestPaymentModal from "./PurchaseRequestPaymentModal";
import { exportPurchaseRequestsPDF } from "../../reports/pdf/purchase-request.export";

const INITIAL_ACTIVE_FILTER = {
  status: "APPROVED",
  id_departemen: "",
  tanggal_mulai: "",
  tanggal_selesai: "",
};
const INITIAL_HISTORY_FILTER = {
  status: "PAID",
  id_departemen: "",
  tanggal_mulai: "",
  tanggal_selesai: "",
};

const PurchaseRequestsPage = () => {
  const [viewMode, setViewMode] = useState("ACTIVE");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "asc",
  });
  const [filter, setFilter] = useState(INITIAL_ACTIVE_FILTER);

  const [openDetail, setOpenDetail] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPaymentRequest, setSelectedPaymentRequest] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const [exportLoading, setExportLoading] = useState(false);

  const loadDepartments = useCallback(async () => {
    try {
      const result = await getDepartments();
      setDepartments(result || []);
    } catch (error) {
      console.error(error);
      swal.fire({
        icon: "error",
        title: "Gagal",
        text:
          error.response?.data?.message || "Gagal mengambil data departemen.",
      });
    }
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const params = { status: filter.status };

      if (filter.id_departemen) params.id_departemen = filter.id_departemen;
      if (filter.tanggal_mulai) params.tanggal_mulai = filter.tanggal_mulai;
      if (filter.tanggal_selesai)
        params.tanggal_selesai = filter.tanggal_selesai;

      const result =
        viewMode === "ACTIVE"
          ? await getPurchaseRequests(params)
          : await getPurchaseRequestHistory({
              ...params,
              page: 1,
              per_page: 10,
            });

      setData(viewMode === "ACTIVE" ? result || [] : result?.data || []);
    } catch (error) {
      console.error(error);
      setData([]);
      swal.fire({
        icon: "error",
        title: "Gagal Memuat Data",
        text:
          error.response?.data?.message ||
          "Terjadi kesalahan saat mengambil data pengajuan.",
      });
    } finally {
      setLoading(false);
    }
  }, [filter, viewMode]);

  useEffect(() => {
    loadDepartments();
  }, [loadDepartments]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const displayedData = [...data].sort((a, b) => {
    if (sortConfig.key === "priority") {
      const priorityOrder = { NORMAL: 1, URGENT: 2, TOP_URGENT: 3 };
      const result =
        (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
      return sortConfig.direction === "desc" ? result : -result;
    }

    const dateA = new Date(a.created_at || 0).getTime();
    const dateB = new Date(b.created_at || 0).getTime();

    return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
  });

  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "desc" ? "asc" : "desc",
    }));
  };

  const handleViewMode = () => {
    const nextMode = viewMode === "ACTIVE" ? "HISTORY" : "ACTIVE";

    setViewMode(nextMode);
    setData([]);
    setFilter(
      nextMode === "ACTIVE" ? INITIAL_ACTIVE_FILTER : INITIAL_HISTORY_FILTER,
    );
  };

  const handleResetFilter = () => {
    setFilter(
      viewMode === "ACTIVE" ? INITIAL_ACTIVE_FILTER : INITIAL_HISTORY_FILTER,
    );
  };

  const handleDetail = async (idRequest) => {
    try {
      setDetailLoading(true);
      setOpenDetail(true);
      setDetailData(null);

      const result = await getPurchaseRequestDetail(idRequest);

      setDetailData(result);
    } catch (error) {
      console.error(error);
      setOpenDetail(false);

      swal.fire({
        icon: "error",
        title: "Gagal Memuat Detail",
        text:
          error.response?.data?.message ||
          "Terjadi kesalahan saat mengambil detail pengajuan.",
      });
    } finally {
      setDetailLoading(false);
    }
  };

  const handleAttachment = (file) => {
    setAttachment(file);
  };

  const handleExportPDF = async () => {
    if (!displayedData.length) {
      await swal.fire({
        icon: "warning",
        title: "Tidak Ada Data",
        text: "Tidak ada data pengajuan yang dapat diexport.",
      });

      return;
    }

    const selectedDepartment = departments.find(
      (item) => String(item.id_departemen) === String(filter.id_departemen),
    );

    try {
      setExportLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 50));

      exportPurchaseRequestsPDF(displayedData, {
        filters: filter,
        sortField: sortConfig.key,
        sortDirection: sortConfig.direction,
        departmentName: selectedDepartment?.nama_departemen || "",
      });
    } catch (error) {
      console.error("Gagal export PDF:", error);

      await swal.fire({
        icon: "error",
        title: "Export Gagal",
        text: error?.message || "Gagal melakukan export PDF.",
      });
    } finally {
      setExportLoading(false);
    }
  };

  const handlePaid = (item) => {
    if (item.status !== "APPROVED") return;

    setSelectedPaymentRequest(item);
    setPaymentModalOpen(true);
  };

  const handlePaymentSubmit = async (paymentData) => {
    try {
      setPaymentLoading(true);

      let attachmentUrl = "";

      /* ==========================
       UPLOAD BUKTI PEMBAYARAN
    ========================== */

      if (paymentData.attachment_file) {
        const uploadResponse = await uploadAttachment(
          paymentData.attachment_file,
        );

        if (!uploadResponse?.status || !uploadResponse?.url) {
          throw new Error("Upload bukti pembayaran gagal.");
        }

        attachmentUrl = uploadResponse.url;
      }

      /* ==========================
       CREATE CASHBOOK TRANSACTION
    ========================== */

      await createCashbookTransaction({
        id_account: paymentData.id_account,
        id_category: paymentData.id_category,
        transaction_date: paymentData.transaction_date,
        transaction_type: "OUT",
        amount: paymentData.amount,
        transaction_description: paymentData.transaction_description,
        reference_number: paymentData.reference_number,
        attachment_url: attachmentUrl,
      });

      /* ==========================
       CHANGE REQUEST STATUS
       APPROVED → PAID
    ========================== */

      await payPurchaseRequest(paymentData.id_request);

      /* ==========================
       CLOSE MODAL
    ========================== */

      setPaymentModalOpen(false);
      setSelectedPaymentRequest(null);

      /* ==========================
       REFRESH LIST
    ========================== */

      await loadData();

      /* ==========================
       SUCCESS
    ========================== */

      setOpenDetail(false);

      await swal.fire({
        icon: "success",
        title: "Pembayaran Berhasil",
        text: "Transaksi berhasil dicatat dan pengajuan telah ditandai sebagai Paid.",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Payment error:", error);

      swal.fire({
        icon: "error",
        title: "Pembayaran Gagal",
        text:
          error.response?.data?.message ||
          error.message ||
          "Pembayaran gagal diproses.",
      });
    } finally {
      setPaymentLoading(false);
    }
  };

  //   const handleDummy = (message) => {
  //     swal.fire({
  //       icon: "info",
  //       title: "Segera Hadir",
  //       text: message,
  //       timer: 1200,
  //       showConfirmButton: false,
  //     });
  //   };

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary">
              {viewMode === "ACTIVE" ? "Pengajuan" : "History Pengajuan"}
            </h1>
            <p className="mt-2 text-muted">
              {viewMode === "ACTIVE"
                ? "Kelola dan monitor pengajuan pembelian perusahaan."
                : "Riwayat pengajuan pembelian perusahaan."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleExportPDF}
              disabled={exportLoading || loading || !displayedData.length}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-white shadow-soft transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {exportLoading ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download size={16} />
                  Export PDF
                </>
              )}
            </button>

            {/* <button
              type="button"
              onClick={() =>
                handleDummy(
                  "Fitur membuat pengajuan baru akan tersedia pada tahap berikutnya.",
                )
              }
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <Plus size={18} />
              Pengajuan Baru
            </button> */}

            <button
              type="button"
              onClick={handleViewMode}
              className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              {viewMode === "ACTIVE" ? (
                <>
                  <History size={18} /> History
                </>
              ) : (
                <>
                  <List size={18} /> Pengajuan Aktif
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filter */}

        <PurchaseRequestFilter
          filter={filter}
          setFilter={setFilter}
          departments={departments}
          onReset={handleResetFilter}
          viewMode={viewMode}
        />

        {/* Table */}

        <PurchaseRequestTable
          data={displayedData}
          loading={loading}
          sortConfig={sortConfig}
          onSort={handleSort}
          onDetail={handleDetail}
          onPaid={handlePaid}
        />
      </div>

      <PurchaseRequestDetailModal
        open={openDetail}
        data={detailData}
        loading={detailLoading}
        actionLoading={paymentLoading}
        onClose={() => {
          setOpenDetail(false);
          setDetailData(null);
        }}
        onAttachment={handleAttachment}
        onPaid={handlePaid}
      />

      <PurchaseRequestPaymentModal
        open={paymentModalOpen}
        data={selectedPaymentRequest}
        loading={paymentLoading}
        onClose={() => {
          if (paymentLoading) return;

          setPaymentModalOpen(false);
          setSelectedPaymentRequest(null);
        }}
        onSubmit={handlePaymentSubmit}
      />

      <PurchaseRequestAttachmentModal
        attachment={attachment}
        onClose={() => setAttachment(null)}
      />
    </MainLayout>
  );
};

export default PurchaseRequestsPage;
