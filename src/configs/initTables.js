const pool = require('../services/db');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const callback = (error) => {
  if (error) {
    console.error('Error creating tables:', error);
  } else {
    console.log('Tables created successfully');
  }
  process.exit();
};

bcrypt.hash('1234', saltRounds, (errorAdmin, adminHash) => {
  if (errorAdmin) {
    console.error('Error hashing password:', errorAdmin);
    process.exit(1);
  }

  bcrypt.hash('12345', saltRounds, (errorTest, testHash) => {
    if (errorTest) {
      console.error('Error hashing password:', errorTest);
      process.exit(1);
    }

    const SQLSTATEMENT = `
DROP TABLE IF EXISTS Fight;
DROP TABLE IF EXISTS Inventory;
DROP TABLE IF EXISTS MobShop;
DROP TABLE IF EXISTS ItemShop;
DROP TABLE IF EXISTS Item;
DROP TABLE IF EXISTS EvolvedMinepet;
DROP TABLE IF EXISTS MinePet;
DROP TABLE IF EXISTS UserCompletion;
DROP TABLE IF EXISTS WellnessChallenge;
DROP TABLE IF EXISTS Crafters;
DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Crafters (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  points INT DEFAULT 0,
  owner_user_id INT NULL
);

CREATE TABLE WellnessChallenge (
  challenge_id INT AUTO_INCREMENT PRIMARY KEY,
  creator_id INT NOT NULL,
  description TEXT NOT NULL,
  points INT NOT NULL
);

CREATE TABLE UserCompletion (
  completion_id INT AUTO_INCREMENT PRIMARY KEY,
  challenge_id INT NOT NULL,
  user_id INT NOT NULL,
  details TEXT
);

CREATE TABLE MinePet (
  minepet_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  base_hp INT NOT NULL,
  base_atk INT NOT NULL,
  base_def INT NOT NULL
);

CREATE TABLE EvolvedMinepet (
  evolved_id INT AUTO_INCREMENT PRIMARY KEY,
  base_minepet_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  base_hp INT NOT NULL,
  base_atk INT NOT NULL,
  base_def INT NOT NULL
);

CREATE TABLE Item (
  item_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  bonus_hp INT DEFAULT 0,
  bonus_atk INT DEFAULT 0,
  bonus_def INT DEFAULT 0
);

CREATE TABLE MobShop (
  mobshop_id INT AUTO_INCREMENT PRIMARY KEY,
  minepet_id INT DEFAULT NULL,
  price_points INT NOT NULL
);

CREATE TABLE ItemShop (
  itemshop_id INT AUTO_INCREMENT PRIMARY KEY,
  item_id INT DEFAULT NULL,
  price_points INT NOT NULL
);

CREATE TABLE Inventory (
  inventory_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  minepet_id INT DEFAULT NULL,
  evolved_minepet_id INT DEFAULT NULL,
  item_id INT DEFAULT NULL,
  bonus_hp INT NOT NULL DEFAULT 0,
  bonus_atk INT NOT NULL DEFAULT 0,
  bonus_def INT NOT NULL DEFAULT 0,
  quantity INT NOT NULL DEFAULT 1,
  applied_item_id INT NULL
);

CREATE TABLE Fight (
  fight_id INT AUTO_INCREMENT PRIMARY KEY,
  attacker_id INT NOT NULL,
  defender_id INT NOT NULL,
  winner_id INT DEFAULT NULL,
  is_finished TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO Users (username, email, password) VALUES
  ('admin', 'a@a.com', '${adminHash}'),
  ('TestAcc', 'TestAcc@gmail.com', '${testHash}');

INSERT INTO Crafters (username, points, owner_user_id) VALUES
  ('SigmundChadBroski', 1000, 1),
  ('PersonaFnatic', 1200, 1),
  ('PixelatedTragedy', 1500, 1),
  ('ThomasChochu', 1800, 1),
  ('TestCrafterA', 650, 2),
  ('TestCrafterB', 720, 2);

INSERT INTO WellnessChallenge (creator_id, description, points) VALUES
  (1, 'Sleep 7+ hours tonight and avoid screens 30 minutes before bed.', 20),
  (1, 'Take the stairs instead of the elevator for the whole day.', 15),
  (2, 'Do a 20-minute walk outside and focus on your breathing.', 15),
  (2, 'Drink at least 8 cups of water today and avoid sugary drinks.', 10),
  (3, 'Spend 30 minutes away from all social media before sleeping.', 20),
  (3, 'Stretch for 10 minutes after you wake up and before bed.', 10),
  (4, 'Declutter your study or work desk for at least 15 minutes.', 20),
  (4, 'Write down three things you are grateful for today.', 10),
  (5, 'TestAcc: Do 10 push-ups before breakfast.', 12),
  (6, 'TestAcc: Take a 15-minute walk after dinner.', 14);

INSERT INTO MinePet (name, description, base_hp, base_atk, base_def) VALUES
  ('Slime',          'A vicious bouncing blob that overwhelms its foes.',                        40,  6,  3),
  ('Zombie',         'Relentless undead that swarms enemies without mercy.',                    55,  7,  4),
  ('Skeleton',       'A deadly archer that picks off enemies from afar.',                       45,  9,  3),
  ('Enderman',       'A shadowy stalker that teleports and strikes with lethal force.',         70, 11,  5),
  ('Creeper',        'Silent and explosive, ready to obliterate anything near.',                35, 13,  2),
  ('Spider',         'A relentless climber with poisonous strikes.',                            42,  8,  4),
  ('Piglin Rangers', 'A coordinated squad of three piglins: one crossbow, two swordfighters.',  85, 12,  7),
  ('Iron Golem',     'Massive, nearly unstoppable guardian forged to protect.',                130, 14, 12),
  ('Nitwit Gang',    'A chaotic mob of nitwits with torches and blades, dangerous in numbers.', 75, 10,  6),
  ('Bee',            'A buzzing swarm of angry bees, deadly when grouped together.',            45, 11,  3),
  ('Wither Boss',    'Three-headed abomination that rains explosive skulls.',                  200, 25, 12),
  ('Ender Dragon',   'The final airborne terror ruling the void.',                             250, 30, 15),
  ('Blaze',          'A fiery floating mob that hurls blazing projectiles.',                     60, 13,  4),
  ('Breeze',         'A wind-based foe that dodges and strikes with gusts.',                     55, 12,  5),
  ('Copper Golem',   'A quirky copper-built guardian that shocks and stuns.',                   80, 10,  8),
  ('Guardian',       'An underwater sentinel firing laser beams.',                              95, 14,  9),
  ('Polar Bear',     'A fierce arctic predator with crushing swipes.',                           90, 13,  8),
  ('Warden',         'A terrifying ancient guardian that hits with unstoppable force.',        220, 24, 14),
  ('Pillager',       'A hostile raider that fires bolts from a crossbow.',                       65, 12,  5),
  ('Wolf',           'A loyal hunter that fights alongside its crafter.',                        70, 12,  6),
  ('Creaking',       'A creepy forest stalker that strikes when watched.',                       85, 15,  7);

INSERT INTO Item (name, description, type, bonus_hp, bonus_atk, bonus_def) VALUES
  ('Shield', 'Reduces incoming damage for your pet.', 'armor', 0, 0, 4),
  ('Iron Armor', 'Solid protection with small drawbacks.', 'armor', -2, 0, 6),
  ('Diamond Armor', 'Very strong protective armor.', 'rare', -5, 0, 10),
  ('Netherite Armor', 'Elite armor surpassing diamond protection.', 'legendary', -4, 0, 14),
  ('Anvil', 'Greatly boosts defense but is crushingly heavy.', 'armor', -10, 0, 12),
  ('Wolf Armor', 'Exclusive to Wolf minepets. Heavy protection.', 'exclusive', 15, 0, 10),

  ('Iron Sword', 'Increases your pet''s attack power.', 'weapon', 0, 5, -1),
  ('Bow', 'Ranged damage boost at the cost of some defense.', 'weapon', 0, 5, -2),
  ('Crossbow', 'Powerful ranged damage with a defense penalty.', 'weapon', 0, 7, -3),
  ('Spear', 'Strong attack with a slight defense penalty.', 'weapon', 0, 8, -2),
  ('Mace', 'Massive attack power with no drawbacks.', 'weapon', 0, 10, 0),
  ('Flint and Steel', 'Adds a bit of extra fire damage.', 'weapon', 0, 6, -2),

  ('Golden Apple', 'Boosts your pet''s health for battles.', 'consumable', 20, -1, 0),
  ('Potion of Healing', 'Restores health when used.', 'consumable', 30, 0, -2),

  ('Ender Pearl', 'Special item with teleporting properties.', 'special', -2, 2, 0),
  ('Fishing Rod', 'Handy tool for catching resources.', 'special', 0, 2, 1),
  ('Clock', 'Improves timing and defense at a small health cost.', 'special', -3, 0, 4),

  ('Enchanted Book', 'Rare artifact containing powerful enchantments.', 'rare', -4, 4, 4),
  ('Brewing Station', 'Expensive setup that boosts all stats.', 'rare', 6, 4, 4),
  ('Totem of Undying', 'Prevents pet from dying once in battle.', 'legendary', 50, -2, 6),

  ('Beehive', 'Exclusive to Bee minepets. Greatly boosts them.', 'exclusive', 15, 2, 0),
  ('Spawner', 'Exclusive to undead mobs. Doubles their vitality.', 'exclusive', 25, 0, 0),
  ('Trial Chamber', 'Exclusive to Zombie/Skeleton/Slime mobs. Powerful boost.', 'exclusive', 20, 8, 6),

  ('Nether Star', 'A cosmic relic used to evolve Minepets.', 'legendary', 0, 0, 0);

INSERT INTO EvolvedMinepet (base_minepet_id, name, description, base_hp, base_atk, base_def) VALUES
  (2, 'Drowned', 'An aquatic zombie that strikes from rivers with chilling precision.', 70, 10, 6),
  (2, 'Husk', 'A desert zombie that hits harder under the scorching sun.', 75, 11, 6),
  (3, 'Bogged', 'A swamp skeleton that spreads decay with every shot.', 60, 12, 5),
  (3, 'Parched', 'A dried-out skeleton from the badlands that fires mercilessly.', 62, 13, 5),
  (3, 'Stray', 'An icy skeleton with slow-frost arrows that sap strength.', 60, 11, 7),
  (3, 'Wither Skeleton', 'A dark nether skeleton that strikes with withering blows.', 70, 14, 8),
  (1, 'Magma Cube', 'A blazing slime variant that leaves scorched ground behind.', 55, 11, 6),
  (9, 'Villager Guards', 'Armored villagers defending their town with discipline.', 95, 14, 10),
  (6, 'Cave Spider', 'A venomous spider that strikes from the shadows.', 55, 12, 6),
  (6, 'Spider Jockey', 'A skeleton rider on a spider, deadly at all ranges.', 65, 13, 6),
  (5, 'Charged Creeper', 'An electrified creeper with devastating explosions.', 50, 18, 6),
  (7, 'Elite Piglins', 'Highly trained piglin warriors with brutal tactics.', 110, 16, 10),
  (7, 'Zombie Piglin Horde', 'A corrupted piglin pack that fights relentlessly.', 120, 17, 9),
  (16, 'Elder Guardian', 'An ancient guardian with devastating laser blasts.', 140, 18, 14),
  (20, 'Ravager', 'A raider beast upgraded from a pillager.', 180, 20, 12),
  (20, 'Vindicator', 'A fierce raider wielding a heavy axe.', 90, 18, 8),
  (20, 'Evoker', 'A spellcaster that summons fangs and vexes.', 85, 17, 8);

INSERT INTO MobShop (minepet_id, price_points) VALUES
  (1,  30),
  (2,  45),
  (3,  50),
  (4,  85),
  (5,  70),
  (6,  40),
  (7,  80),
  (8, 170),
  (9,  55),
  (10, 25);

INSERT INTO ItemShop (item_id, price_points) VALUES
  (1, 80),
  (2, 100),
  (3, 130),
  (4, 120),
  (5, 160),
  (6, 90),
  (7, 220),
  (8, 160),
  (9, 450),
  (10, 900),
  (11, 5000),
  (12, 700),
  (13, 260),
  (14, 300),
  (15, 360),
  (16, 1200),
  (17, 280),
  (18, 1000),
  (19, 850),
  (20, 1400),
  (21, 1700),
  (22, 2000),
  (23, 1600),
  (24, 1200);

INSERT INTO Inventory (user_id, minepet_id, evolved_minepet_id, item_id, bonus_hp, bonus_atk, bonus_def, quantity) VALUES
  (1, 4, NULL, NULL, 0, 0, 0, 1),
  (1, NULL, NULL, 2, 0, 0, 0, 1),
  (1, NULL, NULL, 3, 0, 0, 0, 1),

  (2, 1, NULL, NULL, 0, 0, 0, 1),
  (2, 7, NULL, NULL, 0, 0, 0, 1),
  (2, NULL, NULL, 1, 0, 0, 0, 1),
  (2, NULL, NULL, 5, 0, 0, 0, 1),

  (3, 3, NULL, NULL, 0, 0, 0, 1),
  (3, 5, NULL, NULL, 0, 0, 0, 1),
  (3, NULL, NULL, 4, 0, 0, 0, 1),
  (3, NULL, NULL, 8, 0, 0, 0, 1),

  (4, 2, NULL, NULL, 0, 0, 0, 1),
  (4, 6, NULL, NULL, 0, 0, 0, 1),
  (4, 8, NULL, NULL, 0, 0, 0, 1),
  (4, 9, NULL, NULL, 0, 0, 0, 1),
  (4, NULL, NULL, 1, 0, 0, 0, 1),
  (4, NULL, NULL, 9, 0, 0, 0, 1),

  (5, 1, NULL, NULL, 0, 0, 0, 1),
  (5, 4, NULL, NULL, 0, 0, 0, 1),
  (5, NULL, NULL, 2, 0, 0, 0, 1),
  (5, NULL, NULL, 3, 0, 0, 0, 1),
  (5, NULL, NULL, 8, 0, 0, 0, 1),

  (6, 2, NULL, NULL, 0, 0, 0, 1),
  (6, 5, NULL, NULL, 0, 0, 0, 1),
  (6, 8, NULL, NULL, 0, 0, 0, 1),
  (6, NULL, NULL, 1, 0, 0, 0, 1),
  (6, NULL, NULL, 6, 0, 0, 0, 1);

INSERT INTO Fight (attacker_id, defender_id, winner_id, is_finished) VALUES
  (1, 2, 1, 1),
  (1, 2, 1, 1),
  (1, 2, 2, 1),
  (2, 3, 3, 1),
  (2, 3, 3, 1),
  (4, 1, 4, 1),
  (4, 1, 1, 1),
  (5, 6, 5, 1),
  (5, 6, 5, 1),
  (6, 5, 6, 1),
  (6, 5, 6, 1);
`;

    pool.query(SQLSTATEMENT, callback);
  });
});
