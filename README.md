# AI-CL

Чесний match CV з вакансією і cover letter українською. Вакансію вставляєш текстом — сторінки не парсимо.

## Що потрібно перед аналізом

1. Профіль: ім'я, роки досвіду, стек, CV, контакти
2. Мінімум 2 проєкти-кейси для CL
3. Мінімум 2 **ідеальні cover letter**, написані тобою — еталон тону, не шаблон для копіювання

## Запуск у Docker

У `.env` постав прапорець `APP_ENV`:

- `dev` — live-сервер: зміни в коді підхоплюються самі, кеш `.next` лежить у корені проєкту.
- `production` — зібраний Next (`npm start`), без mount коду.

```bash
cp .env.example .env
# встав GOOGLE_GENERATIVE_AI_API_KEY з https://aistudio.google.com/apikey
```

Dev (за замовчуванням у `.env.example`):

```bash
# APP_ENV=dev
docker compose up
```

Prod:

```bash
# APP_ENV=production
docker compose up --build
```

Відкрий [http://localhost:3401](http://localhost:3401), зареєструйся і заповни профіль.

Перший зареєстрований користувач підхопить уже наявні дані профілю (якщо вони були до auth). Наступні — порожній профіль.

## Локальна розробка без контейнера app

```bash
cp .env.example .env
docker compose up db -d
npx prisma migrate deploy
npm run dev
```

`DATABASE_URL` у `.env` для цього режиму — `localhost:3402` (хостовий порт Postgres). У контейнері app compose підміняє його на хост `db:5432`.

## BD comands
```
docker compose exec db pg_dump -U aicl aicl > backup.sql
# на новому сервері
docker compose up db -d
docker compose exec -T db psql -U aicl aicl < backup.sql
```