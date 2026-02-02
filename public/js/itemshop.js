document.addEventListener('DOMContentLoaded', () => {
  requireAuth();
  const loadItemshop = () => {
    request('/itemshop', { method: 'GET' }).then((result) => {
      if (!result.ok) {
        showMessage('itemshopMessage', result.data.message || 'Failed to load item shop', 'danger');
        return;
      }

      renderList('itemshopList', result.data, (entry) => `
        <img class='card-media mb-2' src='${getAssetImage('item', entry.name)}' alt='item shop' />
        <h5>Itemshop #${entry.itemshop_id}</h5>
        <div>Item: ${entry.name}</div>
        <div>Price: ${entry.price_points} emeralds</div>
      `);

      populateSelect(
        'updateItemshopId',
        result.data,
        (entry) => entry.itemshop_id,
        (entry) => `#${entry.itemshop_id} - ${entry.name}`,
        'Select shop entry'
      );
      populateSelect(
        'deleteItemshopId',
        result.data,
        (entry) => entry.itemshop_id,
        (entry) => `#${entry.itemshop_id} - ${entry.name}`,
        'Select shop entry'
      );
      populateSelect(
        'buyItemshopId',
        result.data,
        (entry) => entry.itemshop_id,
        (entry) => `#${entry.itemshop_id} - ${entry.name}`,
        'Select shop entry'
      );
    });
  };

  loadItemshop();

  request('/item', { method: 'GET' }).then((result) => {
    if (result.ok) {
      populateSelect(
        'createItemshopItemId',
        result.data,
        (item) => item.item_id,
        (item) => `#${item.item_id} - ${item.name}`,
        'Select item'
      );
      populateSelect(
        'updateItemshopItemId',
        result.data,
        (item) => item.item_id,
        (item) => `#${item.item_id} - ${item.name}`,
        'Select item'
      );
    }
  });

  loadAllPlayers().then((players) => {
    populateSelect(
      'buyItemshopUserId',
      players,
      (player) => player.user_id,
      (player) => `#${player.user_id} - ${player.username}`,
      'Select player'
    );
  });

  loadMyPlayers().then((myPlayers) => {
    setDefaultPlayer('buyItemshopUserId', myPlayers);
  });

  const buyUserSelect = document.getElementById('buyItemshopUserId');
  const loadMinepetInventoryForBuy = (userId) => {
    if (!userId) {
      populateSelect('buyItemshopApplyMinepet', [], () => '', () => '', 'Apply to minepet (optional)');
      return;
    }

    request(`/inventory/user/${userId}`, { method: 'GET' }).then((result) => {
      if (!result.ok) {
        populateSelect('buyItemshopApplyMinepet', [], () => '', () => '', 'Apply to minepet (optional)');
        return;
      }
      const minepets = (result.data || []).filter((inv) => inv.minepet_id != null || inv.evolved_minepet_id != null);
      populateSelect(
        'buyItemshopApplyMinepet',
        minepets,
        (inv) => inv.inventory_id,
        (inv) => {
          if (inv.evolved_minepet_id != null) {
            return `#${inv.inventory_id} - ${inv.evolved_name || 'Evolved'} (Evolved)`;
          }
          return `#${inv.inventory_id} - ${inv.minepet_name || 'Minepet'}`;
        },
        'Apply to minepet (optional)'
      );
    });
  };

  if (buyUserSelect) {
    buyUserSelect.addEventListener('change', () => {
      loadMinepetInventoryForBuy(buyUserSelect.value);
    });
  }

  if (buyUserSelect && buyUserSelect.value) {
    loadMinepetInventoryForBuy(buyUserSelect.value);
  }

  const createForm = document.getElementById('createItemshopForm');
  if (createForm) {
    createForm.addEventListener('submit', (event) => {
      event.preventDefault();
      clearMessage('createItemshopMessage');

      const item_id = Number(document.getElementById('createItemshopItemId').value);
      const price_points = Number(document.getElementById('createItemshopPrice').value);

      request('/itemshop', {
        method: 'POST',
        body: JSON.stringify({ item_id, price_points })
      }).then((result) => {
        if (!result.ok) {
          showMessage('createItemshopMessage', result.data.message || 'Create failed', 'danger');
          return;
        }
        showMessage('createItemshopMessage', 'Itemshop entry created!', 'success');
        createForm.reset();
        loadItemshop();
      });
    });
  }

  const updateForm = document.getElementById('updateItemshopForm');
  if (updateForm) {
    updateForm.addEventListener('submit', (event) => {
      event.preventDefault();
      clearMessage('updateItemshopMessage');

      const id = document.getElementById('updateItemshopId').value;
      const item_id = Number(document.getElementById('updateItemshopItemId').value);
      const price_points = Number(document.getElementById('updateItemshopPrice').value);

      request(`/itemshop/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ item_id, price_points })
      }).then((result) => {
        if (!result.ok) {
          showMessage('updateItemshopMessage', result.data.message || 'Update failed', 'danger');
          return;
        }
        showMessage('updateItemshopMessage', 'Itemshop updated!', 'success');
        updateForm.reset();
        loadItemshop();
      });
    });
  }

  const deleteForm = document.getElementById('deleteItemshopForm');
  if (deleteForm) {
    deleteForm.addEventListener('submit', (event) => {
      event.preventDefault();
      clearMessage('deleteItemshopMessage');

      const id = document.getElementById('deleteItemshopId').value;
      request(`/itemshop/${id}`, { method: 'DELETE' }).then((result) => {
        if (!result.ok && result.status !== 204) {
          showMessage('deleteItemshopMessage', result.data.message || 'Delete failed', 'danger');
          return;
        }
        showMessage('deleteItemshopMessage', 'Itemshop deleted!', 'success');
        deleteForm.reset();
        loadItemshop();
      });
    });
  }

  const buyForm = document.getElementById('buyItemshopForm');
  if (buyForm) {
    buyForm.addEventListener('submit', (event) => {
      event.preventDefault();
      clearMessage('buyItemshopMessage');

      const user_id = Number(document.getElementById('buyItemshopUserId').value);
      const itemshop_id = Number(document.getElementById('buyItemshopId').value);
      const minepet_inventory_id = Number(document.getElementById('buyItemshopApplyMinepet').value) || null;

      request('/itemshop/buy', {
        method: 'POST',
        body: JSON.stringify({ user_id, itemshop_id })
      }).then((result) => {
        if (!result.ok) {
          showMessage('buyItemshopMessage', result.data.message || 'Purchase failed', 'danger');
          return;
        }
        const newInventoryId = result.data.inventoryid;

        if (minepet_inventory_id && newInventoryId) {
          request('/inventory/apply-item', {
            method: 'POST',
            body: JSON.stringify({
              user_id,
              minepet_inventory_id,
              item_inventory_id: newInventoryId
            })
          }).then((applyResult) => {
            if (!applyResult.ok) {
              showMessage('buyItemshopMessage', applyResult.data.message || 'Purchased but apply failed', 'warning');
              return;
            }
            showMessage('buyItemshopMessage', 'Purchased and applied!', 'success');
          });
        } else {
          showMessage('buyItemshopMessage', result.data.message || 'Purchased!', 'success');
        }
        buyForm.reset();
      });
    });
  }
});

