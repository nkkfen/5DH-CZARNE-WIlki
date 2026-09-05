/**
 * KONFIGURACJA POŁĄCZENIA Z BACKENDEM
 *
 * Jedno miejsce, w którym ustawiasz adres backendu - zarówno strona główna
 * (script.js), jak i silnik gry (game-engine.js) korzystają z tej samej
 * stałej, więc przy zmianie hostingu edytujesz tylko ten jeden plik.
 *
 * - "" (pusty string) -> zakłada, że backend jest dostępny pod tym samym
 *   adresem co strona (np. gdy backend serwuje też pliki frontendu,
 *   patrz zakomentowana linijka w backend/src/server.js).
 * - pełny adres (np. "https://czarne-wilki-backend.onrender.com") -> gdy
 *   backend jest hostowany osobno, niż strona (np. Render/Railway),
 *   a frontend np. na GitHub Pages / Netlify.
 */
const API_BASE_URL = "";
