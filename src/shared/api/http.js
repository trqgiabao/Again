const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

const AUTH_TOKEN_KEYS = ['accessToken', 'token', 'authToken'];
const AUTH_STORAGE_KEYS = [...AUTH_TOKEN_KEYS, 'refreshToken', 'user'];

const parseStoredUser = (value) => {
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const decodeJwtPayload = (token) => {
  if (!token || typeof window === 'undefined') return null;

  const parts = token.split('.');
  if (parts.length < 2) return null;

  try {
    const normalized = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const decoded = window.atob(padded);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

const normalizeAuthUser = (authData = {}, fallbackUsername = '') => {
  const baseUser = typeof authData.user === 'object' && authData.user !== null ? authData.user : {};
  const normalizedUser = {
    ...baseUser,
  };

  normalizedUser.username =
    normalizedUser.username || authData.username || authData.userName || fallbackUsername || '';
  normalizedUser.fullName =
    normalizedUser.fullName || normalizedUser.name || authData.fullName || authData.name || '';
  normalizedUser.email = normalizedUser.email || authData.email || '';
  normalizedUser.role = normalizedUser.role || authData.role || '';

  return Object.values(normalizedUser).some(Boolean) ? normalizedUser : null;
};

const getStoredUser = () => {
  if (typeof window === 'undefined') return null;

  return parseStoredUser(window.localStorage.getItem('user')) || parseStoredUser(window.sessionStorage.getItem('user'));
};

const getAuthToken = () => {
  if (typeof window === 'undefined') return '';

  const storages = [window.localStorage, window.sessionStorage];

  for (const storage of storages) {
    for (const key of AUTH_TOKEN_KEYS) {
      const value = storage.getItem(key);
      if (value) {
        return value;
      }
    }
  }

  return '';
};

export const persistAuthSession = (authData = {}, fallbackUsername = '') => {
  if (typeof window === 'undefined') return;

  if (authData.token) {
    window.localStorage.setItem('token', authData.token);
  }

  if (authData.accessToken) {
    window.localStorage.setItem('accessToken', authData.accessToken);
  }

  if (authData.refreshToken) {
    window.localStorage.setItem('refreshToken', authData.refreshToken);
  }

  const normalizedUser = normalizeAuthUser(authData, fallbackUsername);

  if (normalizedUser) {
    window.localStorage.setItem('user', JSON.stringify(normalizedUser));
  }
};

export const getAuthIdentity = () => {
  const storedUser = getStoredUser();

  if (storedUser) {
    const displayName =
      storedUser.username ||
      storedUser.fullName ||
      storedUser.name ||
      storedUser.displayName ||
      storedUser.email ||
      '';

    return {
      displayName,
      role: storedUser.role || '',
      user: storedUser,
    };
  }

  const payload = decodeJwtPayload(getAuthToken());

  if (!payload) {
    return {
      displayName: '',
      role: '',
      user: null,
    };
  }

  return {
    displayName:
      payload.preferred_username ||
      payload.unique_name ||
      payload.username ||
      payload.name ||
      payload.email ||
      payload.sub ||
      '',
    role: payload.role || payload.roles || '',
    user: payload,
  };
};

export const clearAuthSession = () => {
  if (typeof window === 'undefined') return;

  [window.localStorage, window.sessionStorage].forEach((storage) => {
    AUTH_STORAGE_KEYS.forEach((key) => storage.removeItem(key));
  });
};

const buildUrl = (path) => {
  if (!path) return API_BASE_URL;
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

const parseResponse = async (response) => {
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      (typeof data === 'object' && data?.message) ||
      (typeof data === 'object' && data?.error) ||
      `Request failed (${response.status})`;

    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

export const httpRequest = async (path, options = {}) => {
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (!headers.has('Authorization')) {
    const token = getAuthToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const url = buildUrl(path);

  // ngrok free endpoints show an interstitial warning unless this header is present.
  // See: https://ngrok.com/docs#getting-started-browser-warning
  if (url.includes('ngrok')) {
    headers.set('ngrok-skip-browser-warning', 'true');
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return parseResponse(response);
};

export { API_BASE_URL };