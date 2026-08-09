import axios from "axios";

const cdn = axios.create({
  baseURL: process.env.REACT_APP_CDN_BASE_URL,
  timeout: 30000,
  headers: {
    "X-API-KEY": process.env.REACT_APP_CDN_API_KEY,
  },
});

export default cdn;
