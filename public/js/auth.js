// Auth helpers: store token + user info in localStorage
const setAuth = (payload) => {
  if (payload.token) {
    localStorage.setItem('token', payload.token);
  }
  if (payload.loggedInUserId) {
    localStorage.setItem('loggedInUserId', payload.loggedInUserId);
    localStorage.setItem('userId', payload.loggedInUserId);
  }
  if (payload.username) {
    localStorage.setItem('username', payload.username);
  }
};

const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('loggedInUserId');
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
};

const isLoggedIn = () => {
  return Boolean(localStorage.getItem('token'));
};

const requireAuth = () => {
  if (!isLoggedIn()) {
    window.location.href = '/login.html';
  }
};

