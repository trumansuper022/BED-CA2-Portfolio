// Select helpers for dropdowns
const populateSelect = (selectId, items, valueFn, labelFn, placeholder) => {
  const select = document.getElementById(selectId);
  if (!select) return;

  select.innerHTML = '';

  if (placeholder) {
    const opt = document.createElement('option');
    opt.value = '';
    opt.textContent = placeholder;
    select.appendChild(opt);
  }

  items.forEach((item) => {
    const opt = document.createElement('option');
    opt.value = valueFn(item);
    opt.textContent = labelFn(item);
    select.appendChild(opt);
  });
};

const loadAllPlayers = () => {
  return request('/user', { method: 'GET' }).then((result) => {
    if (!result.ok) return [];
    return result.data || [];
  });
};

const loadMyPlayers = () => {
  return request('/user/mine', { method: 'GET' }).then((result) => {
    if (!result.ok) return [];
    return result.data || [];
  });
};

const setDefaultPlayer = (selectId, players) => {
  if (!players || players.length === 0) return;
  const select = document.getElementById(selectId);
  if (!select) return;
  select.value = players[0].user_id;
  localStorage.setItem('currentPlayerId', players[0].user_id);
};

