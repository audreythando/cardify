import axios from "axios";
import { logout, SESSION_EXPIRED_EVENT } from "../utils/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("cardify_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// A 401 from any non-auth endpoint means the session token is expired or no
// longer valid: clear it and let the app send the user back to sign in.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url: string = error?.config?.url ?? "";
    const isAuthCall = url.toLowerCase().startsWith("/auth/");

    if (status === 401 && !isAuthCall && localStorage.getItem("cardify_token")) {
      logout();
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
    }

    return Promise.reject(error);
  }
);

export default api;
