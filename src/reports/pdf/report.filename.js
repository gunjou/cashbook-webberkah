const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const formatDate = (date) => {
  const d = new Date(date);

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
};

const formatMonthYear = (date) => {
  const d = new Date(date);

  return `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
};

const sanitizeFilename = (text) =>
  text.replace(/\s+/g, " ").replace(/[\\/:*?"<>|]/g, "");

const getMonday = (date) => {
  const d = new Date(date);

  const day = d.getDay();

  const diff = day === 0 ? -6 : 1 - day;

  d.setDate(d.getDate() + diff);

  d.setHours(0, 0, 0, 0);

  return d;
};

const getSunday = (date) => {
  const monday = getMonday(date);

  const sunday = new Date(monday);

  sunday.setDate(sunday.getDate() + 6);

  return sunday;
};

export const generateReportFilename = ({
  reportName,
  period = "week",
  date_from,
  date_to,
  account_name,
}) => {
  const now = new Date();

  const parts = [];

  parts.push(`Laporan ${sanitizeFilename(reportName)}`);

  if (account_name) {
    parts.push(sanitizeFilename(account_name));
  }

  switch (period) {
    case "today":
      parts.push(`(${formatDate(now)})`);
      break;

    case "yesterday": {
      const yesterday = new Date(now);

      yesterday.setDate(yesterday.getDate() - 1);

      parts.push(`(${formatDate(yesterday)})`);

      break;
    }

    case "week": {
      const monday = getMonday(now);

      const sunday = getSunday(now);

      parts.push(`(${formatDate(monday)} - ${formatDate(sunday)})`);

      break;
    }

    case "month": {
      parts.push(`(${formatMonthYear(now)})`);

      break;
    }

    case "year": {
      parts.push(`(${now.getFullYear()})`);

      break;
    }

    case "custom": {
      if (date_from && date_to) {
        parts.push(`(${formatDate(date_from)} - ${formatDate(date_to)})`);
      } else {
        parts.push(`(${formatDate(now)})`);
      }

      break;
    }

    default:
      parts.push(`(${formatDate(now)})`);
  }

  return `${parts.join(" ")}.pdf`;
};
