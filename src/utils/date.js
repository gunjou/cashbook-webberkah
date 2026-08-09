export const formatPeriod = (date) => {
  if (!date) return "-";
  const result = new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(new Date(date));
  return result;
};

export const formatDateLabel = (date) => {
  if (!date) return "-";
  const result = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
  return result;
};

export const detailDate = (date) => {
  if (!date) return "-";
  const result = new Intl.DateTimeFormat("id-ID", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
  return result;
};
