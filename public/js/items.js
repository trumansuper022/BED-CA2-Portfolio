document.addEventListener('DOMContentLoaded', () => {
  requireAuth();
  const loadItems = () => {
    request('/item', { method: 'GET' }).then((result) => {
      if (!result.ok) {
        showMessage('itemMessage', result.data.message || 'Failed to load items', 'danger');
        return;
      }

      renderList('itemList', result.data, (item) => `
        <img class='card-media mb-2' src='${getAssetImage('item', item.name)}' alt='item' />
        <h5>Item #${item.item_id}</h5>
        <div>Name: ${item.name}</div>
        <div>${item.description || ''}</div>
        <div class='mc-muted'>Type: ${item.type || '-'}</div>
        <div class='mc-muted'>Bonus HP: ${item.bonus_hp || 0}, ATK: ${item.bonus_atk || 0}, DEF: ${item.bonus_def || 0}</div>
      `);

      populateSelect(
        'updateItemId',
        result.data,
        (item) => item.item_id,
        (item) => `#${item.item_id} - ${item.name}`,
        'Select item'
      );
      populateSelect(
        'deleteItemId',
        result.data,
        (item) => item.item_id,
        (item) => `#${item.item_id} - ${item.name}`,
        'Select item'
      );
    });
  };

  loadItems();

  const createForm = document.getElementById('createItemForm');
  if (createForm) {
    createForm.addEventListener('submit', (event) => {
      event.preventDefault();
      clearMessage('createItemMessage');

      const name = document.getElementById('createItemName').value.trim();
      const description = document.getElementById('createItemDescription').value.trim();
      const type = document.getElementById('createItemType').value.trim();
      const bonus_hp = Number(document.getElementById('createItemHp').value);
      const bonus_atk = Number(document.getElementById('createItemAtk').value);
      const bonus_def = Number(document.getElementById('createItemDef').value);
      request('/item', {
        method: 'POST',
        body: JSON.stringify({ name, description, type, bonus_hp, bonus_atk, bonus_def })
      }).then((result) => {
        if (!result.ok) {
          showMessage('createItemMessage', result.data.message || 'Create failed', 'danger');
          return;
        }
        showMessage('createItemMessage', 'Item created!', 'success');
        createForm.reset();
        loadItems();
      });
    });
  }

  const updateForm = document.getElementById('updateItemForm');
  if (updateForm) {
    updateForm.addEventListener('submit', (event) => {
      event.preventDefault();
      clearMessage('updateItemMessage');

      const id = document.getElementById('updateItemId').value;
      const name = document.getElementById('updateItemName').value.trim();
      const description = document.getElementById('updateItemDescription').value.trim();
      const type = document.getElementById('updateItemType').value.trim();
      const bonus_hp = Number(document.getElementById('updateItemHp').value);
      const bonus_atk = Number(document.getElementById('updateItemAtk').value);
      const bonus_def = Number(document.getElementById('updateItemDef').value);
      request(`/item/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ name, description, type, bonus_hp, bonus_atk, bonus_def })
      }).then((result) => {
        if (!result.ok) {
          showMessage('updateItemMessage', result.data.message || 'Update failed', 'danger');
          return;
        }
        showMessage('updateItemMessage', 'Item updated!', 'success');
        updateForm.reset();
        loadItems();
      });
    });
  }

  const deleteForm = document.getElementById('deleteItemForm');
  if (deleteForm) {
    deleteForm.addEventListener('submit', (event) => {
      event.preventDefault();
      clearMessage('deleteItemMessage');

      const id = document.getElementById('deleteItemId').value;
      request(`/item/${id}`, { method: 'DELETE' }).then((result) => {
        if (!result.ok && result.status !== 204) {
          showMessage('deleteItemMessage', result.data.message || 'Delete failed', 'danger');
          return;
        }
        showMessage('deleteItemMessage', 'Item deleted!', 'success');
        deleteForm.reset();
        loadItems();
      });
    });
  }
});

