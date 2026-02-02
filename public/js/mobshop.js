document.addEventListener('DOMContentLoaded', () => {
  requireAuth();
  const loadMobshop = () => {
    request('/mobshop', { method: 'GET' }).then((result) => {
      if (!result.ok) {
        showMessage('mobshopMessage', result.data.message || 'Failed to load mob shop', 'danger');
        return;
      }

      renderList('mobshopList', result.data, (entry) => `
        <img class='card-media mb-2' src='${getAssetImage('minepet', entry.name)}' alt='mob shop' />
        <div class='mc-small mc-muted'>${entry.name || 'Minepet'}</div>
        <h5>Mobshop #${entry.mobshop_id}</h5>
        <div>Minepet ID: ${entry.minepet_id}</div>
        <div>Price: ${entry.price_points} emeralds</div>
      `);

      populateSelect(
        'updateMobshopId',
        result.data,
        (entry) => entry.mobshop_id,
        (entry) => `#${entry.mobshop_id} - ${entry.name}`,
        'Select shop entry'
      );
      populateSelect(
        'deleteMobshopId',
        result.data,
        (entry) => entry.mobshop_id,
        (entry) => `#${entry.mobshop_id} - ${entry.name}`,
        'Select shop entry'
      );
      populateSelect(
        'buyMobshopId',
        result.data,
        (entry) => entry.mobshop_id,
        (entry) => `#${entry.mobshop_id} - ${entry.name}`,
        'Select shop entry'
      );
    });
  };

  loadMobshop();

  request('/minepet', { method: 'GET' }).then((result) => {
    if (result.ok) {
      populateSelect(
        'createMobshopMinepetId',
        result.data,
        (pet) => pet.minepet_id,
        (pet) => `#${pet.minepet_id} - ${pet.name}`,
        'Select minepet'
      );
      populateSelect(
        'updateMobshopMinepetId',
        result.data,
        (pet) => pet.minepet_id,
        (pet) => `#${pet.minepet_id} - ${pet.name}`,
        'Select minepet'
      );
    }
  });

  loadAllPlayers().then((players) => {
    populateSelect(
      'buyMobshopUserId',
      players,
      (player) => player.user_id,
      (player) => `#${player.user_id} - ${player.username}`,
      'Select player'
    );
  });

  loadMyPlayers().then((myPlayers) => {
    setDefaultPlayer('buyMobshopUserId', myPlayers);
  });

  const createForm = document.getElementById('createMobshopForm');
  if (createForm) {
    createForm.addEventListener('submit', (event) => {
      event.preventDefault();
      clearMessage('createMobshopMessage');

      const minepet_id = Number(document.getElementById('createMobshopMinepetId').value);
      const price_points = Number(document.getElementById('createMobshopPrice').value);

      request('/mobshop', {
        method: 'POST',
        body: JSON.stringify({ minepet_id, price_points })
      }).then((result) => {
        if (!result.ok) {
          showMessage('createMobshopMessage', result.data.message || 'Create failed', 'danger');
          return;
        }
        showMessage('createMobshopMessage', 'Mobshop entry created!', 'success');
        createForm.reset();
        loadMobshop();
      });
    });
  }

  const updateForm = document.getElementById('updateMobshopForm');
  if (updateForm) {
    updateForm.addEventListener('submit', (event) => {
      event.preventDefault();
      clearMessage('updateMobshopMessage');

      const id = document.getElementById('updateMobshopId').value;
      const minepet_id = Number(document.getElementById('updateMobshopMinepetId').value);
      const price_points = Number(document.getElementById('updateMobshopPrice').value);

      request(`/mobshop/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ minepet_id, price_points })
      }).then((result) => {
        if (!result.ok) {
          showMessage('updateMobshopMessage', result.data.message || 'Update failed', 'danger');
          return;
        }
        showMessage('updateMobshopMessage', 'Mobshop updated!', 'success');
        updateForm.reset();
        loadMobshop();
      });
    });
  }

  const deleteForm = document.getElementById('deleteMobshopForm');
  if (deleteForm) {
    deleteForm.addEventListener('submit', (event) => {
      event.preventDefault();
      clearMessage('deleteMobshopMessage');

      const id = document.getElementById('deleteMobshopId').value;
      request(`/mobshop/${id}`, { method: 'DELETE' }).then((result) => {
        if (!result.ok && result.status !== 204) {
          showMessage('deleteMobshopMessage', result.data.message || 'Delete failed', 'danger');
          return;
        }
        showMessage('deleteMobshopMessage', 'Mobshop deleted!', 'success');
        deleteForm.reset();
        loadMobshop();
      });
    });
  }

  const buyForm = document.getElementById('buyMobshopForm');
  if (buyForm) {
    buyForm.addEventListener('submit', (event) => {
      event.preventDefault();
      clearMessage('buyMobshopMessage');

      const user_id = Number(document.getElementById('buyMobshopUserId').value);
      const mobshop_id = Number(document.getElementById('buyMobshopId').value);

      request('/mobshop/buy', {
        method: 'POST',
        body: JSON.stringify({ user_id, mobshop_id })
      }).then((result) => {
        if (!result.ok) {
          showMessage('buyMobshopMessage', result.data.message || 'Purchase failed', 'danger');
          return;
        }
        showMessage('buyMobshopMessage', result.data.message || 'Purchased!', 'success');
        buyForm.reset();
      });
    });
  }
});

