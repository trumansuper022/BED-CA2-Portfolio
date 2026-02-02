document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearMessage('warningText');

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    }).then((result) => {
      if (!result.ok) {
        showMessage('warningText', result.data.message || 'Login failed', 'danger');
        return;
      }

      setAuth(result.data);
      window.location.href = '/index.html';
    });
  });
});

