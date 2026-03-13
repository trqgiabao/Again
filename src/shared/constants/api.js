export const API_BASE_URL =
  typeof import.meta.env?.VITE_API_BASE_URL !== "undefined"
    ? import.meta.env.VITE_API_BASE_URL
    : "https://freckly-hyperarchaeological-thea.ngrok-free.dev";

export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true",
};
