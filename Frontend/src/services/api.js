import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// ✅ SINGLE AXIOS INSTANCE
const api = axios.create({
  baseURL: `${API_BASE}/api`,
});

// ✅ AUTO ATTACH TOKEN
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   AUTH
========================= */
export const loginUser = (data) =>
  api.post("/auth/login", data);

export const registerUser = (data) =>
  api.post("/auth/register", data);

export const getMe = () =>
  api.get("/auth/me");

/* =========================
   DATA SOURCES
========================= */
export const connectMongo = (uri) =>
  api.post("/mongo/connect", { uri });

export const fetchDatasets = () =>
  api.get("/datasets");

export const uploadCSV = (formData) =>
  api.post("/upload-csv", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/* =========================
   CHAT / NLQ
========================= */
export const askNLQ = (payload) =>
  api.post("/nlq/ask", payload);

export const sendChatMessage = (payload) =>
  api.post("/chatbot/message", payload);

export default api;
