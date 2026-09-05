/**
 * SERWER - Express + SQLite.
 *
 * Endpointy:
 *  GET  /api/leaderboard        -> zwraca top wyniki (domyślnie 50, malejąco po score)
 *  POST /api/scores             -> zapisuje nowy wynik { name, score }
 *  GET  /health                 -> lekki "ping" bez dotykania bazy - do utrzymywania
 *                                   darmowego serwisu obudzonym (patrz README, sekcja
 *                                   "Backend zasypia - jak temu zapobiec")
 *
 * Uruchomienie lokalne:
 *   cd backend
 *   npm install
 *   npm start
 * Serwer wystartuje na http://localhost:3000
 */

const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db");
const { containsProfanity } = require("./profanityFilter");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Prosta walidacja, żeby ktoś nie zapisał śmieci do bazy
function validateScorePayload(body) {
  if (!body || typeof body !== "object") return "Brak danych.";
  const { name, score } = body;

  if (typeof name !== "string" || name.trim().length === 0) {
    return "Nazwa gracza jest wymagana.";
  }
  if (name.trim().length > 20) {
    return "Nazwa gracza może mieć maksymalnie 20 znaków.";
  }
  if (containsProfanity(name)) {
    return "Ta nazwa zawiera niedozwolone słowa. Wybierz inną nazwę.";
  }
  if (typeof score !== "number" || !Number.isFinite(score)) {
    return "Wynik musi być liczbą.";
  }
  // Zgodnie z silnikiem gry: 6 minigier, każda 50-150 pkt => wynik całkowity 300-900
  if (score < 0 || score > 900) {
    return "Wynik spoza dopuszczalnego zakresu.";
  }
  return null;
}

// --- API ---

// Celowo NIE dotyka bazy danych - to ma być jak najlżejsze zapytanie,
// wywoływane co kilka minut przez zewnętrzny "pinger" (np. cron-job.org),
// żeby darmowy serwis na Render nie zdążył zasnąć po 15 min bezczynności.
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/api/leaderboard", (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 50, 200);
  const rows = db
    .prepare("SELECT name, score, created_at FROM scores ORDER BY score DESC, created_at ASC LIMIT ?")
    .all(limit);
  res.json(rows);
});

app.post("/api/scores", (req, res) => {
  const error = validateScorePayload(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  const name = req.body.name.trim();
  const score = Math.round(req.body.score);

  const stmt = db.prepare("INSERT INTO scores (name, score) VALUES (?, ?)");
  const info = stmt.run(name, score);

  res.status(201).json({ id: info.lastInsertRowid, name, score });
});

// --- (opcjonalnie) serwowanie plików frontendu przez ten sam serwer ---
// Jeśli wrzucisz folder frontend/ obok backend/ w tym samym repo,
// odkomentuj poniższe dwie linijki, żeby jeden serwer obsługiwał całość:
//
// app.use(express.static(path.join(__dirname, "..", "..", "frontend")));

app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});
