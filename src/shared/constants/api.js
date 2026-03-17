export const API_BASE_URL =
  typeof import.meta.env?.VITE_API_BASE_URL !== "undefined"
    ? import.meta.env.VITE_API_BASE_URL
    : "https://freckly-hyperarchaeological-thea.ngrok-free.dev";

export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true",
};

const _TOKEN_KEYS = ["accessToken", "token", "authToken"];

const _readStoredToken = () => {
  if (typeof window === "undefined") return "";
  for (const storage of [window.localStorage, window.sessionStorage]) {
    for (const key of _TOKEN_KEYS) {
      const val = storage.getItem(key);
      if (val) return val;
    }
  }
  return "";
};

export const getAuthHeaders = () => {
  const token = _readStoredToken();
  return {
    ...DEFAULT_HEADERS,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};
