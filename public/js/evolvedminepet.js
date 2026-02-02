document.addEventListener('DOMContentLoaded', () => {
  requireAuth();

  const loadEvolved = () => {
    request('/evolvedminepet', { method: 'GET' }).then((result) => {
      if (!result.ok) {
        showMessage('evolvedMessage', result.data.message || 'Failed to load evolved minepets', 'danger');
        return;
      }

      renderList('evolvedList', result.data, (pet) => `
        <img class='card-media mb-2' src='${getAssetImage('evolved', pet.name)}' alt='evolved minepet' />
        <h5>Evolved #${pet.evolved_id}</h5>
        <div>Base Minepet: #${pet.base_minepet_id}</div>
        <div>Name: ${pet.name}</div>
        <div>${pet.description}</div>
        <div>Base HP: ${pet.base_hp}</div>
        <div>Base ATK: ${pet.base_atk}</div>
        <div>Base DEF: ${pet.base_def}</div>
      `);

      populateSelect(
        'updateEvolvedId',
        result.data,
        (pet) => pet.evolved_id,
        (pet) => `#${pet.evolved_id} - ${pet.name}`,
        'Select evolved'
      );
      populateSelect(
        'deleteEvolvedId',
        result.data,
        (pet) => pet.evolved_id,
        (pet) => `#${pet.evolved_id} - ${pet.name}`,
        'Select evolved'
      );
    });
  };

  const loadBaseMinepets = () => {
    request('/minepet', { method: 'GET' }).then((result) => {
      if (!result.ok) return;
      populateSelect(
        'createEvolvedBaseId',
        result.data,
        (pet) => pet.minepet_id,
        (pet) => `#${pet.minepet_id} - ${pet.name}`,
        'Select base minepet'
      );
      populateSelect(
        'updateEvolvedBaseId',
        result.data,
        (pet) => pet.minepet_id,
        (pet) => `#${pet.minepet_id} - ${pet.name}`,
        'Select base minepet'
      );
    });
  };

  loadEvolved();
  loadBaseMinepets();

  const createForm = document.getElementById('createEvolvedForm');
  if (createForm) {
    createForm.addEventListener('submit', (event) => {
      event.preventDefault();
      clearMessage('createEvolvedMessage');

      const base_minepet_id = Number(document.getElementById('createEvolvedBaseId').value);
      const name = document.getElementById('createEvolvedName').value.trim();
      const description = document.getElementById('createEvolvedDescription').value.trim();
      const base_hp = Number(document.getElementById('createEvolvedHp').value);
      const base_atk = Number(document.getElementById('createEvolvedAtk').value);
      const base_def = Number(document.getElementById('createEvolvedDef').value);
      request('/evolvedminepet', {
        method: 'POST',
        body: JSON.stringify({ base_minepet_id, name, description, base_hp, base_atk, base_def })
      }).then((result) => {
        if (!result.ok) {
          showMessage('createEvolvedMessage', result.data.message || 'Create failed', 'danger');
          return;
        }
        showMessage('createEvolvedMessage', 'Evolved minepet created!', 'success');
        createForm.reset();
        loadEvolved();
      });
    });
  }

  const updateForm = document.getElementById('updateEvolvedForm');
  if (updateForm) {
    updateForm.addEventListener('submit', (event) => {
      event.preventDefault();
      clearMessage('updateEvolvedMessage');

      const id = document.getElementById('updateEvolvedId').value;
      const base_minepet_id = Number(document.getElementById('updateEvolvedBaseId').value);
      const name = document.getElementById('updateEvolvedName').value.trim();
      const description = document.getElementById('updateEvolvedDescription').value.trim();
      const base_hp = Number(document.getElementById('updateEvolvedHp').value);
      const base_atk = Number(document.getElementById('updateEvolvedAtk').value);
      const base_def = Number(document.getElementById('updateEvolvedDef').value);
      request(`/evolvedminepet/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ base_minepet_id, name, description, base_hp, base_atk, base_def })
      }).then((result) => {
        if (!result.ok) {
          showMessage('updateEvolvedMessage', result.data.message || 'Update failed', 'danger');
          return;
        }
        showMessage('updateEvolvedMessage', 'Evolved minepet updated!', 'success');
        updateForm.reset();
        loadEvolved();
      });
    });
  }

  const deleteForm = document.getElementById('deleteEvolvedForm');
  if (deleteForm) {
    deleteForm.addEventListener('submit', (event) => {
      event.preventDefault();
      clearMessage('deleteEvolvedMessage');

      const id = document.getElementById('deleteEvolvedId').value;
      request(`/evolvedminepet/${id}`, { method: 'DELETE' }).then((result) => {
        if (!result.ok && result.status !== 204) {
          showMessage('deleteEvolvedMessage', result.data.message || 'Delete failed', 'danger');
          return;
        }
        showMessage('deleteEvolvedMessage', 'Evolved minepet deleted!', 'success');
        deleteForm.reset();
        loadEvolved();
      });
    });
  }
});
