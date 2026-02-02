// Keep navbar stable; only toggle auth buttons
const setupNavbar = () => {
  const loginBtn = document.getElementById('loginButton');
  const registerBtn = document.getElementById('registerButton');
  const logoutBtn = document.getElementById('logoutButton');

  if (isLoggedIn()) {
    if (loginBtn) loginBtn.classList.add('d-none');
    if (registerBtn) registerBtn.classList.add('d-none');
    if (logoutBtn) logoutBtn.classList.remove('d-none');
  } else {
    if (loginBtn) loginBtn.classList.remove('d-none');
    if (registerBtn) registerBtn.classList.remove('d-none');
    if (logoutBtn) logoutBtn.classList.add('d-none');
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', (event) => {
      event.preventDefault();
      clearAuth();
      window.location.href = '/login.html';
    });
  }
};

document.addEventListener('DOMContentLoaded', setupNavbar);

