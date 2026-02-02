// Simple UI helpers
const showMessage = (elementId, message, type = 'info') => {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = message;
  el.className = `alert alert-${type}`;
  el.classList.remove('d-none');
};

const clearMessage = (elementId) => {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = '';
  el.classList.add('d-none');
};

const renderList = (containerId, items, renderItem) => {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  if (!items || items.length === 0) {
    container.innerHTML = "<div class='mc-muted'>No data yet.</div>";
    return;
  }

  items.forEach((item) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'mc-card p-3';
    wrapper.innerHTML = renderItem(item);
    container.appendChild(wrapper);
  });
};

const ASSET_IMAGES = {
  minepet: {
    'slime': 'slime1.png',
    'zombie': 'zombie.png',
    'skeleton': 'skeletonidle.png',
    'enderman': 'enderman.png',
    'creeper': 'creeper.png',
    'spider': 'spider1.png',
    'piglin rangers': 'triplepiglins.png',
    'iron golem': 'irongolem.png',
    'nitwit gang': 'nitwitgang1.png',
    'bee': 'angrybee1.png',
    'wither boss': 'wither1.png',
    'ender dragon': 'enderdragon1.png',
    'blaze': 'blaze1.png',
    'breeze': 'breeze.png',
    'copper golem': 'coppergolem.png',
    'guardian': 'guardian.png',
    'ravager': 'ravager.png',
    'polar bear': 'polarbear1.png',
    'warden': 'warden1.png',
    'pillager': 'pillager.png',
    'wolf': 'wolf.png',
    'creaking': 'creaking.png'
  },
  evolved: {
    'drowned': 'drowned.png',
    'husk': 'husk.png',
    'bogged': 'bogged.png',
    'parched': 'parched.png',
    'stray': 'stray.png',
    'wither skeleton': 'placeholder.svg',
    'magma cube': 'magma1.png',
    'villager guards': 'vindicatorangry.png',
    'cave spider': 'cavespider1.png',
    'spider jockey': 'spiderjockey1.png',
    'charged creeper': 'creeper.png',
    'elite piglins': 'piglinbrute.png',
    'zombie piglin horde': 'fullgoldzombiepiglin.png',
    'elder guardian': 'elderguardian.png',
    'ravager': 'ravager.png',
    'vindicator': 'vindicatorangry.png',
    'evoker': 'evoker.png'
  },
  item: {
    'shield': 'shield.png',
    'iron sword': 'ironsword.png',
    'golden apple': 'goldenapple.png',
    'flint and steel': 'flintandsteel.png',
    'ender pearl': 'enderpearl.png',
    'fishing rod': 'fishingrod.png',
    'enchanted book': 'enchantedbook.png',
    'potion of healing': 'potion.png',
    'diamond armor': 'diamondarmor.png',
    'totem of undying': 'totem.png',
    'nether star': 'placeholder.svg',
    'anvil': 'anvil.png',
    'iron armor': 'ironarmor.png',
    'bow': 'bow.png',
    'crossbow': 'crossbow.png',
    'brewing station': 'brewingstation.png',
    'clock': 'clock.png',
    'mace': 'mace.png',
    'spear': 'spear.png',
    'beehive': 'beehive.png',
    'spawner': 'spawner.png',
    'trial chamber': 'trailchamber.png',
    'wolf armor': 'wolfarmorwithwolf.png',
    'netherite armor': 'netheritearmor.png'
  }
};

const getAssetImage = (type, name) => {
  if (!name) return '/public/img/placeholder.svg';
  const key = String(name).toLowerCase().trim();
  const filename = (ASSET_IMAGES[type] && ASSET_IMAGES[type][key]) || 'placeholder.svg';
  return `/public/img/${filename}`;
};

const getInventoryImage = (entry) => {
  if (!entry) return '/public/img/placeholder.svg';
  if (entry.evolved_minepet_id != null) return getAssetImage('evolved', entry.evolved_name);
  if (entry.minepet_id != null) return getAssetImage('minepet', entry.minepet_name);
  if (entry.item_id != null) return getAssetImage('item', entry.item_name);
  return '/public/img/placeholder.svg';
};

