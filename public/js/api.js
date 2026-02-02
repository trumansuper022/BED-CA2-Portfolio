// Shared API helpers (use backend port even when frontend is served by Live Server)
const API_BASE = 'http://localhost:9000';

const getToken = () => {
  return localStorage.getItem('token');
};

const getAuthHeaders = () => {
  const token = getToken();
  if (!token) {
    return {};
  }
  return {
    Authorization: `Bearer ${token}`
  };
};

const request = (path, options = {}) => {
  const headers = Object.assign(
    { 'Content-Type': 'application/json' },
    getAuthHeaders(),
    options.headers || {}
  );

  return fetch(`${API_BASE}${path}`, Object.assign({}, options, { headers }))
    .then((response) => {
      return response
        .json()
        .catch(() => ({}))
        .then((data) => ({ ok: response.ok, status: response.status, data }));
    });
};

