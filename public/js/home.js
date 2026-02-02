document.addEventListener('DOMContentLoaded', () => {
  const username = localStorage.getItem('username');
  const userId = localStorage.getItem('userId');

  if (username) {
    const heroUser = document.getElementById('heroUser');
    if (heroUser) {
      heroUser.textContent = `${username} (#${userId || '-'})`;
    }
  }
});

