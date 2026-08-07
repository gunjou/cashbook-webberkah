export const formatPeriod = (date) => {
  if (!date) return "-";

  const result = new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(new Date(date));
  return result;
};
