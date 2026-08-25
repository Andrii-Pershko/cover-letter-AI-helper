# AI-CL

Чесний match CV з вакансією і cover letter українською. Вакансію вставляєш текстом — сторінки не парсимо.

## Що потрібно перед аналізом

1. Профіль: ім'я, роки досвіду, стек, CV, контакти
2. Мінімум 2 проєкти-кейси для CL
3. Мінімум 2 **ідеальні cover letter**, написані тобою — еталон тону, не шаблон для копіювання

## Запуск у Docker

У `.env` постав прапорець `APP_ENV`:

- `dev` — live-сервер: зміни в коді підхоплюються самі, кеш `.next` лежить у корені проєкту.
- `production` — готовий образ з GHCR (`docker compose pull`), без `--build` на сервері.

```bash
cp .env.example .env
# встав GOOGLE_GENERATIVE_AI_API_KEY з https://aistudio.google.com/apikey
```

Dev (за замовчуванням у `.env.example`):

```bash
# APP_ENV=dev
docker compose up
```

Prod на VPS (образ уже зібраний у GitHub Actions, на сервері **без** `--build`):

```bash
# APP_ENV=production
docker compose pull
docker compose up -d
```

Локально зібрати production-образ (якщо треба перевірити Dockerfile):

```bash
docker build --target production -t ghcr.io/andrii-pershko/cover-letter-ai-helper:latest .
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

## Команди БД

Користувач і назва бази — з `POSTGRES_USER` / `POSTGRES_DB` у compose (не хардкодити бойові значення).

```bash
docker compose exec db pg_dump -U <postgres_user> <database> > backup.sql
# на новому сервері
docker compose up db -d
docker compose exec -T db psql -U <postgres_user> <database> < backup.sql
```
