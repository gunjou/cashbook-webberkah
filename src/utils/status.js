// Warna status sengaja tidak mengikuti tema supaya artinya tetap sama.
// Tampilan badge ada di .badge-tone (src/index.css).
export const STATUS_STYLE = {
  REQUESTED: { label: "Requested", className: "badge-tone badge-orange" },
  REVIEWED: { label: "Reviewed", className: "badge-tone badge-yellow" },
  APPROVED: { label: "Approved", className: "badge-tone badge-green" },
  PAID: { label: "Paid", className: "badge-tone badge-sky" },
  REJECTED: { label: "Rejected", className: "badge-tone badge-red" },
  ACTIVE: { label: "Aktif", className: "badge-tone badge-brand" },
};

export const PRIORITY_STYLE = {
  NORMAL: { label: "Normal", className: "badge-tone badge-neutral" },
  URGENT: { label: "Urgent", className: "badge-tone badge-orange" },
  TOP_URGENT: { label: "Top Urgent", className: "badge-tone badge-red badge-strong" },
};
