# IQuest — frontend

Telegram Mini App: mantiqiy fikrlashni o'lchash va rivojlantirish (IQ test, jumboq to'plamlari, cheksiz mashq, reyting, Pro obuna).
React + Vite. Dizayn va ranglar — IQuest `DESIGN.md` (mavzu "Siyoh", indigo aksent).

## Buyruqlar
```sh
npm install
npm run dev      # dev server
npm run build    # production build (dist/)
npm run lint
```

## Sozlamalar
- `VITE_API_URL` — IQuest backend manzili (`cp .env.example .env.local`). Kontrakt: IQuest `docs/API.md`.
  Telegram ichida ochilganda `POST /auth/telegram` orqali token olinadi; brauzerda referal kodi `?ref=CODE` bilan beriladi.
  Token bo'lsa ekranlar real ma'lumotdan foydalanadi: `/me`, `/results`, `/stats/me`, `/leaderboard`, `/notifications`,
  `/me/saved`, `/referrals/me`, `/payments/*` (karta cheki + Telegram Stars).
- `VITE_API_URL` berilmasa yoki so'rov xato bersa — ilova offline (demo) rejimda mock ma'lumotlar bilan ishlaydi.
- `src/App.jsx` → `APP_CONFIG`: support, yangiliklar kanali va bot username'lari.

## Android (Play Market)
Capacitor bilan: `android/`. Build — GitHub Actions (`.github/workflows/android.yml`), qo'llanma — [docs/ANDROID.md](docs/ANDROID.md).
Store materiallari: `store/`.
