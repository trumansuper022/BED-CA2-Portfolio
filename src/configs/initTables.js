const pool = require("../services/db");

const SQLSTATEMENT = `

DROP TABLE IF EXISTS Fight;
DROP TABLE IF EXISTS Inventory;
DROP TABLE IF EXISTS MobShop;
DROP TABLE IF EXISTS ItemShop;
DROP TABLE IF EXISTS Item;
DROP TABLE IF EXISTS MinePet;
DROP TABLE IF EXISTS UserCompletion;
DROP TABLE IF EXISTS WellnessChallenge;
DROP TABLE IF EXISTS User;

CREATE TABLE User (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  points INT DEFAULT 0
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
  item_id INT DEFAULT NULL,
  bonus_hp INT NOT NULL DEFAULT 0,
  bonus_atk INT NOT NULL DEFAULT 0,
  bonus_def INT NOT NULL DEFAULT 0,
  quantity INT NOT NULL DEFAULT 1
);

CREATE TABLE Fight (
  fight_id INT AUTO_INCREMENT PRIMARY KEY,
  attacker_id INT NOT NULL,
  defender_id INT NOT NULL,
  winner_id INT DEFAULT NULL,
  is_finished TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO User (username, points) VALUES
  ('SigmundChadBroski', 1000),
  ('PersonaFnatic', 1200),
  ('PixelatedTragedy', 1500),
  ('ThomasChochu', 1800);

INSERT INTO WellnessChallenge (creator_id, description, points) VALUES
  (1, 'Sleep 7+ hours tonight and avoid screens 30 minutes before bed.', 20),
  (1, 'Take the stairs instead of the elevator for the whole day.', 15),
  (2, 'Do a 20-minute walk outside and focus on your breathing.', 15),
  (2, 'Drink at least 8 cups of water today and avoid sugary drinks.', 10),
  (3, 'Spend 30 minutes away from all social media before sleeping.', 20),
  (3, 'Stretch for 10 minutes after you wake up and before bed.', 10),
  (4, 'Declutter your study or work desk for at least 15 minutes.', 20),
  (4, 'Write down three things you are grateful for today.', 10);

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
  ('Ender Dragon',   'The final airborne terror ruling the void.',                             250, 30, 15);

INSERT INTO Item (name, description, type, bonus_hp, bonus_atk, bonus_def) VALUES
  ('Shield', 'Reduces incoming damage for your pet.', 'armor', 0, 0, 4),
  ('Iron Sword', 'Increases your pet''s attack power.', 'weapon', 0, 6, 0),
  ('Golden Apple', 'Boosts your pet''s health for battles.', 'consumable', 15, 0, 0),
  ('Flint and Steel', 'Adds a bit of extra fire damage.', 'weapon', 0, 5, 0),
  ('Ender Pearl', 'Special item with teleporting properties.', 'special', 0, 0, 0),
  ('Fishing Rod', 'Handy tool for catching resources.', 'special', 0, 0, 0),
  ('Enchanted Book', 'Rare artifact containing powerful enchantments.', 'rare', 0, 4, 4),
  ('Potion of Healing', 'Restores health when used.', 'consumable', 25, 0, 0),
  ('Diamond Armor', 'Very strong protective armor.', 'rare', 0, 0, 9),
  ('Totem of Undying', 'Prevents pet from dying once in battle.', 'legendary', 50, 0, 5),
  ('Netherite Greatsword', 'Very strong melee blade forged from netherite.', 'weapon', 0, 15, 0);

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
  (1, 50),
  (2, 60),
  (3, 70),
  (4, 50),
  (5, 80),
  (6, 50),
  (7, 130),
  (8, 75),
  (9, 150),
  (10, 600);

INSERT INTO Inventory (user_id, minepet_id, item_id, bonus_hp, bonus_atk, bonus_def, quantity) VALUES
  (1, 4, NULL, 0, 0, 0, 1),
  (1, NULL, 2, 0, 0, 0, 1),
  (1, NULL, 3, 0, 0, 0, 1),

  (2, 1, NULL, 0, 0, 0, 1),
  (2, 7, NULL, 0, 0, 0, 1),
  (2, NULL, 1, 0, 0, 0, 1),
  (2, NULL, 5, 0, 0, 0, 1),

  (3, 3, NULL, 0, 0, 0, 1),
  (3, 5, NULL, 0, 0, 0, 1),
  (3, NULL, 4, 0, 0, 0, 1),
  (3, NULL, 8, 0, 0, 0, 1),

  (4, 2, NULL, 0, 0, 0, 1),
  (4, 6, NULL, 0, 0, 0, 1),
  (4, 8, NULL, 0, 0, 0, 1),
  (4, 9, NULL, 0, 0, 0, 1),
  (4, NULL, 1, 0, 0, 0, 1),
  (4, NULL, 9, 0, 0, 0, 1);

`;

pool.query(SQLSTATEMENT, (error, results, fields) => {
  if (error) {
    console.error("Error creating tables:", error);
  } else {
    console.log("Tables created successfully");
  }
  process.exit();
});
