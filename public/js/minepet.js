document.addEventListener('DOMContentLoaded', () => {
  requireAuth();
  const loadMinepets = () => {
    request('/minepet', { method: 'GET' }).then((result) => {
      if (!result.ok) {
        showMessage('minepetMessage', result.data.message || 'Failed to load minepets', 'danger');
        return;
      }

      renderList('minepetList', result.data, (pet) => `
        <img class='card-media mb-2' src='${getAssetImage('minepet', pet.name)}' alt='minepet' />
        <h5>Minepet #${pet.minepet_id}</h5>
        <div>Name: ${pet.name}</div>
        <div>${pet.description}</div>
        <div>Base HP: ${pet.base_hp}</div>
        <div>Base ATK: ${pet.base_atk}</div>
        <div>Base DEF: ${pet.base_def}</div>
      `);

      populateSelect(
        'updateMinepetId',
        result.data,
        (pet) => pet.minepet_id,
        (pet) => `#${pet.minepet_id} - ${pet.name}`,
        'Select minepet'
      );
      populateSelect(
        'deleteMinepetId',
        result.data,
        (pet) => pet.minepet_id,
        (pet) => `#${pet.minepet_id} - ${pet.name}`,
        'Select minepet'
      );
    });
  };

  loadMinepets();

  const createForm = document.getElementById('createMinepetForm');
  if (createForm) {
    createForm.addEventListener('submit', (event) => {
      event.preventDefault();
      clearMessage('createMinepetMessage');

      const name = document.getElementById('createMinepetName').value.trim();
      const description = document.getElementById('createMinepetDescription').value.trim();
      const base_hp = Number(document.getElementById('createMinepetHp').value);
      const base_atk = Number(document.getElementById('createMinepetAtk').value);
      const base_def = Number(document.getElementById('createMinepetDef').value);
      request('/minepet', {
        method: 'POST',
        body: JSON.stringify({ name, description, base_hp, base_atk, base_def })
      }).then((result) => {
        if (!result.ok) {
          showMessage('createMinepetMessage', result.data.message || 'Create failed', 'danger');
          return;
        }
        showMessage('createMinepetMessage', 'Minepet created!', 'success');
        createForm.reset();
        loadMinepets();
      });
    });
  }

  const updateForm = document.getElementById('updateMinepetForm');
  if (updateForm) {
    updateForm.addEventListener('submit', (event) => {
      event.preventDefault();
      clearMessage('updateMinepetMessage');

      const id = document.getElementById('updateMinepetId').value;
      const name = document.getElementById('updateMinepetName').value.trim();
      const description = document.getElementById('updateMinepetDescription').value.trim();
      const base_hp = Number(document.getElementById('updateMinepetHp').value);
      const base_atk = Number(document.getElementById('updateMinepetAtk').value);
      const base_def = Number(document.getElementById('updateMinepetDef').value);
      request(`/minepet/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ name, description, base_hp, base_atk, base_def })
      }).then((result) => {
        if (!result.ok) {
          showMessage('updateMinepetMessage', result.data.message || 'Update failed', 'danger');
          return;
        }
        showMessage('updateMinepetMessage', 'Minepet updated!', 'success');
        updateForm.reset();
        loadMinepets();
      });
    });
  }

  const deleteForm = document.getElementById('deleteMinepetForm');
  if (deleteForm) {
    deleteForm.addEventListener('submit', (event) => {
      event.preventDefault();
      clearMessage('deleteMinepetMessage');

      const id = document.getElementById('deleteMinepetId').value;
      request(`/minepet/${id}`, { method: 'DELETE' }).then((result) => {
        if (!result.ok && result.status !== 204) {
          showMessage('deleteMinepetMessage', result.data.message || 'Delete failed', 'danger');
          return;
        }
        showMessage('deleteMinepetMessage', 'Minepet deleted!', 'success');
        deleteForm.reset();
        loadMinepets();
      });
    });
  }
});

