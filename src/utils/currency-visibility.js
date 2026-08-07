const STORAGE_KEY = "cashbook-hide-currency";

export const isCurrencyHidden = () => {
  return localStorage.getItem(STORAGE_KEY) === "true";
};

export const setCurrencyHidden = (hidden) => {
  localStorage.setItem(STORAGE_KEY, hidden);

  window.dispatchEvent(
    new CustomEvent("currency-visibility-change", {
      detail: hidden,
    }),
  );
};

export const toggleCurrencyHidden = () => {
  const hidden = !isCurrencyHidden();

  setCurrencyHidden(hidden);

  return hidden;
};
