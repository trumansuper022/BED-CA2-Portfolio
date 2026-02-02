document.addEventListener('DOMContentLoaded', () => {
  requireAuth();
  const isAdmin = (localStorage.getItem('username') || '').toLowerCase() === 'admin';
  const loadInventory = (path = '/inventory') => {
    request(path, { method: 'GET' }).then((result) => {
      if (!result.ok) {
        showMessage('inventoryMessage', result.data.message || 'Failed to load inventory', 'danger');
        return;
      }

      const container = document.getElementById('inventoryList');
      if (container) {
        container.innerHTML = '';
        if (!result.data || result.data.length === 0) {
          container.innerHTML = "<div class='mc-muted'>No inventory yet.</div>";
        } else {
          result.data.forEach((inv) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'mc-inventory-card p-3';
            const isMinepet = inv.minepet_id != null || inv.evolved_minepet_id != null;
            const isEvolved = inv.evolved_minepet_id != null;
            const title = isMinepet
              ? (isEvolved
                ? `Evolved #${inv.evolved_minepet_id} - ${inv.evolved_name || 'Unknown'}`
                : `Minepet #${inv.minepet_id} - ${inv.minepet_name || 'Unknown'}`)
              : `Item #${inv.item_id} - ${inv.item_name || 'Unknown'}`;
            wrapper.innerHTML = `
              <img class='card-media mb-2' src='${getInventoryImage(inv)}' alt='inventory asset' />
              <div class='mc-inventory-header'>${title}</div>
              <div class='mc-small'>Inventory #${inv.inventory_id} | Crafter #${inv.user_id}</div>
              ${isMinepet ? `<div>Base HP: ${isEvolved ? inv.evolved_base_hp ?? '-' : inv.base_hp ?? '-'}</div>
              <div>Base ATK: ${isEvolved ? inv.evolved_base_atk ?? '-' : inv.base_atk ?? '-'}</div>
              <div>Base DEF: ${isEvolved ? inv.evolved_base_def ?? '-' : inv.base_def ?? '-'}</div>` : `<div>${inv.item_description || ''}</div>`}
              <div>Applied Item: ${inv.applied_item_name ?? '-'}</div>
              <div>Bonus HP: ${inv.bonus_hp ?? 0}</div>
              <div>Bonus ATK: ${inv.bonus_atk ?? 0}</div>
              <div>Bonus DEF: ${inv.bonus_def ?? 0}</div>
            `;
            container.appendChild(wrapper);
          });
        }
      }

      populateSelect(
        'deleteInventoryId',
        result.data,
        (inv) => inv.inventory_id,
        (inv) => `#${inv.inventory_id} - Crafter ${inv.user_id}`,
        'Select inventory'
      );

      const minepetEntries = result.data.filter((inv) => inv.minepet_id != null || inv.evolved_minepet_id != null);
      const itemEntries = result.data.filter((inv) => inv.item_id != null);

      populateSelect(
        'applyMinepetInventoryId',
        minepetEntries,
        (inv) => inv.inventory_id,
        (inv) => {
          if (inv.evolved_minepet_id != null) {
            return `#${inv.inventory_id} - ${inv.evolved_name || 'Evolved'} (#${inv.evolved_minepet_id})`;
          }
          return `#${inv.inventory_id} - ${inv.minepet_name || 'Minepet'} (#${inv.minepet_id})`;
        },
        'Select minepet inventory'
      );

      populateSelect(
        'applyItemInventoryId',
        itemEntries,
        (inv) => inv.inventory_id,
        (inv) => `#${inv.inventory_id} - ${inv.item_name || 'Item'} (#${inv.item_id})`,
        'Select item inventory'
      );
    });
  };

  loadInventory();

  const populatePlayerSelects = (players) => {
    populateSelect(
      'filterUserId',
      players,
      (player) => player.user_id,
      (player) => `#${player.user_id} - ${player.username}`,
      'Filter by player (optional)'
    );
    populateSelect(
      'createInventoryUserId',
      players,
      (player) => player.user_id,
      (player) => `#${player.user_id} - ${player.username}`,
      'Select player'
    );
    populateSelect(
      'applyUserId',
      players,
      (player) => player.user_id,
      (player) => `#${player.user_id} - ${player.username}`,
      'Select player'
    );
  };

  if (isAdmin) {
    loadAllPlayers().then(populatePlayerSelects);
  } else {
    loadMyPlayers().then(populatePlayerSelects);
  }

  request('/minepet', { method: 'GET' }).then((result) => {
    if (result.ok) {
      populateSelect(
        'createInventoryMinepetId',
        result.data,
        (pet) => pet.minepet_id,
        (pet) => `#${pet.minepet_id} - ${pet.name}`,
        'Minepet (optional)'
      );
    }
  });

  request('/item', { method: 'GET' }).then((result) => {
    if (result.ok) {
      populateSelect(
        'createInventoryItemId',
        result.data,
        (item) => item.item_id,
        (item) => `#${item.item_id} - ${item.name}`,
        'Item (optional)'
      );
    }
  });

  const seedDefaults = (players) => {
    setDefaultPlayer('createInventoryUserId', players);
    setDefaultPlayer('applyUserId', players);
  };

  if (isAdmin) {
    loadAllPlayers().then(seedDefaults);
  } else {
    loadMyPlayers().then(seedDefaults);
  }

  const filterForm = document.getElementById('filterInventoryForm');
  if (filterForm) {
    filterForm.addEventListener('submit', (event) => {
      event.preventDefault();
      clearMessage('inventoryMessage');

      const userId = document.getElementById('filterUserId').value;
      if (!userId) {
        loadInventory();
        return;
      }
      loadInventory(`/inventory/user/${userId}`);
    });
  }

  const createForm = document.getElementById('createInventoryForm');
  if (createForm) {
    createForm.addEventListener('submit', (event) => {
      event.preventDefault();
      clearMessage('createInventoryMessage');

      const user_id = Number(document.getElementById('createInventoryUserId').value);
      const minepet_id = Number(document.getElementById('createInventoryMinepetId').value) || null;
      const item_id = Number(document.getElementById('createInventoryItemId').value) || null;

      request('/inventory', {
        method: 'POST',
        body: JSON.stringify({ user_id, minepet_id, item_id })
      }).then((result) => {
        if (!result.ok) {
          showMessage('createInventoryMessage', result.data.message || 'Create failed', 'danger');
          return;
        }
        showMessage('createInventoryMessage', 'Inventory entry created!', 'success');
        createForm.reset();
        loadInventory();
      });
    });
  }

  const deleteForm = document.getElementById('deleteInventoryForm');
  if (deleteForm) {
    deleteForm.addEventListener('submit', (event) => {
      event.preventDefault();
      clearMessage('deleteInventoryMessage');

      const inventoryId = document.getElementById('deleteInventoryId').value;
      request(`/inventory/${inventoryId}`, { method: 'DELETE' }).then((result) => {
        if (!result.ok && result.status !== 204) {
          showMessage('deleteInventoryMessage', result.data.message || 'Delete failed', 'danger');
          return;
        }
        showMessage('deleteInventoryMessage', 'Inventory entry deleted!', 'success');
        deleteForm.reset();
        loadInventory();
      });
    });
  }

  const applyForm = document.getElementById('applyItemForm');
  if (applyForm) {
    const applyUserSelect = document.getElementById('applyUserId');
    const refreshApplyInventory = () => {
      const userId = applyUserSelect ? applyUserSelect.value : null;
      if (!userId) {
        populateSelect('applyMinepetInventoryId', [], () => '', () => '', 'Select minepet inventory');
        populateSelect('applyItemInventoryId', [], () => '', () => '', 'Select item inventory');
        return;
      }
      request(`/inventory/user/${userId}`, { method: 'GET' }).then((result) => {
        if (!result.ok) {
          populateSelect('applyMinepetInventoryId', [], () => '', () => '', 'Select minepet inventory');
          populateSelect('applyItemInventoryId', [], () => '', () => '', 'Select item inventory');
          return;
        }
        const minepetEntries = result.data.filter((inv) => inv.minepet_id != null || inv.evolved_minepet_id != null);
        const itemEntries = result.data.filter((inv) => inv.item_id != null);
        populateSelect(
          'applyMinepetInventoryId',
          minepetEntries,
          (inv) => inv.inventory_id,
          (inv) => {
            if (inv.evolved_minepet_id != null) {
              return `#${inv.inventory_id} - ${inv.evolved_name || 'Evolved'} (#${inv.evolved_minepet_id})`;
            }
            return `#${inv.inventory_id} - ${inv.minepet_name || 'Minepet'} (#${inv.minepet_id})`;
          },
          'Select minepet inventory'
        );
        populateSelect(
          'applyItemInventoryId',
          itemEntries,
          (inv) => inv.inventory_id,
          (inv) => `#${inv.inventory_id} - ${inv.item_name || 'Item'} (#${inv.item_id})`,
          'Select item inventory'
        );
      });
    };

    if (applyUserSelect) {
      applyUserSelect.addEventListener('change', refreshApplyInventory);
    }
    refreshApplyInventory();

    applyForm.addEventListener('submit', (event) => {
      event.preventDefault();
      clearMessage('applyItemMessage');

      const user_id = Number(document.getElementById('applyUserId').value);
      const minepet_inventory_id = Number(document.getElementById('applyMinepetInventoryId').value);
      const item_inventory_id = Number(document.getElementById('applyItemInventoryId').value);

      request('/inventory/apply-item', {
        method: 'POST',
        body: JSON.stringify({ user_id, minepet_inventory_id, item_inventory_id })
      }).then((result) => {
        if (!result.ok) {
          showMessage('applyItemMessage', result.data.message || 'Apply item failed', 'danger');
          return;
        }
        showMessage('applyItemMessage', result.data.message || 'Item applied!', 'success');
        applyForm.reset();
        loadInventory();
      });
    });
  }
});

