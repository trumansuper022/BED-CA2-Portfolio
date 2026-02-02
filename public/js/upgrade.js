document.addEventListener('DOMContentLoaded', () => {
  requireAuth();
  const normalForm = document.getElementById('upgradeForm');
  const isAdmin = (localStorage.getItem('username') || '').toLowerCase() === 'admin';

  const populatePlayerSelects = (players) => {
    populateSelect(
      'upgradeUserId',
      players,
      (player) => player.user_id,
      (player) => `#${player.user_id} - ${player.username}`,
      'Select player'
    );
    populateSelect(
      'gambleUserId',
      players,
      (player) => player.user_id,
      (player) => `#${player.user_id} - ${player.username}`,
      'Select player'
    );
    populateSelect(
      'evolveUserId',
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

  const loadInventoryForUser = (userId) => {
    if (!userId) return;
    request(`/inventory/user/${userId}`, { method: 'GET' }).then((result) => {
      if (result.ok) {
        const inventory = result.data || [];
        populateSelect(
          'upgradeInventoryId',
          inventory,
          (inv) => inv.inventory_id,
          (inv) => {
            if (inv.evolved_minepet_id != null) {
              return `#${inv.inventory_id} - ${inv.evolved_name || 'Evolved'} (Evolved)`;
            }
            return `#${inv.inventory_id} - ${inv.minepet_name || 'Minepet'}`;
          },
          'Select inventory'
        );
        populateSelect(
          'gambleInventoryId',
          inventory,
          (inv) => inv.inventory_id,
          (inv) => {
            if (inv.evolved_minepet_id != null) {
              return `#${inv.inventory_id} - ${inv.evolved_name || 'Evolved'} (Evolved)`;
            }
            return `#${inv.inventory_id} - ${inv.minepet_name || 'Minepet'}`;
          },
          'Select inventory'
        );

        const baseMinepets = inventory.filter((inv) => inv.minepet_id != null);
        populateSelect(
          'evolveMinepetInventoryId',
          baseMinepets,
          (inv) => inv.inventory_id,
          (inv) => `#${inv.inventory_id} - ${inv.minepet_name || 'Minepet'} (#${inv.minepet_id})`,
          'Select minepet'
        );

        const evoMinepetSelect = document.getElementById('evolveMinepetInventoryId');
        if (evoMinepetSelect && evoMinepetSelect.value) {
          evoMinepetSelect.dispatchEvent(new Event('change'));
        }

        const netherStars = inventory.filter((inv) => inv.item_name === 'Nether Star');
        populateSelect(
          'evolveNetherStarId',
          netherStars,
          (inv) => inv.inventory_id,
          (inv) => `#${inv.inventory_id} - Nether Star`,
          'Select Nether Star'
        );
      }
    });
  };

  const seedDefaults = (players) => {
    setDefaultPlayer('upgradeUserId', players);
    setDefaultPlayer('gambleUserId', players);
    setDefaultPlayer('evolveUserId', players);
    const defaultUserId = document.getElementById('upgradeUserId').value;
    if (defaultUserId) {
      loadInventoryForUser(defaultUserId);
    }
  };

  if (isAdmin) {
    loadAllPlayers().then(seedDefaults);
  } else {
    loadMyPlayers().then(seedDefaults);
  }

  const upgradeUserSelect = document.getElementById('upgradeUserId');
  const evolveUserSelect = document.getElementById('evolveUserId');
  if (upgradeUserSelect) {
    upgradeUserSelect.addEventListener('change', () => {
      loadInventoryForUser(upgradeUserSelect.value);
    });
  }
  if (evolveUserSelect) {
    evolveUserSelect.addEventListener('change', () => {
      loadInventoryForUser(evolveUserSelect.value);
    });
  }
  if (normalForm) {
    normalForm.addEventListener('submit', (event) => {
      event.preventDefault();
      clearMessage('upgradeMessage');

      const user_id = Number(document.getElementById('upgradeUserId').value);
      const inventory_id = Number(document.getElementById('upgradeInventoryId').value);
      const stat = document.getElementById('upgradeStat').value;

      request('/upgrade', {
        method: 'POST',
        body: JSON.stringify({ user_id, inventory_id, stat })
      }).then((result) => {
        if (!result.ok) {
          showMessage('upgradeMessage', result.data.message || 'Upgrade failed', 'danger');
          return;
        }
        showMessage('upgradeMessage', result.data.message || 'Upgraded!', 'success');
      });
    });
  }

  const gambleForm = document.getElementById('gambleForm');
  if (gambleForm) {
    gambleForm.addEventListener('submit', (event) => {
      event.preventDefault();
      clearMessage('gambleMessage');

      const user_id = Number(document.getElementById('gambleUserId').value);
      const inventory_id = Number(document.getElementById('gambleInventoryId').value);

      request('/upgrade/gamble', {
        method: 'POST',
        body: JSON.stringify({ user_id, inventory_id })
      }).then((result) => {
        if (!result.ok) {
          showMessage('gambleMessage', result.data.message || 'Gamble failed', 'danger');
          return;
        }
        showMessage('gambleMessage', result.data.message || 'Gamble complete!', 'success');
      });
    });
  }

  const evolveForm = document.getElementById('evolveForm');
  if (evolveForm) {
    const minepetSelect = document.getElementById('evolveMinepetInventoryId');
    const evolvedSelect = document.getElementById('evolveEvolvedId');

    const loadEvolutions = (inventoryId) => {
      if (!inventoryId) {
        populateSelect('evolveEvolvedId', [], () => '', () => '', 'Select evolution');
        return;
      }

      request(`/inventory/${inventoryId}`, { method: 'GET' }).then((result) => {
        if (!result.ok || !result.data) {
          populateSelect('evolveEvolvedId', [], () => '', () => '', 'Select evolution');
          return;
        }
        const baseId = result.data.minepet_id;
        if (!baseId) {
          populateSelect('evolveEvolvedId', [], () => '', () => '', 'Select evolution');
          return;
        }

        request(`/evolvedminepet/base/${baseId}`, { method: 'GET' }).then((evoResult) => {
          if (!evoResult.ok) {
            populateSelect('evolveEvolvedId', [], () => '', () => '', 'Select evolution');
            return;
          }
          populateSelect(
            'evolveEvolvedId',
            evoResult.data,
            (evo) => evo.evolved_id,
            (evo) => `#${evo.evolved_id} - ${evo.name}`,
            'Select evolution'
          );
        });
      });
    };

    if (minepetSelect) {
      minepetSelect.addEventListener('change', () => {
        loadEvolutions(minepetSelect.value);
      });
    }

    evolveForm.addEventListener('submit', (event) => {
      event.preventDefault();
      clearMessage('evolveMessage');

      const user_id = Number(document.getElementById('evolveUserId').value);
      const minepet_inventory_id = Number(document.getElementById('evolveMinepetInventoryId').value);
      const evolved_id = Number(document.getElementById('evolveEvolvedId').value);
      const nether_star_inventory_id = Number(document.getElementById('evolveNetherStarId').value);

      if (!confirm('Evolve this minepet? This will consume a Nether Star.')) {
        return;
      }

      request('/upgrade/evolve', {
        method: 'POST',
        body: JSON.stringify({ user_id, minepet_inventory_id, evolved_id, nether_star_inventory_id })
      }).then((result) => {
        if (!result.ok) {
          showMessage('evolveMessage', result.data.message || 'Evolution failed', 'danger');
          return;
        }
        showMessage('evolveMessage', result.data.message || 'Evolution complete!', 'success');
        evolveForm.reset();
        loadInventoryForUser(document.getElementById('evolveUserId').value);
      });
    });
  }
});

