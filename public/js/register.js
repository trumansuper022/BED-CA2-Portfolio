document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearMessage('warningText');

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
      showMessage('warningText', 'Passwords do not match', 'danger');
      return;
    }

    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password })
    }).then((result) => {
      if (!result.ok) {
        showMessage('warningText', result.data.message || 'Register failed', 'danger');
        return;
      }

      clearAuth();
      window.location.href = '/login.html';
    });
  });
});

