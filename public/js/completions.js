document.addEventListener('DOMContentLoaded', () => {
  requireAuth();
  const loadCompletions = () => {
    request('/usercompletion', { method: 'GET' }).then((result) => {
      if (!result.ok) {
        showMessage('completionMessage', result.data.message || 'Failed to load completions', 'danger');
        return;
      }

      renderList('completionList', result.data, (completion) => `
        <h5>Completion #${completion.completion_id}</h5>
        <div>Crafter: ${completion.user_id}</div>
        <div>Challenge: ${completion.challenge_id}</div>
        <div>${completion.details || ''}</div>
      `);

      populateSelect(
        'deleteCompletionId',
        result.data,
        (completion) => completion.completion_id,
        (completion) => `#${completion.completion_id} - Crafter ${completion.user_id}`,
        'Select completion'
      );
    });
  };

  loadCompletions();

  loadAllPlayers().then((players) => {
    populateSelect(
      'completionUserId',
      players,
      (player) => player.user_id,
      (player) => `#${player.user_id} - ${player.username}`,
      'Select player'
    );
  });

  loadMyPlayers().then((myPlayers) => {
    setDefaultPlayer('completionUserId', myPlayers);
  });

  request('/challenge', { method: 'GET' }).then((result) => {
    if (result.ok) {
      populateSelect(
        'completionChallengeId',
        result.data,
        (challenge) => challenge.challenge_id,
        (challenge) => `#${challenge.challenge_id} - ${challenge.description}`,
        'Select challenge'
      );
    }
  });

  const createForm = document.getElementById('createCompletionForm');
  if (createForm) {
    createForm.addEventListener('submit', (event) => {
      event.preventDefault();
      clearMessage('createCompletionMessage');

      const user_id = Number(document.getElementById('completionUserId').value);
      const challenge_id = Number(document.getElementById('completionChallengeId').value);

      request('/usercompletion', {
        method: 'POST',
        body: JSON.stringify({ user_id, challenge_id })
      }).then((result) => {
        if (!result.ok) {
          showMessage('createCompletionMessage', result.data.message || 'Create failed', 'danger');
          return;
        }
        showMessage('createCompletionMessage', 'Completion recorded!', 'success');
        createForm.reset();
        loadCompletions();
      });
    });
  }

  const deleteForm = document.getElementById('deleteCompletionForm');
  if (deleteForm) {
    deleteForm.addEventListener('submit', (event) => {
      event.preventDefault();
      clearMessage('deleteCompletionMessage');

      const completionId = document.getElementById('deleteCompletionId').value;
      request(`/usercompletion/${completionId}`, { method: 'DELETE' }).then((result) => {
        if (!result.ok && result.status !== 204) {
          showMessage('deleteCompletionMessage', result.data.message || 'Delete failed', 'danger');
          return;
        }
        showMessage('deleteCompletionMessage', 'Completion deleted!', 'success');
        deleteForm.reset();
        loadCompletions();
      });
    });
  }
});

