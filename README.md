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
- `VITE_API_URL` — backend manzili (`/auth/telegram`). Berilmasa ilova offline rejimda ishlaydi.
- `src/App.jsx` → `APP_CONFIG`: support, yangiliklar kanali va bot username'lari.
