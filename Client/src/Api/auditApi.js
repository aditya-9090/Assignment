import axios from "axios";

const baseURL = import.meta.env.VITE_AUDIT_SERVICE_URL || "http://localhost:8001";

const auditApi = axios.create({
  baseURL,
});

export default auditApi;

