document.addEventListener('DOMContentLoaded', () => {
  requireAuth();
  const MAX_CHALLENGE_POINTS = 100;
  const crafterSelect = document.getElementById('createChallengeCrafter');

  loadMyPlayers().then((players) => {
    populateSelect(
      'createChallengeCrafter',
      players,
      (player) => player.user_id,
      (player) => `#${player.user_id} - ${player.username}`,
      'Select crafter'
    );
    setDefaultPlayer('createChallengeCrafter', players);
  });
  const loadChallenges = () => {
    request('/challenge', { method: 'GET' }).then((result) => {
      if (!result.ok) {
        showMessage('challengeListMessage', result.data.message || 'Failed to load challenges', 'danger');
        return;
      }

      renderList('challengeList', result.data, (challenge) => `
        <h5>Challenge #${challenge.challenge_id}</h5>
        <div>${challenge.description}</div>
        <div>Creator: ${challenge.creator_id} (${challenge.creator_name || '-'})</div>
        <div>Emeralds: ${challenge.points}</div>
      `);

      populateSelect(
        'updateChallengeId',
        result.data,
        (challenge) => challenge.challenge_id,
        (challenge) => `#${challenge.challenge_id} - ${challenge.description}`,
        'Select challenge'
      );
      populateSelect(
        'deleteChallengeId',
        result.data,
        (challenge) => challenge.challenge_id,
        (challenge) => `#${challenge.challenge_id} - ${challenge.description}`,
        'Select challenge'
      );
    });
  };

  loadChallenges();

  const createForm = document.getElementById('createChallengeForm');
  if (createForm) {
    createForm.addEventListener('submit', (event) => {
      event.preventDefault();
      clearMessage('createChallengeMessage');

      const creator_id = Number(document.getElementById('createChallengeCrafter').value);
      const description = document.getElementById('createDescription').value.trim();
      const points = Number(document.getElementById('createEmeralds').value);

      if (!creator_id) {
        showMessage('createChallengeMessage', 'Select a crafter', 'danger');
        return;
      }
      if (points > MAX_CHALLENGE_POINTS) {
        showMessage('createChallengeMessage', `Emeralds must be <= ${MAX_CHALLENGE_POINTS}`, 'danger');
        return;
      }

      request('/challenge', {
        method: 'POST',
        body: JSON.stringify({ creator_id, description, points })
      }).then((result) => {
        if (!result.ok) {
          showMessage('createChallengeMessage', result.data.message || 'Create failed', 'danger');
          return;
        }
        showMessage('createChallengeMessage', 'Challenge created!', 'success');
        createForm.reset();
        loadChallenges();
      });
    });
  }

  const updateForm = document.getElementById('updateChallengeForm');
  if (updateForm) {
    updateForm.addEventListener('submit', (event) => {
      event.preventDefault();
      clearMessage('updateChallengeMessage');

      const challenge_id = Number(document.getElementById('updateChallengeId').value);
      const description = document.getElementById('updateDescription').value.trim();
      const points = Number(document.getElementById('updateEmeralds').value);

      if (points > MAX_CHALLENGE_POINTS) {
        showMessage('updateChallengeMessage', `Emeralds must be <= ${MAX_CHALLENGE_POINTS}`, 'danger');
        return;
      }

      request(`/challenge/${challenge_id}`, {
        method: 'PUT',
        body: JSON.stringify({ description, points })
      }).then((result) => {
        if (!result.ok) {
          showMessage('updateChallengeMessage', result.data.message || 'Update failed', 'danger');
          return;
        }
        showMessage('updateChallengeMessage', 'Challenge updated!', 'success');
        updateForm.reset();
        loadChallenges();
      });
    });
  }

  const deleteForm = document.getElementById('deleteChallengeForm');
  if (deleteForm) {
    deleteForm.addEventListener('submit', (event) => {
      event.preventDefault();
      clearMessage('deleteChallengeMessage');

      const challengeId = document.getElementById('deleteChallengeId').value;
      request(`/challenge/${challengeId}`, { method: 'DELETE' }).then((result) => {
        if (!result.ok && result.status !== 204) {
          showMessage('deleteChallengeMessage', result.data.message || 'Delete failed', 'danger');
          return;
        }
        showMessage('deleteChallengeMessage', 'Challenge deleted!', 'success');
        deleteForm.reset();
        loadChallenges();
      });
    });
  }
});

