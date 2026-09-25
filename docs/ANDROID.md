# IQuest — Android ilova va Play Market

Ilova Capacitor orqali quriladi: `src/` dagi React ilova `android/` loyihasiga o'raladi.
Paket nomi: **uz.iquest.app** (Play'ga birinchi yuklangandan keyin o'zgartirib bo'lmaydi).

## Android'da nima boshqacha
| | Telegram Mini App | Android ilova |
|---|---|---|
| Kirish | Telegram `initData` avtomatik | "Telegram orqali kirish" → @iquest_bot → Start → ilovaga qaytish. Yoki mehmon rejimi |
| To'lov | Karta cheki, Telegram Stars | **Yo'q** — Google Play qoidasi (raqamli kontent faqat Play Billing orqali). Telegram'da olingan Pro Android'da ham ishlaydi |
| Token | sessionStorage | localStorage (ilova yopilsa ham saqlanadi) |
| Orqaga | Telegram BackButton | Android tizim tugmasi |

## 1. Build (GitHub Actions)
`.github/workflows/android.yml` har push'da ishlaydi (yoki Actions → Android build → Run workflow).

1. **API manzili**: repo → Settings → Secrets and variables → Actions → **Variables** →
   `VITE_API_URL` = `https://<api-manzil>` (https majburiy). Berilmasa ilova faqat mehmon/offline rejimda ishlaydi.
2. Natija: **Actions → oxirgi run → Artifacts**:
   - `iquest-debug-apk` — telefonga o'rnatib sinash uchun (har doim).
   - `iquest-release-<versiya>` — Play Console uchun **.aab** (+ imzolangan .apk). Faqat upload kaliti sozlangan bo'lsa.

## 2. Upload kaliti (bir marta)
O'z kompyuteringizda (JDK o'rnatilgan bo'lsa):
```sh
keytool -genkeypair -v -keystore iquest-upload.jks -alias iquest -keyalg RSA -keysize 2048 -validity 10000
base64 -w0 iquest-upload.jks > iquest-upload.b64      # macOS: base64 -i iquest-upload.jks
```
Repo → Settings → Secrets and variables → Actions → **Secrets**:
| Secret | Qiymat |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | `iquest-upload.b64` fayl mazmuni |
| `ANDROID_KEYSTORE_PASSWORD` | keystore paroli |
| `ANDROID_KEY_ALIAS` | `iquest` |
| `ANDROID_KEY_PASSWORD` | kalit paroli |

`.jks` faylni va parollarni xavfsiz joyda saqlang, repoga qo'shmang. Play App Signing yoqilgani uchun
upload kaliti yo'qolsa, Play Console orqali yangisini ro'yxatdan o'tkazish mumkin.

## 3. Play Console
1. [play.google.com/console](https://play.google.com/console) — dasturchi hisobi (bir martalik $25).
2. **Create app** → nomi "IQuest", til: o'zbek, turi: App, bepul.
3. **Store listing** (`store/` papkasi):
   - Ikonka: `store/icon-512.png`
   - Feature graphic: `store/feature-graphic-1024x500.png`
   - Telefon skrinshotlari: `store/screenshots/*.png` (1080×1920)
   - Qisqa tavsif (≤80): "IQ test, mantiqiy jumboqlar va reyting — aqlingizni har kuni charxlang."
4. **App content** (majburiy):
   - Privacy policy URL (masalan `https://iquest.uz/maxfiylik` — sahifa ochiq bo'lishi shart).
   - Data safety: Telegram id, ism, username (hisob uchun); test natijalari (ilova funksiyasi). Sotilmaydi, shifrlangan uzatish (https).
   - App access: kirish ixtiyoriy — "Hozircha mehmon sifatida" orqali barcha asosiy ekranlar ochiladi.
   - Ads: yo'q. Content rating anketasi. Target audience: 13+ tavsiya (DESIGN.md: 13–17 uchun alohida me'yorlar).
5. **Testing → Internal testing** → yangi release → `.aab` ni yuklash → testerlar → sinab ko'rish.
6. Hammasi yaxshi bo'lsa → **Production** ga ko'tarish → Review (odatda 1–7 kun).

## Versiyalar
- `versionName` — `package.json` dagi `version` (masalan 1.0.1 ga oshiring).
- `versionCode` — avtomatik: 100 + GitHub run raqami (har build'da oshadi, Play talabi).

## Lokal build (Android Studio bilan)
```sh
VITE_API_URL=https://<api> npm run android:sync
npm run android:open        # Android Studio → Build → Generate Signed Bundle
```
