import { useEffect, useState } from "react";

import { formatCurrency } from "../utils/currency";
import { isCurrencyHidden } from "../utils/currency-visibility";

const CurrencyText = ({
  value = 0,
  className = "",
  hiddenText = "Rp ••••••••",
}) => {
  const [hidden, setHidden] = useState(isCurrencyHidden());

  useEffect(() => {
    const handleVisibility = (event) => {
      setHidden(event.detail);
    };

    window.addEventListener("currency-visibility-change", handleVisibility);

    return () => {
      window.removeEventListener(
        "currency-visibility-change",
        handleVisibility,
      );
    };
  }, []);

  return (
    <span className={className}>
      {hidden ? hiddenText : formatCurrency(value)}
    </span>
  );
};

export default CurrencyText;
