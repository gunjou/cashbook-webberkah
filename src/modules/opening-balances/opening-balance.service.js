import api from "../../api/axios";

export const getOpeningBalanceDisplay = async () => {
  const response = await api.get("/cashbook/opening-balance/display");

  return response.data.data;
};

export const getAccountDropdown = async () => {
  const response = await api.get("/cashbook/accounts/dropdown");

  return response.data.data;
};

export const createOpeningBalance = async (payload) => {
  const response = await api.post("/cashbook/opening-balance", payload);

  return response.data;
};

export const getOpeningBalanceHistory = async (idAccount) => {
  const response = await api.get("/cashbook/opening-balance", {
    params: {
      id_account: idAccount,
    },
  });

  return response.data.data;
};

export const getOpeningBalanceDetail = async (idOpeningBalance) => {
  const response = await api.get(
    `/cashbook/opening-balance/${idOpeningBalance}`,
  );

  return response.data.data;
};

export const updateOpeningBalance = async (idOpeningBalance, payload) => {
  const response = await api.put(
    `/cashbook/opening-balance/${idOpeningBalance}`,
    payload,
  );

  return response.data;
};

/* ==========================
   GENERATE OPENING BALANCE
========================== */
export const generateOpeningBalance = async (payload) => {
  const response = await api.post(
    "/cashbook/opening-balance/generate",
    payload,
  );

  return response.data.data;
};
