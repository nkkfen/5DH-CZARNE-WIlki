# Backend - Czarne Wilki (wyniki minigier)

Prosty backend: Node.js + Express + SQLite (jeden plik `data/leaderboard.db`,
tworzony automatycznie przy pierwszym uruchomieniu - nic nie trzeba instalować
osobno).

## Uruchomienie lokalne

```bash
cd backend
npm install
npm start
```

Serwer wystartuje na `http://localhost:3000`.

## Endpointy

### `GET /api/leaderboard`
Zwraca listę wyników posortowaną malejąco po `score`.

Opcjonalny parametr `?limit=50` (domyślnie 50, max 200).

Przykład odpowiedzi:
```json
[
  { "name": "TestGracz", "score": 720, "created_at": "2026-09-03 13:35:19" }
]
```

### `POST /api/scores`
Zapisuje nowy wynik.

Body (JSON):
```json
{ "name": "TestGracz", "score": 720 }
```

- `name`: tekst, 1-20 znaków
- `score`: liczba, 0-900 (zgodnie z zasadami silnika: 6 minigier x 50-150 pkt)

Odpowiedź `201`:
```json
{ "id": 3, "name": "TestGracz", "score": 720 }
```

Błędna walidacja zwraca `400` z polem `error`.

## Struktura bazy danych

Tabela `scores`:

| kolumna    | typ     | opis                          |
|------------|---------|-------------------------------|
| id         | INTEGER | klucz główny, autoincrement   |
| name       | TEXT    | nazwa gracza                  |
| score      | INTEGER | wynik                         |
| created_at | TEXT    | data zapisu (ustawiana sama)  |

Plik bazy: `backend/data/leaderboard.db` (nie jest wersjonowany w git -
patrz `.gitignore` - żeby uniknąć konfliktów i żeby każde środowisko
(lokalne, produkcyjne) miało własne dane).

## Backend zasypia - jak temu zapobiec (za darmo)

Darmowy plan na Render usypia serwis po ~15 minutach bez ruchu. Pierwsze
zapytanie po przebudzeniu trafia na tzw. "cold start" i potrafi trwać
kilkanaście-kilkadziesiąt sekund - dla gracza czekającego na zapisanie
wyniku to wygląda jak zawieszona strona.

Rozwiązanie: zewnętrzny, darmowy serwis, który "puka" do backendu co kilka
minut - krócej niż 15 minut - żeby ten nigdy nie zdążył zasnąć.

**Konfiguracja (na przykładzie [cron-job.org](https://cron-job.org), darmowy, bez karty):**

1. Załóż darmowe konto na cron-job.org.
2. Kliknij "Create cronjob".
3. W polu adresu wpisz: `https://TWOJ-BACKEND.onrender.com/health`
   (podmień na swój prawdziwy adres z Render).
4. Ustaw interwał wykonania na **co 10 minut** (musi być krócej niż limit
   15 minut, żeby backend nie zdążył usnąć między jednym "pyknięciem" a
   kolejnym).
5. Zapisz - od teraz serwis sam będzie się "budził" zanim zdąży zasnąć.

Endpoint `/health` celowo nie odpytuje bazy danych - to najlżejsze możliwe
zapytanie, więc odpowiada natychmiast i nie generuje niepotrzebnego
obciążenia.

**Czy to się mieści w darmowym limicie Render?** Tak. Darmowy plan Render
("Hobby") daje 750 godzin działania instancji na workspace miesięcznie, a
miesiąc ma ok. 720-744 godzin - czyli utrzymanie jednego serwisu włączonego
przez cały miesiąc mieści się w limicie.

**Ograniczenie tego triku:** to obejście domyślnego zachowania darmowego
planu, a nie oficjalnie gwarantowana funkcja - jeśli Render kiedyś zmieni
zasady (np. zacznie liczyć piny jako "brak realnej aktywności" i mimo to
usypiać serwis), przestanie działać. Jeśli zależy Ci na 100% gwarancji
braku przestojów, jedyna pewna opcja to płatny plan Starter ($7/miesiąc),
który ma "no sleep on inactivity" wpisane wprost w funkcje planu.

## Podłączenie do hostingu z bazą "od zera"

Jeśli backend wdrożysz na Render/Railway/Fly.io, przy pierwszym starcie
serwera plik `data/leaderboard.db` utworzy się sam - nic dodatkowego nie
trzeba robić. Jedyna rzecz, na którą trzeba uważać: część darmowych hostingów
kasuje pliki przy każdym redeployu (tzw. "ephemeral filesystem") - jeśli tak
jest u Ciebie, trzeba będzie zamontować "persistent disk" (Render i Railway
mają to w ustawieniach za darmo/tanio) albo docelowo przejść na hostowaną
bazę Postgres. Na start, do testów i małego ruchu, zwykły plik SQLite
w pełni wystarczy.
