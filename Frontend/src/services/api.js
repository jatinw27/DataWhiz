import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const fetchDatasets = () =>
  axios.get(`${API_BASE}/api/datasets`);

export const uploadCSV = (formData) =>
  axios.post(`${API_BASE}/api/upload-csv`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const askNLQ = (payload) =>
  axios.post(`${API_BASE}/api/nlq/ask`, payload);

export const sendChatMessage = (payload) =>
  axios.post(`${API_BASE}/api/chatbot/message`, payload);
