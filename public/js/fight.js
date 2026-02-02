document.addEventListener('DOMContentLoaded', () => {
  requireAuth();
  const form = document.getElementById('fightForm');
  if (!form) return;

  const loadMinepetsForPlayer = (playerId, targetSelectId, placeholder) => {
    if (!playerId) {
      populateSelect(targetSelectId, [], () => '', () => '', placeholder);
      return;
    }

    request(`/inventory/user/${playerId}`, { method: 'GET' }).then((result) => {
      if (!result.ok) {
        populateSelect(targetSelectId, [], () => '', () => '', placeholder);
        return;
      }

      const minepets = (result.data || []).filter((inv) => inv.minepet_id != null || inv.evolved_minepet_id != null);
      populateSelect(
        targetSelectId,
        minepets,
        (inv) => inv.inventory_id,
        (inv) => {
          if (inv.evolved_minepet_id != null) {
            return `#${inv.inventory_id} - ${inv.evolved_name || 'Evolved'} (Evolved)`;
          }
          return `#${inv.inventory_id} - ${inv.minepet_name || 'Minepet'}`;
        },
        placeholder
      );
    });
  };

  loadAllPlayers().then((players) => {
    populateSelect(
      'attackerId',
      players,
      (player) => player.user_id,
      (player) => `#${player.user_id} - ${player.username}`,
      'Select attacker'
    );
    populateSelect(
      'defenderId',
      players,
      (player) => player.user_id,
      (player) => `#${player.user_id} - ${player.username}`,
      'Select defender'
    );
  });

  loadMyPlayers().then((myPlayers) => {
    setDefaultPlayer('attackerId', myPlayers);
    const attackerId = document.getElementById('attackerId').value;
    if (attackerId) {
      loadMinepetsForPlayer(attackerId, 'attackerPetId', 'Select attacker minepet');
    }
  });

  const attackerSelect = document.getElementById('attackerId');
  const defenderSelect = document.getElementById('defenderId');

  if (attackerSelect) {
    attackerSelect.addEventListener('change', () => {
      loadMinepetsForPlayer(attackerSelect.value, 'attackerPetId', 'Select attacker minepet');
    });
  }
  if (defenderSelect) {
    defenderSelect.addEventListener('change', () => {
      const isAdmin = (localStorage.getItem('username') || '').toLowerCase() === 'admin';
      if (isAdmin) {
        loadMinepetsForPlayer(defenderSelect.value, 'defenderPetId', 'Select defender minepet');
      } else {
        populateSelect('defenderPetId', [], () => '', () => '', 'Auto-pick defender minepet');
      }
    });
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearMessage('fightMessage');

    const attacker_id = Number(document.getElementById('attackerId').value);
    const defender_id = Number(document.getElementById('defenderId').value);
    const attacker_minepet_id = Number(document.getElementById('attackerPetId').value);
    let defender_minepet_id = Number(document.getElementById('defenderPetId').value);

    const isAdmin = (localStorage.getItem('username') || '').toLowerCase() === 'admin';

    if (!attacker_id || !defender_id) {
      showMessage('fightMessage', 'Select both attacker and defender.', 'danger');
      return;
    }
    if (!attacker_minepet_id) {
      showMessage('fightMessage', 'Select an attacker minepet.', 'danger');
      return;
    }
    if (isAdmin && !defender_minepet_id) {
      showMessage('fightMessage', 'Select a defender minepet.', 'danger');
      return;
    }

    if (!isAdmin && !defender_minepet_id) {
      defender_minepet_id = null;
    }

    request('/fight', {
      method: 'POST',
      body: JSON.stringify({ attacker_id, defender_id, attacker_minepet_id, defender_minepet_id })
    }).then((result) => {
      if (!result.ok) {
        showMessage('fightMessage', result.data.message || 'Fight failed', 'danger');
        return;
      }

      const log = document.getElementById('fightLog');
      if (log) {
        log.textContent = result.data.log || 'Fight resolved.';
      }
      showMessage('fightMessage', 'Fight complete!', 'success');
    });
  });

  const historyButton = document.getElementById('loadHistoryBtn');
  if (historyButton) {
    historyButton.addEventListener('click', () => {
      const historyContainer = document.getElementById('battleHistory');
      const countersContainer = document.getElementById('winCounters');
      const isOpen = historyContainer && historyContainer.children.length > 0;
      if (isOpen) {
        historyContainer.innerHTML = '';
        countersContainer.innerHTML = '';
        return;
      }

      request('/fight/history', { method: 'GET' }).then((result) => {
        if (!result.ok) {
          showMessage('fightMessage', result.data.message || 'Failed to load history', 'danger');
          return;
        }

        renderList('battleHistory', result.data, (fight) => `
          <h6 class='mc-small'>Fight #${fight.fight_id}</h6>
          <div class='mc-small'>${fight.attacker_name || 'Unknown'} vs ${fight.defender_name || 'Unknown'}</div>
          <div class='mc-small'>Winner: ${fight.winner_name || '-'}</div>
          <div>${fight.created_at || ''}</div>
        `);
      });

      request('/fight/wins', { method: 'GET' }).then((result) => {
        if (!result.ok) {
          showMessage('fightMessage', result.data.message || 'Failed to load win counters', 'danger');
          return;
        }

        renderList('winCounters', result.data, (row) => `
          <h6 class='mc-small'>${row.player_name || 'Player'} vs ${row.opponent_name || 'Opponent'}</h6>
          <div class='mc-small'>Wins: ${row.wins}</div>
        `);
      });
    });
  }
});

