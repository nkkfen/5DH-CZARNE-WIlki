/**
 * BAZA DANYCH - SQLite w jednym pliku (leaderboard.db).
 *
 * Dlaczego SQLite:
 * - zero konfiguracji (nie trzeba instalować/uruchamiać osobnego serwera bazy danych)
 * - to zwykły plik na dysku - łatwo go backupować (po prostu skopiuj plik)
 * - w zupełności wystarcza dla ruchu typu "kilkudziesięciu/kilkuset graczy"
 *
 * Jeśli w przyszłości strona bardzo urośnie, można łatwo przejść na Postgres -
 * cała logika zapytań jest odizolowana w tym jednym pliku.
 */

const path = require("path");
const Database = require("better-sqlite3");

// Plik bazy danych trzymamy obok kodu backendu, w backend/data/leaderboard.db
const DB_PATH = path.join(__dirname, "..", "data", "leaderboard.db");

const fs = require("fs");
const dataDir = path.join(__dirname, "..", "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(DB_PATH);

// Tworzymy tabelę, jeśli jeszcze nie istnieje.
db.exec(`
  CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    score INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

module.exports = db;
