export const formatCurrencyInput = (value) => {
  const number = value.replace(/\D/g, "");
  return number ? Number(number).toLocaleString("id-ID") : "";
};

export const parseCurrencyInput = (value) => {
  return Number(value.replace(/\./g, ""));
};

export const formatCurrency = (value) => {
  const number = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });
  return number.format(value || 0);
};
