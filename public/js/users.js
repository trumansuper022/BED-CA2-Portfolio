document.addEventListener('DOMContentLoaded', () => {
  requireAuth();
  const loadUsers = () => {
    request('/user/mine', { method: 'GET' }).then((result) => {
      if (!result.ok) {
        showMessage('playersListMessage', result.data.message || 'Failed to load players', 'danger');
        return;
      }

      renderList('usersList', result.data, (user) => `
        <h5>Crafter #${user.user_id}</h5>
        <div>Name: ${user.username}</div>
        <div>Emeralds: ${user.points}</div>
      `);

      populateSelect(
        'updateUserId',
        result.data,
        (player) => player.user_id,
        (player) => `#${player.user_id} - ${player.username}`,
        'Select player'
      );
      populateSelect(
        'deleteUserId',
        result.data,
        (player) => player.user_id,
        (player) => `#${player.user_id} - ${player.username}`,
        'Select player'
      );
    });
  };

  loadUsers();

  const createForm = document.getElementById('createUserForm');
  if (createForm) {
    createForm.addEventListener('submit', (event) => {
      event.preventDefault();
      clearMessage('createPlayerMessage');

      const username = document.getElementById('createUsername').value.trim();
      request('/user', {
        method: 'POST',
        body: JSON.stringify({ username })
      }).then((result) => {
        if (!result.ok) {
          showMessage('createPlayerMessage', result.data.message || 'Create failed', 'danger');
          return;
        }
        showMessage('createPlayerMessage', 'Player created!', 'success');
        createForm.reset();
        loadUsers();
      });
    });
  }

  const updateForm = document.getElementById('updateUserForm');
  if (updateForm) {
    updateForm.addEventListener('submit', (event) => {
      event.preventDefault();
      clearMessage('updatePlayerMessage');

      const userId = document.getElementById('updateUserId').value;
      const username = document.getElementById('updateUsername').value.trim();
      const points = Number(document.getElementById('updateEmeralds').value);

      request(`/user/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({ username, points })
      }).then((result) => {
        if (!result.ok) {
          showMessage('updatePlayerMessage', result.data.message || 'Update failed', 'danger');
          return;
        }
        showMessage('updatePlayerMessage', 'Player updated!', 'success');
        updateForm.reset();
        loadUsers();
      });
    });
  }

  const deleteForm = document.getElementById('deleteUserForm');
  if (deleteForm) {
    deleteForm.addEventListener('submit', (event) => {
      event.preventDefault();
      clearMessage('deletePlayerMessage');

      const userId = document.getElementById('deleteUserId').value;
      request(`/user/${userId}`, { method: 'DELETE' }).then((result) => {
        if (!result.ok && result.status !== 204) {
          showMessage('deletePlayerMessage', result.data.message || 'Delete failed', 'danger');
          return;
        }
        showMessage('deletePlayerMessage', 'Player deleted!', 'success');
        deleteForm.reset();
        loadUsers();
      });
    });
  }
});

