document.addEventListener('DOMContentLoaded', () => {
  requireAuth();

  request('/auth/profile', {
    method: 'GET',
    headers: getAuthHeaders()
  }).then((result) => {
    if (!result.ok) {
      showMessage('profileMessage', result.data.message || 'Could not load profile', 'danger');
      return;
    }

    const user = result.data;
    document.getElementById('profileUsername').textContent = user.username || '-';
    document.getElementById('profileEmail').textContent = user.email || '-';
    document.getElementById('profileUserId').textContent = user.user_id || '-';

    renderList('profilePlayers', user.players || [], (player) => `
      <h5>Player #${player.user_id}</h5>
      <div>Name: ${player.username}</div>
      <div>Emeralds: ${player.points}</div>
    `);
  });
});

