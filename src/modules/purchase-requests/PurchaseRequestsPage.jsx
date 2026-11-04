import { useCallback, useEffect, useState } from "react";
import { Download, History, List } from "lucide-react";

import MainLayout from "../../layouts/MainLayout";
import swal from "../../lib/swal";

import PurchaseRequestFilter from "./PurchaseRequestFilter";
import PurchaseRequestTable from "./PurchaseRequestTable";

import {
  createCashbookTransaction,
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
import PurchaseRequestPagination from "./PurchaseRequestPagination";

const INITIAL_ACTIVE_FILTER = {
  status: "APPROVED",
  search: "",
  tanggal_mulai: "",
  tanggal_selesai: "",
};
const INITIAL_HISTORY_FILTER = {
  status: "PAID",
  search: "",
  tanggal_mulai: "",
  tanggal_selesai: "",
};

const PurchaseRequestsPage = () => {
  const [viewMode, setViewMode] = useState("ACTIVE");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "asc",
  });
  const [filter, setFilter] = useState(INITIAL_ACTIVE_FILTER);

  const [historyPage, setHistoryPage] = useState(1);
  const [historyPerPage, setHistoryPerPage] = useState(25);
  const [historyPageInfo, setHistoryPageInfo] = useState({
    page: 1,
    per_page: 25,
    total: 0,
    total_pages: 1,
  });

  const [openDetail, setOpenDetail] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPaymentRequest, setSelectedPaymentRequest] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);

  const [exportLoading, setExportLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const isHistoryPaginated = viewMode === "HISTORY" && filter.status === "PAID";

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const params = { status: filter.status };

      if (filter.search) params.search = filter.search;
      if (filter.tanggal_mulai) params.tanggal_mulai = filter.tanggal_mulai;
      if (filter.tanggal_selesai)
        params.tanggal_selesai = filter.tanggal_selesai;

      if (viewMode === "ACTIVE") {
        const result = await getPurchaseRequests(params);

        setData(result || []);
        return;
      }

      const historyParams = {
        ...params,
      };

      if (isHistoryPaginated) {
        historyParams.page = historyPage;
        historyParams.per_page = historyPerPage;
      }

      const result = await getPurchaseRequestHistory(historyParams);

      if (isHistoryPaginated) {
        setData(result?.data || []);

        setHistoryPageInfo({
          page: result?.page_info?.page || historyPage,
          per_page: result?.page_info?.per_page || historyPerPage,
          total: result?.page_info?.total || 0,
          total_pages: result?.page_info?.total_pages || 1,
        });
      } else {
        setData(result?.data || []);

        setHistoryPageInfo({
          page: 1,
          per_page: result?.page_info?.total || result?.data?.length || 0,
          total: result?.page_info?.total || result?.data?.length || 0,
          total_pages: 1,
        });
      }
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
  }, [filter, viewMode, historyPage, historyPerPage, isHistoryPaginated]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reset pilihan setiap data tabel berubah (filter, mode, halaman)
  useEffect(() => {
    setSelectedIds([]);
  }, [data]);

  const handleToggleSelect = (idRequest) => {
    setSelectedIds((prev) =>
      prev.includes(idRequest)
        ? prev.filter((id) => id !== idRequest)
        : [...prev, idRequest],
    );
  };

  const handleToggleSelectAll = (checked) => {
    setSelectedIds(checked ? displayedData.map((item) => item.id_request) : []);
  };

  const displayedData =
    viewMode === "ACTIVE"
      ? [...data].sort((a, b) => {
          if (sortConfig.key === "priority") {
            const priorityOrder = {
              NORMAL: 1,
              URGENT: 2,
              TOP_URGENT: 3,
            };

            const result =
              (priorityOrder[b.priority] || 0) -
              (priorityOrder[a.priority] || 0);

            return sortConfig.direction === "desc" ? result : -result;
          }

          const dateA = new Date(a.created_at || 0).getTime();
          const dateB = new Date(b.created_at || 0).getTime();

          return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
        })
      : data;

  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "desc" ? "asc" : "desc",
    }));
  };

  const handleHistoryPerPageChange = (value) => {
    setHistoryPerPage(Number(value));
    setHistoryPage(1);

    setFilter((prev) => ({
      ...prev,
      status: "PAID",
    }));
  };

  const handleViewMode = () => {
    const nextMode = viewMode === "ACTIVE" ? "HISTORY" : "ACTIVE";

    setViewMode(nextMode);
    setData([]);
    setHistoryPage(1);

    setFilter(
      nextMode === "ACTIVE" ? INITIAL_ACTIVE_FILTER : INITIAL_HISTORY_FILTER,
    );
  };

  const handleResetFilter = () => {
    setHistoryPage(1);

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
    // Tanpa pilihan: export semua yang tampil di tabel.
    // Dengan pilihan: hanya baris terpilih (urutan mengikuti tabel).
    const exportData = selectedIds.length
      ? displayedData.filter((item) => selectedIds.includes(item.id_request))
      : displayedData;

    if (!exportData.length) {
      await swal.fire({
        icon: "warning",
        title: "Tidak Ada Data",
        text: "Tidak ada data pengajuan yang dapat diexport.",
      });

      return;
    }

    try {
      setExportLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 50));

      exportPurchaseRequestsPDF(exportData, {
        filters: filter,
        sortField: sortConfig.key,
        sortDirection: sortConfig.direction,
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
        setUploadProgress(0);

        const uploadResponse = await uploadAttachment(
          paymentData.attachment_file,
          { onProgress: setUploadProgress },
        );

        attachmentUrl = uploadResponse.url;
      }

      /* ==========================
       CREATE CASHBOOK TRANSACTION
    ========================== */

      await createCashbookTransaction({
        id_account: paymentData.id_account,
        id_category: paymentData.id_category,
        id_request: paymentData.id_request,
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
      setUploadProgress(null);
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
      <div className="space-y-3 p-6 pb-2">
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
                  {selectedIds.length
                    ? `Export PDF (${selectedIds.length})`
                    : "Export PDF"}
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
          viewMode={viewMode}
          startIndex={
            isHistoryPaginated
              ? (historyPageInfo.page - 1) * historyPageInfo.per_page
              : 0
          }
          enableSort={viewMode === "ACTIVE"}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
        />

        {isHistoryPaginated && historyPageInfo.total > 0 && (
          <PurchaseRequestPagination
            page={historyPageInfo.page}
            perPage={historyPageInfo.per_page}
            total={historyPageInfo.total}
            totalPages={historyPageInfo.total_pages}
            loading={loading}
            onPageChange={setHistoryPage}
            onPerPageChange={handleHistoryPerPageChange}
          />
        )}
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
        uploadProgress={uploadProgress}
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
