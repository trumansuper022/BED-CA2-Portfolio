# MinePets Wellness Challenge (CA2)

This project contains a Node.js + MySQL backend (CA1) and a Minecraft‑style frontend (CA2).

## Quick Start
1. Install dependencies: `npm install`
2. Configure `.env` with your DB credentials and JWT settings.
3. Start server: `node index.js`
4. Visit `http://localhost:9000/index.html`

## Auth
Auth uses bcrypt + JWT with callbacks/middleware chaining:
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/profile` (requires Bearer token)

### Users & Players Tables
Auth users are stored in a new `Users` table. The original `User` table now represents **Crafters** and is named `Crafters`.

Create the new `Users` table:
```sql
CREATE TABLE Users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);
```

Link Players to auth Users (add an owner column):
```sql
ALTER TABLE Crafters
  ADD COLUMN owner_user_id INT NULL;
```

If you want to enforce ownership with a foreign key:
```sql
ALTER TABLE Crafters
  ADD CONSTRAINT fk_players_owner
  FOREIGN KEY (owner_user_id) REFERENCES Users(user_id);
```

## Frontend Folder Structure
- HTML pages at repo root (e.g. `index.html`, `login.html`)
- JS scripts in `src/js`
- CSS/images in `src/public`

## Inventory Item Apply Feature
To allow applying an item to a minepet, add a slot column to `Inventory`:
```sql
ALTER TABLE Inventory
  ADD COLUMN applied_item_id INT NULL;
```

If you want to enforce only valid items, you can add a foreign key:
```sql
ALTER TABLE Inventory
  ADD CONSTRAINT fk_inventory_applied_item
  FOREIGN KEY (applied_item_id) REFERENCES Item(item_id);
```

## Notes
- All backend handlers use callbacks/middleware (no async/await).
- Replace `src/public/img/placeholder.svg` with your own Minecraft‑style assets.
