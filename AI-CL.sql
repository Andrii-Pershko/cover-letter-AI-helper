--
-- PostgreSQL database dump
--

\restrict cIrIu1HTGjhm6TGBQ3jIKv1QMtctXwv6ytc70PPmmN95KKfJY688bt845RlTHqx

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Analysis; Type: TABLE; Schema: public; Owner: aicl
--

CREATE TABLE public."Analysis" (
    id text NOT NULL,
    "profileId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "companyName" text,
    "jobTitle" text,
    "jobLevel" text,
    "jobText" text NOT NULL,
    "matchMin" integer NOT NULL,
    "matchMax" integer NOT NULL,
    recommendation text NOT NULL,
    gaps text[],
    "coverLetter" text,
    "usedProjectTitle" text
);


ALTER TABLE public."Analysis" OWNER TO aicl;

--
-- Name: AnalysisRequirement; Type: TABLE; Schema: public; Owner: aicl
--

CREATE TABLE public."AnalysisRequirement" (
    id text NOT NULL,
    "analysisId" text NOT NULL,
    requirement text NOT NULL,
    candidate text NOT NULL,
    match text NOT NULL,
    explanation text,
    "techExplainer" text,
    "isMustHave" boolean DEFAULT true NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."AnalysisRequirement" OWNER TO aicl;

--
-- Name: ExampleCoverLetter; Type: TABLE; Schema: public; Owner: aicl
--

CREATE TABLE public."ExampleCoverLetter" (
    id text NOT NULL,
    "profileId" text NOT NULL,
    title text NOT NULL,
    company text DEFAULT ''::text NOT NULL,
    role text DEFAULT ''::text NOT NULL,
    "whyItWorks" text DEFAULT ''::text NOT NULL,
    body text NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ExampleCoverLetter" OWNER TO aicl;

--
-- Name: Profile; Type: TABLE; Schema: public; Owner: aicl
--

CREATE TABLE public."Profile" (
    id text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "fullName" text DEFAULT ''::text NOT NULL,
    headline text DEFAULT ''::text NOT NULL,
    "yearsExperience" double precision,
    "englishLevel" text DEFAULT ''::text NOT NULL,
    location text DEFAULT ''::text NOT NULL,
    "workFormat" text DEFAULT ''::text NOT NULL,
    "targetLevel" text DEFAULT ''::text NOT NULL,
    "clLanguage" text DEFAULT 'uk'::text NOT NULL,
    linkedin text DEFAULT ''::text NOT NULL,
    email text DEFAULT ''::text NOT NULL,
    telegram text DEFAULT ''::text NOT NULL,
    "cvFileName" text,
    "cvMimeType" text,
    "cvText" text,
    "coreStack" text DEFAULT ''::text NOT NULL,
    "avoidInCl" text,
    "extraNotes" text,
    "clMatchThreshold" integer DEFAULT 80 NOT NULL,
    "clCharLimit" integer DEFAULT 1500 NOT NULL,
    "userId" text
);


ALTER TABLE public."Profile" OWNER TO aicl;

--
-- Name: Project; Type: TABLE; Schema: public; Owner: aicl
--

CREATE TABLE public."Project" (
    id text NOT NULL,
    "profileId" text NOT NULL,
    title text NOT NULL,
    product text DEFAULT ''::text NOT NULL,
    problem text NOT NULL,
    contribution text NOT NULL,
    stack text[] DEFAULT ARRAY[]::text[],
    result text DEFAULT ''::text NOT NULL,
    tags text[] DEFAULT ARRAY[]::text[],
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Project" OWNER TO aicl;

--
-- Name: User; Type: TABLE; Schema: public; Owner: aicl
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    "passwordHash" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO aicl;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: aicl
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO aicl;

--
-- Data for Name: Analysis; Type: TABLE DATA; Schema: public; Owner: aicl
--

COPY public."Analysis" (id, "profileId", "createdAt", "companyName", "jobTitle", "jobLevel", "jobText", "matchMin", "matchMax", recommendation, gaps, "coverLetter", "usedProjectTitle") FROM stdin;
cmt3dbj3500044op14mnfw1w7	cmt3gwtm900004olcuaqzfbs0	2026-08-21 19:54:29.345	Plexteq	Full-Stack Developer	Middle	Full-Stack Developer\r\n\r\nVinnytsya, Vinnytsya, Ukraine · 2 weeks ago · 37 people clicked apply\r\n\r\nResponses managed off LinkedIn\r\n\r\nFull-time\r\nTake the next step in your job search\r\nPractice an interview\r\n\r\nApplication status\r\nApplied on company site\r\n\r\n9 hours ago\r\n\r\nGo to company site \r\n\r\nAbout the job\r\nProject\r\n\r\nWe develop software that helps coordinate, use and sell alternative energy. The software requires huge improvements and modernization which we are successfully doing at the moment.\r\n\r\nThis is cross-platform software with web and mobile clients.\r\n\r\nWe invite you to become a part of our great team and hope that you’ll enjoy working on this project just like we do!\r\n\r\nYou’ll get a great experience of working in a strong team, and making excellent software that is so crucial for the business of our customers.\r\n\r\nRequirements\r\n\r\nMandatory\r\n\r\n— 3+ years of commercial experience with NodeJS, MongoDB, and libraries like Mongoose.\r\n\r\n— Proven experience with web sockets and signaling fundamentals\r\n\r\n— Experience with web applications fundamentals like HTML, JavaScript, CSS, REST, JSON\r\n\r\n— Experience with REACT (+Redux) and JQuery\r\n\r\n— Strong ability to understand existing code and fix bugs and write enhancements (without rewriting code)\r\n\r\n— Сross-browser development and compatibility experience\r\n\r\n— Good debugging skills\r\n\r\n— Intermediate English (able to pass interview in English)\r\n\r\nNice to have\r\n\r\n— Familiarity with real-time communication technologies including WebRTC, RTP, SIP, and audio/video codecs\r\n\r\nWe Offer\r\n\r\n— flexible work schedule\r\n\r\n— regular performance reviews\r\n\r\n— paid 24 days of vacations and sick leaves\r\n\r\n— paid participation in conferences and international hackathons\r\n\r\n— free English classes (including lessons with native speakers)\r\n\r\n— leisure activities and team buildings\r\n\r\n— democratic management and a great atmosphere\r\n\r\n— possibility to work on several projects, learn new software development methodologies, frameworks and techniques\r\n\r\n— sport compensation\r\n\r\n— Covid-19 test compensation\r\n\r\nAbout Us\r\n\r\nPlexteq is an end-to-end software solutions provider that operates since 2014 and specializes in fault-tolerant cloud and on-premise SaaS software running under high load.\r\n\r\nDevelopment is handled by highly-skilled and educated in-house engineering teams\r\n\r\nthat apply industry adopted CMM v3 process models that ensure high level of customer satisfaction throughout the software engineering and support lifecycles\r\n\r\nAddress\r\n\r\nVinnytsia, Vinnytsia Oblast, Ukraine, 21000\r\n\r\nBack To All Jobs	45	65	try	{"Немає підтвердженого досвіду з WebSockets та signaling fundamentals, що є ключовою мандаторною вимогою.","Немає підтвердженого досвіду з MongoDB та Mongoose, хоча MongoDB вказана в навичках.","Відсутній досвід з jQuery.","Відсутня знайомість з WebRTC, RTP, SIP та аудіо/відео кодеками (nice-to-have, але доповнює вимогу до реального часу)."}	\N	\N
cmt3de6d1000e4op1q3c9outh	cmt3gwtm900004olcuaqzfbs0	2026-08-21 19:56:32.821	Plexteq	Full-Stack Developer	Middle	Full-Stack Developer\r\n\r\nVinnytsya, Vinnytsya, Ukraine · 2 weeks ago · 37 people clicked apply\r\n\r\nResponses managed off LinkedIn\r\n\r\nFull-time\r\nTake the next step in your job search\r\nPractice an interview\r\n\r\nApplication status\r\nApplied on company site\r\n\r\n9 hours ago\r\n\r\nGo to company site \r\n\r\nAbout the job\r\nProject\r\n\r\nWe develop software that helps coordinate, use and sell alternative energy. The software requires huge improvements and modernization which we are successfully doing at the moment.\r\n\r\nThis is cross-platform software with web and mobile clients.\r\n\r\nWe invite you to become a part of our great team and hope that you’ll enjoy working on this project just like we do!\r\n\r\nYou’ll get a great experience of working in a strong team, and making excellent software that is so crucial for the business of our customers.\r\n\r\nRequirements\r\n\r\nMandatory\r\n\r\n— 3+ years of commercial experience with NodeJS, MongoDB, and libraries like Mongoose.\r\n\r\n— Proven experience with web sockets and signaling fundamentals\r\n\r\n— Experience with web applications fundamentals like HTML, JavaScript, CSS, REST, JSON\r\n\r\n— Experience with REACT (+Redux) and JQuery\r\n\r\n— Strong ability to understand existing code and fix bugs and write enhancements (without rewriting code)\r\n\r\n— Сross-browser development and compatibility experience\r\n\r\n— Good debugging skills\r\n\r\n— Intermediate English (able to pass interview in English)\r\n\r\nNice to have\r\n\r\n— Familiarity with real-time communication technologies including WebRTC, RTP, SIP, and audio/video codecs\r\n\r\nWe Offer\r\n\r\n— flexible work schedule\r\n\r\n— regular performance reviews\r\n\r\n— paid 24 days of vacations and sick leaves\r\n\r\n— paid participation in conferences and international hackathons\r\n\r\n— free English classes (including lessons with native speakers)\r\n\r\n— leisure activities and team buildings\r\n\r\n— democratic management and a great atmosphere\r\n\r\n— possibility to work on several projects, learn new software development methodologies, frameworks and techniques\r\n\r\n— sport compensation\r\n\r\n— Covid-19 test compensation\r\n\r\nAbout Us\r\n\r\nPlexteq is an end-to-end software solutions provider that operates since 2014 and specializes in fault-tolerant cloud and on-premise SaaS software running under high load.\r\n\r\nDevelopment is handled by highly-skilled and educated in-house engineering teams\r\n\r\nthat apply industry adopted CMM v3 process models that ensure high level of customer satisfaction throughout the software engineering and support lifecycles\r\n\r\nAddress\r\n\r\nVinnytsia, Vinnytsia Oblast, Ukraine, 21000\r\n\r\nBack To All Jobs	45	65	try	{"Досвід роботи з MongoDB та бібліотекою Mongoose","Досвід роботи з WebSockets та основними принципами сигналізації","Досвід роботи з JQuery","Знайомство з WebRTC, RTP, SIP та аудіо/відео кодеками"}	\N	\N
cmt3i845100004olcpr8g5goz	cmt3gwtm900004olcuaqzfbs0	2026-08-21 22:11:48.086	Kapa	Software Engineer	Middle	About the job\r\nKapa makes technical knowledge instantly accessible through AI assistants. As a software engineer you will work across the stack on the Kapa systems that answer thousands of developer questions per day. Check out Docker’s documentation (https://docs.docker.com) for a live example of what Kapa is (look for the “Ask AI” button).\r\n\r\nIn This Role, You Will\r\n\r\nWork directly with the founding team and our research engineers.\r\nScale the infrastructure that powers the Kapa RAG engine (Python).\r\nExperiment with new features in the Kapa analytics platform (React + Python).\r\nWork on the client integrations which are used to deploy Kapa for our customers (React + Python).\r\nGive Kapa access to new kinds of data (Python).\r\nMaintain our React SDK.\r\n\r\nYou May Be a Good Fit If You Have\r\n\r\nA degree in computer science, machine learning, mathematics, statistics or a related field.\r\n3+ years of software engineering experience working on complex systems in both backend and frontend.\r\nAn affinity for machine learning, deep learning (including LLMs) and natural language processing.\r\nThe ability to work effectively in a fast in a environment where things are sometimes loosely defined.\r\n This is neither an exhaustive nor necessary set of attributes. Even if none of these apply to you, but you believe you will contribute to kapa.ai, please reach out.	30	50	try	{"Відсутність досвіду роботи з Python, який є ключовим для бекенду та ML-компонентів вакансії.","Відсутність академічної освіти у галузях комп'ютерних наук, ML, математики чи статистики.","Недостатньо глибоке підтвердження «спорідненості» до ML/LLM/NLP за межами використання AI-інструментів для кодування."}	\N	\N
cmt3i92ct000a4olcpnjdq77o	cmt3gwtm900004olcuaqzfbs0	2026-08-21 22:12:32.43	Kapa	Software Engineer	\N	About the job\r\nKapa makes technical knowledge instantly accessible through AI assistants. As a software engineer you will work across the stack on the Kapa systems that answer thousands of developer questions per day. Check out Docker’s documentation (https://docs.docker.com) for a live example of what Kapa is (look for the “Ask AI” button).\r\n\r\nIn This Role, You Will\r\n\r\nWork directly with the founding team and our research engineers.\r\nScale the infrastructure that powers the Kapa RAG engine (Python).\r\nExperiment with new features in the Kapa analytics platform (React + Python).\r\nWork on the client integrations which are used to deploy Kapa for our customers (React + Python).\r\nGive Kapa access to new kinds of data (Python).\r\nMaintain our React SDK.\r\n\r\nYou May Be a Good Fit If You Have\r\n\r\nA degree in computer science, machine learning, mathematics, statistics or a related field.\r\n3+ years of software engineering experience working on complex systems in both backend and frontend.\r\nAn affinity for machine learning, deep learning (including LLMs) and natural language processing.\r\nThe ability to work effectively in a fast in a environment where things are sometimes loosely defined.\r\n This is neither an exhaustive nor necessary set of attributes. Even if none of these apply to you, but you believe you will contribute to kapa.ai, please reach out.	25	45	weak	{"Відсутній досвід роботи з Python, який є основною бекенд-мовою для цієї вакансії.","Відсутність профільної технічної освіти (комп'ютерні науки, ML, математика)."}	\N	\N
cmt4np758000i4olcgdndx5e7	cmt3gwtm900004olcuaqzfbs0	2026-08-22 17:32:49.388	UAM	Full-Stack Developer	Middle	Full-Stack Developer (Node.js / NestJS, Angular)\r\nUAM\r\n Підписатись\r\nЗберегти\r\n Сховати\r\n\r\nСкопіювати посилання\r\n$$\r\nПродуктова компанія\r\nWe are looking for a Mid-level Full-Stack Developer (3+ years of experience) to work on a modern web project using an up-to-date technology stack.\r\n\r\n\r\n🧩 Responsibilities:\r\n\r\nDevelop and maintain the backend using NestJS (Node.js)\r\nWork with MySQL databases via TypeORM\r\nDevelop the frontend using Angular 21\r\nIntegrate third-party services and APIs\r\nWrite clean, maintainable, and scalable code\r\nParticipate in code reviews and team-based development\r\nWork with Git (version control)\r\n\r\n\r\n🛠 Requirements:\r\n\r\n3+ years of commercial experience in Full-Stack development\r\nStrong knowledge of TypeScript\r\nExperience with NestJS / Node.js\r\nExperience with TypeORM\r\nHands-on experience with MySQL\r\nExperience developing with Angular (version 21 or a close equivalent)\r\nConfident use of Git\r\n\r\n \r\n\r\n⭐ Nice to have:\r\n\r\nExperience working with the OpenAI API\r\nExperience using Docker\r\nWriting and maintaining automated tests with Playwright\r\n\r\n🎯 We offer:\r\n\r\nWork on an interesting and technology-driven project\r\nA friendly team and comfortable communication\r\nFully remote work format\r\nCompetitive salary (depending on experience)\r\nВимоги до володіння мовами\r\nАнглійська\r\nB1 – Середній\r\nПро компанію UAM\r\nUAM – це незалежний автосалон із великим вибором автомобілів, що пропонує своїм клієнтам комфортний і професійний сервіс. Автосалон має закритий шоу-рум, де представлені відібрані моделі, а також велику відкриту експозицію, що налічує близько 300 автомобілів. UAM спеціалізується на продажу якісних автомобілів із різних сегментів – від бюджетних до преміальних моделей. Клієнтам доступні різні форми придбання: покупка за готівку, кредит або лізинг. Команда UAM забезпечує високий рівень обслуговування, допомагаючи клієнтам обрати авто відповідно до їхніх потреб і побажань.	40	55	weak	{"Відсутність досвіду роботи з Angular.","Відсутність досвіду роботи з TypeORM.","Відсутність досвіду написання автоматизованих тестів з Playwright."}	\N	\N
cmt4ns1iv000u4olcrztw5c7z	cmt3gwtm900004olcuaqzfbs0	2026-08-22 17:35:02.071	UAM	Full-Stack Developer (Node.js / NestJS, Angular)	Mid-level	Full-Stack Developer (Node.js / NestJS, Angular)\r\nUAM\r\n Підписатись\r\nЗберегти\r\n Сховати\r\n\r\nСкопіювати посилання\r\n$$\r\nПродуктова компанія\r\nWe are looking for a Mid-level Full-Stack Developer (3+ years of experience) to work on a modern web project using an up-to-date technology stack.\r\n\r\n\r\n🧩 Responsibilities:\r\n\r\nDevelop and maintain the backend using NestJS (Node.js)\r\nWork with MySQL databases via TypeORM\r\nDevelop the frontend using Angular 21\r\nIntegrate third-party services and APIs\r\nWrite clean, maintainable, and scalable code\r\nParticipate in code reviews and team-based development\r\nWork with Git (version control)\r\n\r\n\r\n🛠 Requirements:\r\n\r\n3+ years of commercial experience in Full-Stack development\r\nStrong knowledge of TypeScript\r\nExperience with NestJS / Node.js\r\nExperience with TypeORM\r\nHands-on experience with MySQL\r\nExperience developing with Angular (version 21 or a close equivalent)\r\nConfident use of Git\r\n\r\n \r\n\r\n⭐ Nice to have:\r\n\r\nExperience working with the OpenAI API\r\nExperience using Docker\r\nWriting and maintaining automated tests with Playwright\r\n\r\n🎯 We offer:\r\n\r\nWork on an interesting and technology-driven project\r\nA friendly team and comfortable communication\r\nFully remote work format\r\nCompetitive salary (depending on experience)\r\nВимоги до володіння мовами\r\nАнглійська\r\nB1 – Середній\r\nПро компанію UAM\r\nUAM – це незалежний автосалон із великим вибором автомобілів, що пропонує своїм клієнтам комфортний і професійний сервіс. Автосалон має закритий шоу-рум, де представлені відібрані моделі, а також велику відкриту експозицію, що налічує близько 300 автомобілів. UAM спеціалізується на продажу якісних автомобілів із різних сегментів – від бюджетних до преміальних моделей. Клієнтам доступні різні форми придбання: покупка за готівку, кредит або лізинг. Команда UAM забезпечує високий рівень обслуговування, допомагаючи клієнтам обрати авто відповідно до їхніх потреб і побажань.	45	65	try	{"Відсутній досвід розробки з Angular.","Відсутній досвід інтеграції з OpenAI API.","Відсутній досвід написання тестів за допомогою Playwright."}	Вітаю, командо UAM!\n\nМене зацікавила ця вакансія в UAM можливістю працювати над сучасним веб-проєктом з актуальним стеком технологій, зокрема NestJS та Angular. Для мене важлива робота у продуктовій компанії, де можна бачити реальний вплив своїх рішень та постійно розвиватись. Опис вакансії, що включає роботу з MySQL та TypeORM, а також участь у повсякденному циклі розробки від ідеї до production, відповідає моїм професійним інтересам. Також приваблює гнучкість формату віддаленої роботи.\n\nЯ middle Full-Stack розробник із 3 роками комерційного досвіду. В моїй роботі я активно використовую Node.js, NestJS, TypeScript, MySQL та працюю з різними фреймворками для інтерфейсів. Мій підхід дозволяє мені успішно розробляти як складні бекенд-системи, так і адаптивні та функціональні інтерфейси. Одним з моїх релевантних проєктів був внутрішній медіа портал для централізованого керування рекламними матеріалами в мережі з 28 магазинів. Основне завдання полягало в оновленні UI/UX, відокремленні функціоналу та додаванні можливості масових змін за фільтрами, а також автоматизації стартів і дедлайнів рекламних кампаній. Я відповідав за оновлення інтерфейсу користувача, розширення функціоналу бекенду на Node.js та деплоймент рішення на продакшен. Завдяки цій роботі ми досягли значного прискорення процесу налаштування реклами — з 30 хвилин до менш ніж 2 хвилин, а також впровадили планування термінів показу реклами, що раніше було ручним процесом.\n\nБуду радий поспілкуватися, детальніше розповісти про свій досвід та виконати тестове завдання.\n\nLinkedIn: www.linkedin.com/in/andriiinf\nEmail: andriiinf@gmail.com\nTelegram: @andriiinf	Медіа портал для керування ads на магазинах
cmt74lcej00004onrokyghlsw	cmt3gwtm900004olcuaqzfbs0	2026-08-24 11:01:15.404	Dnipro-M	JavaScript Developer	Middle	Middle/Senior JavaScript Developer\r\nDnipro-M\r\nКиїв, Ukraine\r\nВіддалено\r\nMiddle\r\n11 год тому\r\nНавички та технології\r\nJavaScript\r\n\r\nBootstrap\r\n\r\nSASS\r\n\r\nNode.js\r\n\r\nTypeScript\r\n\r\nCypress\r\n\r\nGraphQL\r\n\r\nExpress.js\r\n\r\nJest\r\n\r\nLESS\r\n\r\nReact.js\r\n\r\nAdobe\r\n\r\nGit\r\n\r\nWebpack\r\n\r\nTailwind CSS\r\n\r\nSCSS\r\n\r\nFigma\r\n\r\nnextJS\r\n\r\nVite\r\n\r\nHTML\r\n\r\nREST API\r\n\r\nGitFlow\r\n\r\nMocha\r\n\r\nОпис вакансії\r\nПривіт, наш майбутній колего 👋\r\n\r\nМи віримо, що сильні результати створюють люди, які добре знають свою справу і ставляться до неї відповідально. У Dnipro-M ми будуємо команду майстрів своєї справи — людей, які хочуть не просто працювати, а впливати й бачити результат.\r\n\r\nЩо ми очікуємо?\r\n\r\nJavaScript та TypeScript: впевнене знання JavaScript (ES6+), основних концепцій (замикання, асинхронність, прототипне успадкування), досвід роботи з TypeScript.\r\nСучасні фреймворки: глибокі знання React, розуміння компонентного підходу та створення односторінкових додатків (SPA).\r\nОснови Backend: досвід роботи з Node.js, Express/NestJS; розробка та інтеграція RESTful API, знання GraphQL буде плюсом.\r\nВерстка та UI/UX: знання HTML, CSS (Flexbox, Grid, CSS-анімації), досвід з CSS-препроцесорами (Sass, Less), фреймворками (Bootstrap, Tailwind CSS), робота з Figma або Adobe XD.\r\nІнструменти розробки: досвід з Git, GitFlow, інструментами автоматизації (Webpack, Gulp, Vite), CI/CD для розгортання.\r\nТестування та відладка: досвід написання юніт- та інтеграційних тестів (Jest, Mocha, Cypress), розуміння TDD та BDD.\r\nМи пропонуємо тобі:\r\n\r\nКонкурентну та своєчасну заробітну плату, на яку ти маєш вплив;\r\nНавчання в Академії корпоративної освіти, що прокачає професійні та особисті навички;\r\nДієву систему адаптації, менторство та наставництво;\r\nКорпоративну англійську;\r\nПростір для реалізації власних ідей — ініціативи тут працюють;\r\nКар'єрний ріст всередині компанії — більшість керівників починали зі стартових позицій;\r\nЗнижки від партнерів — пальне, електроніка, спорт, психологічні консультації, аптеки, медичні лабораторії та багато іншого;\r\nМожливість отримати бонуси за працевлаштованих друзів;\r\nКешбек на продукцію Dnipro-M — бо ми самі фанатіємо від нашого інструменту;\r\nМожливість працювати віддалено;\r\nЗручний трансфер — від метро Т. Шевченка прямо до офісу і назад;\r\nБезпеку та комфорт на робочому місці;\r\nОфіційне працевлаштування, відпустки та лікарняні згідно з КЗпП;\r\nМожливість часткової компенсації зовнішніх курсів та навчання;\r\nУнікальну корпоративну культуру: конкурси для співробітників, відзнаки та нагороди, різноманітні зібрання та внутрішні івенти.\r\nГотовий до нових викликів? Долучайся до команди Dnipro-M, де твої амбіції реалізуються на повну!	40	55	try	{"Відсутній досвід з CSS-препроцесорами (Sass, Less)","Відсутній досвід з фреймворком Bootstrap","Немає досвіду роботи з інструментами автоматизації (Webpack, Gulp, Vite)","Відсутній досвід з CI/CD для розгортання","Немає досвіду написання юніт- та інтеграційних тестів (Jest, Mocha, Cypress)","Відсутнє розуміння TDD та BDD","Немає досвіду роботи з GraphQL"}	\N	\N
cmt74t2qu000c4onr2l10hxba	cmt3gwtm900004olcuaqzfbs0	2026-08-24 11:07:16.134	Dnipro-M	Middle/Senior JavaScript Developer	Middle/Senior	Middle/Senior JavaScript Developer\r\nDnipro-M\r\nЗа результатами співбесіди\r\nDnipro-M \r\n\r\nРоздрібна торгівля; більше 1000 співробітників\r\nДистанційна робота\r\nПовна зайнятість. Досвід роботи від 2 років.\r\nCSS\r\nFigma\r\nJavaScript\r\nHTML\r\nGit\r\nBootstrap\r\nGulp\r\nSASS\r\nReact\r\nLESS\r\nAdobe\r\nwebpack\r\nNode.js\r\nTypeScript\r\nUnit-тестування\r\nREST API\r\nECMAScript\r\nCSS Flexbox\r\nВерстка\r\nCSS Grid Layout\r\nUI-дизайн\r\nUX-дизайн\r\nGraphQL\r\nJest\r\nBackend-розробка\r\nTailwind CSS\r\nNestJS\r\nCypress\r\nVite.js\r\nCI/CD\r\nПоказати всі навички \r\nОпис вакансії\r\nПривіт, наш майбутній колего 👋\r\n\r\nМи віримо, що сильні результати створюють люди, які добре знають свою справу і ставляться до неї відповідально. У Dnipro-M ми будуємо команду майстрів своєї справи — людей, які хочуть не просто працювати, а впливати й бачити результат.\r\n\r\nЩо ми очікуємо?\r\n\r\nJavaScript та TypeScript: впевнене знання JavaScript (ES6+), основних концепцій (замикання, асинхронність, прототипне успадкування), досвід роботи з TypeScript.\r\nСучасні фреймворки: глибокі знання React, розуміння компонентного підходу та створення односторінкових додатків (SPA).\r\nОснови Backend: досвід роботи з Node.js, Express/NestJS; розробка та інтеграція RESTful API, знання GraphQL буде плюсом.\r\nВерстка та UI/UX: знання HTML, CSS (Flexbox, Grid, CSS-анімації), досвід з CSS-препроцесорами (Sass, Less), фреймворками (Bootstrap, Tailwind CSS), робота з Figma або Adobe XD.\r\nІнструменти розробки: досвід з Git, GitFlow, інструментами автоматизації (Webpack, Gulp, Vite), CI/CD для розгортання.\r\nТестування та відладка: досвід написання юніт- та інтеграційних тестів (Jest, Mocha, Cypress), розуміння TDD та BDD.\r\nМи пропонуємо тобі:\r\n\r\nКонкурентну та своєчасну заробітну плату, на яку ти маєш вплив;\r\nНавчання в Академії корпоративної освіти, що прокачає професійні та особисті навички;\r\nДієву систему адаптації, менторство та наставництво;\r\nКорпоративну англійську;\r\nПростір для реалізації власних ідей — ініціативи тут працюють;\r\nКар'єрний ріст всередині компанії — більшість керівників починали зі стартових позицій;\r\nЗнижки від партнерів — пальне, електроніка, спорт, психологічні консультації, аптеки, медичні лабораторії та багато іншого;\r\nМожливість отримати бонуси за працевлаштованих друзів;\r\nКешбек на продукцію Dnipro-M — бо ми самі фанатіємо від нашого інструменту;\r\nМожливість працювати віддалено;\r\nЗручний трансфер — від метро Т. Шевченка прямо до офісу і назад;\r\nБезпеку та комфорт на робочому місці;\r\nОфіційне працевлаштування, відпустки та лікарняні згідно з КЗпП;\r\nМожливість часткової компенсації зовнішніх курсів та навчання;\r\nУнікальну корпоративну культуру: конкурси для співробітників, відзнаки та нагороди, різноманітні зібрання та внутрішні івенти.\r\nГотовий до нових викликів? Долучайся до команди Dnipro-M, де твої амбіції реалізуються на повну!	80	90	strong	{"Відсутній досвід з GraphQL.","Не підтверджений досвід з Mocha/Cypress та TDD/BDD."}	Вітаю, командо Dnipro-M!\n\nМене привабила вакансія в Dnipro-M можливістю впливати на розробку продукту у великій компанії, яка цінує якість та результат, як зазначено в описі. Особливо цікаві завдання з оптимізації бізнес-процесів та покращення користувацького досвіду, використовуючи сучасний стек технологій, що відповідає моєму досвіду.\n\nЯ розробник із 3 роками комерційного досвіду, працюю з React, Next.js, TypeScript, Node.js та NestJS, створюючи повноцінні веб-додатки. В одному з ключових проєктів я відповідав за оновлення UI/UX та розширення функціоналу медіа порталу для централізованого керування музикою та рекламою у 28 магазинах. Це включало розробку нового інтерфейсу на Next.js та потужного бекенду на Node.js з express, що дозволило повністю автоматизувати ручні процеси, скоротивши час налаштування роликів з 30 до 2 хвилин, а також додати гнучке планування термінів показу реклами.\n\nБуду радий поспілкуватися, детальніше розповісти про свій досвід та виконати тестове завдання.\n\nLinkedIn: www.linkedin.com/in/andriiinf\nEmail: andriiinf@gmail.com\nTelegram: @andriiinf	Медіа портал для керування ads на магазинах
cmt74tsyz000k4onrdd4q9ei5	cmt3gwtm900004olcuaqzfbs0	2026-08-24 11:07:50.124	4K-Soft	Middle FullStack Web Developer	Middle	Middle FullStack Web Developer\r\n4K-Soft\r\nUkraine\r\nВіддалено\r\nMiddle\r\n11 год тому\r\nНавички та технології\r\nNode.js\r\n\r\nReact.js\r\n\r\nОпис вакансії\r\nA potential invitation to potential minds!\r\n\r\n4K-Soft is People. People are most important to us. People are at the heart of every connection we build. Come and join 4K-Soft, where human minds come together to pave the way for the future. We offer a variety of full-time jobs, training programs and internships. Only imagine, how you can help our company and start your career with 4K-Soft!\r\n\r\nWe are looking for a Middle FullStack Web Developer.\r\n\r\nWhat we expect from you:\r\nEnglish level: B2 or higher\r\nExperience: 3+ years working with Node.js and React\r\n\r\nWe offer:\r\n\r\nCompetitive level of remuneration\r\n\r\nConvenient work schedule, paid vacation and sick leaves\r\n\r\nThe opportunity to grow professionally by participating in the implementation of interesting and complex projects, as well as showing personal initiative.\r\n\r\nExperience requirement: Only from 3 years of experience\r\n\r\nEnglish level: English B1 - Intermediate\r\nWork format: Full Remote\r\nEmployment: Fulltime\r\nDomain: Other\r\nRequired skills: Fullstack	40	60	try	{"Рівень англійської мови B1 замість B2+"}	Вітаю, командо 4K-Soft!\n\nЦя вакансія привернула увагу можливістю працювати над цікавими проєктами та розвивати свої навички у Full-Stack розробці з React та Node.js. Мені імпонує опис, що компанія цінує людей та їхній професійний ріст.\n\nЯ Full-Stack розробник з 3 роками комерційного досвіду, зосереджений на React, Next.js, TypeScript та Node.js. В одному з кейсів я оновив внутрішній медіа портал для керування рекламними матеріалами в 28 магазинах: модернізував UI/UX на Next.js, розширив бекенд на Node.js з Express та MySQL. Результатом стало скорочення часу налаштування реклами з 30 до 2 хвилин завдяки автоматизації та можливості планувати терміни показу.\n\nБуду радий поспілкуватися, детальніше розповісти про свій досвід та виконати тестове завдання.\n\nLinkedIn: www.linkedin.com/in/andriiinf\nEmail: andriiinf@gmail.com\nTelegram: @andriiinf	Медіа портал для керування ads на магазинах
cmt74x4x0000n4onr4hqmr84a	cmt3gwtm900004olcuaqzfbs0	2026-08-24 11:10:25.572	\N	Front-end Developer	\N	Front-end Developer\r\nWe are looking for a Front-end Developer\r\n\r\nDuties:\r\nLayout of pages for the site, landing pages;\r\nLayout for web application pages;\r\nAdaptation of the layout for different browsers and devices;\r\nParticipate in discussions on the user experience and functionality of the application.\r\nWhat we expect from you:\r\nHTML5 / CSS3 by prof. level;\r\nSass / Scss, CSS3 animations;\r\nJavaScript / jQuery;\r\nFlexBox, CssGrid;\r\nAdaptive cross-browser layout, valid code;\r\nStrong knowledge of Bootstrap;\r\nGit;\r\nExperience with Gulp or Webpack;\r\nPhotoshop, Ilustrator;\r\nPixelPerfect.\r\nWould be a plus:\r\nUnderstanding BEM;\r\nGSAP;\r\nWordPress.\r\nWe offer:\r\nCompetitive level of remuneration;\r\nModern comfortable office;\r\nConvenient work schedule, paid vacation and sick leaves;\r\nThe opportunity to grow professionally by participating in the implementation of interesting and complex projects, as well as showing personal initiative;\r\nSign up for an interview/ Send CV - telegram @Mariia_Seredovych	60	75	try	{"Відсутність досвіду роботи з Photoshop та Illustrator.","Відсутність досвіду з jQuery.","Нечітко підтверджений досвід з CSS3 animations, FlexBox та CssGrid.","Відсутність досвіду з GSAP.","Небажання працювати з WordPress (хоча досвід є)."}	Вітаю, командо!\n\nМене привабила ця вакансія акцентом на детальне відтворення макетів, адаптивний дизайн та роботу над користувацьким досвідом. Особливо цінним вважаю можливість створювати pixel-perfect сторінки та забезпечувати їхню кросбраузерність, що повністю відповідає моєму підходу до розробки та прагненню створювати якісні, візуально привабливі та функціональні інтерфейси.\n\nМаю 3 роки комерційного досвіду в розробці web-застосунків, переважно з використанням React, Next.js та TypeScript. Мої навички включають роботу з адаптивним дизайном, Sass/Scss та сучасними бібліотеками компонентів. В одному з проєктів я розробив та оновив UI/UX медіа порталу для централізованого керування рекламою у 28 торгових точках. Застосувавши Next.js, вдалося покращити інтерфейс користувача та спростити роботу з масовими змінами за фільтрами, а також автоматизувати планування показів реклами, що значно скоротило час налаштування.\n\nБуду радий поспілкуватися, детальніше розповісти про свій досвід та виконати тестове завдання.\n\nLinkedIn: www.linkedin.com/in/andriiinf\nEmail: andriiinf@gmail.com\nTelegram: @andriiinf	Медіа портал для керування ads на магазинах
\.


--
-- Data for Name: AnalysisRequirement; Type: TABLE DATA; Schema: public; Owner: aicl
--

COPY public."AnalysisRequirement" (id, "analysisId", requirement, candidate, match, explanation, "techExplainer", "isMustHave", "sortOrder") FROM stdin;
cmt3dbj3c00054op1ajjaxuc7	cmt3dbj3500044op14mnfw1w7	3+ years of commercial experience with NodeJS, MongoDB, and libraries like Mongoose.	Має 3 роки комерційного досвіду з Node.js (express, NestJS), MySQL, PostgreSQL. MongoDB зазначена в навичках, але не підтверджена проєктами. Mongoose не згадано.	yellow	Досвід з Node.js відповідає, але використання MongoDB та Mongoose не підтверджене проєктами.	\N	t	0
cmt3dbj3c00064op1bd8mpx99	cmt3dbj3500044op14mnfw1w7	Proven experience with web sockets and signaling fundamentals	Немає досвіду з WebSockets та signaling fundamentals.	red	Немає підтвердженого досвіду роботи з WebSockets або фундаментальними принципами сигналізації, що є важливою вимогою для проєкту з реальними комунікаціями.	WebSockets – це протокол зв'язку, що дозволяє двосторонній інтерактивний зв'язок між клієнтом і сервером у реальному часі. Сигналізація (signaling) – це процес обміну керуючою інформацією для встановлення, підтримки та роз'єднання з'єднання в реальному часі, наприклад, для WebRTC.	t	1
cmt3dbj3c00074op19sx4hjls	cmt3dbj3500044op14mnfw1w7	Experience with web applications fundamentals like HTML, JavaScript, CSS, REST, JSON	Володіє HTML5, CSS3, JavaScript, TypeScript, REST API та API, що підтверджено стеком та проєктами.	green	\N	\N	t	2
cmt3dbj3c00084op1oye6wnvl	cmt3dbj3500044op14mnfw1w7	Experience with REACT (+Redux) and JQuery	Має досвід з React та Redux Toolkit. jQuery не згадано.	yellow	Кандидат має досвід з React та Redux Toolkit, але відсутній досвід з jQuery.	\N	t	3
cmt3dbj3c00094op1eytcv62y	cmt3dbj3500044op14mnfw1w7	Strong ability to understand existing code and fix bugs and write enhancements (without rewriting code)	Кандидат має досвід оновлення UI/розширення функціоналу бекенду, оптимізації запитів та адміністрування систем, що свідчить про вміння працювати з існуючим кодом.	green	\N	\N	t	4
cmt3dbj3c000a4op1748vnulc	cmt3dbj3500044op14mnfw1w7	Сross-browser development and compatibility experience	Немає прямого підтвердження досвіду крос-браузерної розробки, але pixel-perfect та робота з сучасними фреймворками зазвичай вимагають знання цих принципів.	yellow	Досвід крос-браузерної розробки не вказано явно, але це базова вимога для frontend розробки, що може бути наявна.	\N	t	5
cmt3dbj3c000b4op1camalkor	cmt3dbj3500044op14mnfw1w7	Good debugging skills	Навички налагодження не згадані прямо, але є досвід оптимізації коду та вирішення проблем, що передбачає хороші навички налагодження.	yellow	Навички налагодження не згадані явно, але вони є невід'ємною частиною досвіду розробника та виправлення помилок.	\N	t	6
cmt3dbj3c000c4op1uh8bh7mb	cmt3dbj3500044op14mnfw1w7	Intermediate English (able to pass interview in English)	Рівень англійської B1 (Intermediate).	green	\N	\N	t	7
cmt3dbj3c000d4op15zdgheqr	cmt3dbj3500044op14mnfw1w7	Familiarity with real-time communication technologies including WebRTC, RTP, SIP, and audio/video codecs	Немає досвіду або згадки про WebRTC, RTP, SIP та аудіо/відео кодеки.	red	Відсутній досвід або знайомство з WebRTC, RTP, SIP та аудіо/відео кодеками.	WebRTC (Web Real-Time Communication) – це технологія, що дозволяє веб-додаткам і сайтам здійснювати захоплення та потокову передачу аудіо та відео між браузерами напряму. RTP (Real-time Transport Protocol) і SIP (Session Initiation Protocol) є протоколами для передачі медіа в реальному часі та встановлення/керування сесіями зв'язку відповідно. Аудіо/відео кодеки використовуються для стиснення та розпакування медіаданих.	f	8
cmt3de6d6000f4op1wyrej5ht	cmt3de6d1000e4op1q3c9outh	3+ years of commercial experience with NodeJS, MongoDB, and libraries like Mongoose.	Має 3 роки комерційного досвіду з Node.js. MongoDB згадана в розділі 'Skills', але немає підтвердженого досвіду проєктів з MongoDB чи Mongoose.	yellow	Кандидат має 3 роки досвіду з Node.js, але досвід роботи з MongoDB та бібліотекою Mongoose не підтверджений проєктами.	\N	t	0
cmt3de6d6000g4op1ymm5t6sk	cmt3de6d1000e4op1q3c9outh	Proven experience with web sockets and signaling fundamentals	Відсутній досвід.	red	Відсутній досвід роботи з WebSockets та основними принципами сигналізації.	WebSockets – це протокол зв'язку, який забезпечує повнодуплексний зв'язок між клієнтом та сервером через одне довготривале TCP-з'єднання, що дозволяє обмін даними в реальному часі. Signaling fundamentals – це основи механізмів обміну повідомленнями (сигналами) між учасниками для встановлення, керування та завершення зв'язку.	t	1
cmt3de6d6000h4op1db2ncl0m	cmt3de6d1000e4op1q3c9outh	Experience with web applications fundamentals like HTML, JavaScript, CSS, REST, JSON	Має досвід роботи з HTML5, CSS3, JavaScript, TypeScript, REST API.	green	\N	\N	t	2
cmt3de6d6000i4op1r5kfud2o	cmt3de6d1000e4op1q3c9outh	Experience with REACT (+Redux) and JQuery	Має досвід роботи з React та Redux Toolkit, але JQuery не згадано.	yellow	Кандидат має досвід роботи з React та Redux Toolkit, але JQuery в його профілі не згадано.	\N	t	3
cmt3de6d6000j4op1l8okzval	cmt3de6d1000e4op1q3c9outh	Strong ability to understand existing code and fix bugs and write enhancements (without rewriting code)	Проєкти кандидата включають оновлення інтерфейсів, розширення бекенду, оптимізацію SQL запитів та автоматизацію існуючих процесів.	green	\N	\N	t	4
cmt74x4x7000u4onrbl4im2xe	cmt74x4x0000n4onr4hqmr84a	Git	Має досвід роботи з Git, GitHub, Git CI/CD.	green	\N	\N	t	6
cmt3de6d6000k4op1bgirgjhc	cmt3de6d1000e4op1q3c9outh	Сross-browser development and compatibility experience	Не згадано прямо, але досвід розробки 'pixel-perfect' фронтендів на основі Figma-макетів для різних проєктів вказує на розуміння кросбраузерної сумісності.	yellow	Не згадано прямо, але досвід розробки pixel-perfect фронтендів вказує на розуміння кросбраузерної сумісності як стандартної практики.	\N	t	5
cmt3de6d6000l4op137suaqd5	cmt3de6d1000e4op1q3c9outh	Good debugging skills	Базова навичка для розробника з 3-річним досвідом. Використання AI-інструментів (Cursor AI, Claude Code) може сприяти ефективному налагодженню.	green	\N	\N	t	6
cmt3de6d6000m4op135w0psdh	cmt3de6d1000e4op1q3c9outh	Intermediate English (able to pass interview in English)	Рівень англійської B1 (Intermediate).	green	\N	\N	t	7
cmt3de6d6000n4op1o9h53xu9	cmt3de6d1000e4op1q3c9outh	Familiarity with real-time communication technologies including WebRTC, RTP, SIP, and audio/video codecs	Відсутнє знайомство з цими технологіями.	red	Відсутній досвід та знайомство з WebRTC, RTP, SIP та аудіо/відео кодеками.	WebRTC (Web Real-Time Communication) — це відкритий стандарт для організації обміну даними та медіа в реальному часі між браузерами та мобільними додатками без проміжних серверів. RTP (Real-time Transport Protocol) і SIP (Session Initiation Protocol) — це протоколи, що використовуються для передачі медіа в реальному часі та керування сесіями зв'язку відповідно. Аудіо/відео кодеки використовуються для стиснення та розпакування медіаданих.	f	8
cmt3i845a00014olckfvqcbxm	cmt3i845100004olcpr8g5goz	3+ years of software engineering experience working on complex systems in both backend and frontend.	Має 3 роки комерційного досвіду Full-Stack розробки, працював над маркетплейсом, системами для рітейлу та автоматизації бізнес-процесів.	green	\N	\N	t	0
cmt3i845a00024olcja8rkcu3	cmt3i845100004olcpr8g5goz	React experience.	Має досвід роботи з React, Next.js, Redux Toolkit, MUI, Tailwind, що підтверджено проєктами та стеком.	green	\N	\N	t	1
cmt3i845a00034olcetigxd3x	cmt3i845100004olcpr8g5goz	Backend development experience.	Має досвід з Node.js, NestJS, express.js, MySQL та PostgreSQL.	green	\N	\N	t	2
cmt3i845a00044olcrsz676co	cmt3i845100004olcpr8g5goz	Python experience.	Немає в підтвердженому стеку.	red	Основний бекенд Kapa та компоненти ML використовують Python, якого немає в досвіді кандидата.	Python – це високорівнева мова програмування, широко використовувана для веброзробки (особливо бекенду), аналізу даних, машинного навчання та автоматизації. Вакансія вимагає його для масштабування RAG-системи, аналітичної платформи та роботи з даними.	t	3
cmt3i845b00054olcacvwzuw7	cmt3i845100004olcpr8g5goz	An affinity for machine learning, deep learning (including LLMs) and natural language processing.	Використовував Cursor AI та Claude Code для автоматизації розробки.	yellow	Кандидат використовував AI-інструменти для розробки, але не демонструє досвіду або глибокої зацікавленості у базових принципах машинного навчання, LLM або NLP.	\N	t	4
cmt3i845b00064olcrwloi843	cmt3i845100004olcpr8g5goz	Experience with infrastructure scaling.	Має досвід з Docker, Linux, VPS Deployment, оптимізацією SQL запитів, що сприяє масштабованості систем.	green	\N	\N	t	5
cmt3i845b00074olcwxfawh07	cmt3i845100004olcpr8g5goz	Client integrations experience.	Розробляв REST API та інтегрував сторонні сервіси для OpenCart, WordPress та власних MVP-систем.	green	\N	\N	t	6
cmt3i845b00084olcdzhseglc	cmt3i845100004olcpr8g5goz	A degree in computer science, machine learning, mathematics, statistics or a related field.	Має ступінь бакалавра з початкової освіти.	red	Кандидат має ступінь з початкової освіти, а не з комп'ютерних наук, ML, математики чи статистики.	Вакансія шукає фундаментальну академічну базу в цих галузях, що може свідчити про теоретичне розуміння алгоритмів, структур даних та математичних основ, важливих для роботи з комплексними системами, особливо в контексті ШІ та ML.	f	7
cmt3i845b00094olck3z8sx5a	cmt3i845100004olcpr8g5goz	Ability to work effectively in a fast environment where things are sometimes loosely defined.	Має 3 роки досвіду роботи на Full-Stack позиціях над різними проєктами, що свідчить про адаптивність та здатність працювати в динамічному середовищі.	green	\N	\N	f	8
cmt3i92cy000b4olcmcb3bega	cmt3i92ct000a4olcpnjdq77o	3+ роки досвіду розробки складних систем (backend та frontend).	Має 3 роки комерційного досвіду як Full-Stack developer, розробляв MVP маркетплейс, системи звітів та управління рекламою.	green	\N	\N	t	0
cmt3i92cy000c4olcp61l4l76	cmt3i92ct000a4olcpnjdq77o	Досвід роботи з React.	Має досвід роботи з React, NextJS та Redux Toolkit, розробляв UI з використанням MUI та Tailwind.	green	\N	\N	t	1
cmt3i92cy000d4olcfazyb5xl	cmt3i92ct000a4olcpnjdq77o	Досвід роботи з Python.	Немає підтвердженого досвіду.	red	У профілі кандидата відсутній досвід роботи з Python, що є критичним для цієї ролі.	Python є основною мовою для бекенду Kapa RAG engine, аналітичної платформи та для доступу до даних, що є ключовими обов'язками в цій ролі.	t	2
cmt74x4x7000v4onrca1k4aue	cmt74x4x0000n4onr4hqmr84a	Experience with Gulp or Webpack	Має досвід роботи з Gulp, Webpack та Vite.	green	\N	\N	t	7
cmt3i92cy000e4olc82wqcvab	cmt3i92ct000a4olcpnjdq77o	Досвід роботи з масштабуванням інфраструктури (Docker, Linux, VPS).	Адміністрував Linux VPS сервери, деплоїв проєкти за допомогою Docker, має досвід VPS Deployment та LAMPP.	green	\N	\N	t	3
cmt3i92cy000f4olc5ac982ij	cmt3i92ct000a4olcpnjdq77o	Диплом з комп'ютерних наук, машинного навчання, математики, статистики або суміжної галузі.	Має ступінь бакалавра з початкової освіти.	red	Кандидат має ступінь бакалавра з початкової освіти, а не з профільної технічної чи математичної галузі.	\N	f	4
cmt3i92cy000g4olcxtl0dmcq	cmt3i92ct000a4olcpnjdq77o	Схильність до машинного навчання, глибокого навчання (включаючи LLMs) та обробки природної мови (NLP).	Використовував AI-інструменти (Cursor AI, Claude Code) у розробці.	yellow	Використання AI-інструментів демонструє зацікавленість у сфері, але не підтверджує пряму схильність чи досвід у розробці або глибоке розуміння ML/LLM/NLP концепцій.	\N	f	5
cmt3i92cy000h4olcbivqj8q0	cmt3i92ct000a4olcpnjdq77o	Досвід роботи з інтеграцією даних та API.	Розробляв REST API, інтегрував сторонні сервіси, оптимізував SQL-запити.	green	\N	\N	f	6
cmt4np75m000j4olcz9gc2hln	cmt4np758000i4olcgdndx5e7	3+ years of commercial experience in Full-Stack development	Має 3 роки комерційного досвіду як Full-Stack developer.	green	\N	\N	t	0
cmt4np75m000k4olc4ln5jni2	cmt4np758000i4olcgdndx5e7	Strong knowledge of TypeScript	TypeScript є у підтвердженому стеку та використовувався у проєктах з Next.js та Node.js.	green	\N	\N	t	1
cmt4np75m000l4olctp93jfjl	cmt4np758000i4olcgdndx5e7	Experience with NestJS / Node.js	Має досвід роботи з Node.js (express) у проєктах та NestJS у стеку.	green	\N	\N	t	2
cmt4np75m000m4olcmyce7lx6	cmt4np758000i4olcgdndx5e7	Experience with TypeORM	Немає в профілі.	red	Відсутній досвід роботи з TypeORM.	TypeORM – це Object-Relational Mapper (ORM) для TypeScript та JavaScript, що дозволяє працювати з базами даних (наприклад, MySQL) за допомогою об'єктно-орієнтованого підходу замість чистого SQL. Вакансія вимагає досвіду використання TypeORM для взаємодії з MySQL.	t	3
cmt4np75m000n4olckf5yi4n5	cmt4np758000i4olcgdndx5e7	Hands-on experience with MySQL	Має досвід роботи з MySQL, PostgreSQL, SQL, що підтверджено стеком та проєктами.	green	\N	\N	t	4
cmt4np75m000o4olcyx7if6kk	cmt4np758000i4olcgdndx5e7	Experience developing with Angular (version 21 or a close equivalent)	Немає в профілі.	red	Кандидат має досвід роботи з React та Next.js, але немає досвіду розробки з Angular.	Angular – це популярний фронтенд-фреймворк для розробки односторінкових додатків. Вакансія вимагає досвіду роботи саме з Angular, версії 21 або аналогічною, а не з іншими фронтенд-технологіями.	t	5
cmt4np75m000p4olcjrtj66qm	cmt4np758000i4olcgdndx5e7	Confident use of Git	Git та GitHub вказані у стеку та досвіді.	green	\N	\N	t	6
cmt4np75m000q4olcwrg9fb4f	cmt4np758000i4olcgdndx5e7	English B1	Рівень англійської мови B1 (Intermediate).	green	\N	\N	t	7
cmt4np75m000r4olcvs9u2rpa	cmt4np758000i4olcgdndx5e7	Experience working with the OpenAI API	Використовував AI-інструменти Cursor AI та Claude Code.	yellow	Кандидат має досвід використання AI-інструментів, але не зазначено досвіду безпосередньої інтеграції OpenAI API в розроблені застосунки.	\N	f	8
cmt4np75m000s4olcvps8f0c9	cmt4np758000i4olcgdndx5e7	Experience using Docker	Docker є в стеку. Досвід деплою проєктів за допомогою Docker підтверджено.	green	\N	\N	f	9
cmt4np75m000t4olcnpv681md	cmt4np758000i4olcgdndx5e7	Writing and maintaining automated tests with Playwright	Немає в профілі.	red	Відсутній досвід написання та підтримки автоматизованих тестів, зокрема з Playwright.	Playwright – це фреймворк для автоматизованого тестування веб-додатків, що дозволяє писати end-to-end та інтеграційні тести. Вакансія вимагає досвіду написання та підтримки таких тестів за допомогою Playwright.	f	10
cmt4ns1j5000v4olcf8k15rxi	cmt4ns1iv000u4olcrztw5c7z	3+ years of commercial experience in Full-Stack development	Має 3 роки комерційного досвіду як Full-Stack розробник.	green	\N	\N	t	0
cmt4ns1j5000w4olcweuh3dsx	cmt4ns1iv000u4olcrztw5c7z	Strong knowledge of TypeScript	TypeScript присутній у підтвердженому стеку та активно використовувався у проєктах.	green	\N	\N	t	1
cmt4ns1j5000x4olcxziadsxv	cmt4ns1iv000u4olcrztw5c7z	Experience with NestJS / Node.js	Має досвід роботи з NestJS та Node.js, зазначені в стеку та кейсах проєктів.	green	\N	\N	t	2
cmt4ns1j5000y4olcqajvydo9	cmt4ns1iv000u4olcrztw5c7z	Experience with TypeORM	TypeORM зазначений у підтвердженому стеку.	green	\N	\N	t	3
cmt4ns1j5000z4olckkmiioah	cmt4ns1iv000u4olcrztw5c7z	Hands-on experience with MySQL	Має досвід роботи з MySQL, зазначений у стеку та кейсах проєктів.	green	\N	\N	t	4
cmt74x4x7000w4onrwyfxf35o	cmt74x4x0000n4onr4hqmr84a	Photoshop, Ilustrator	Немає в профілі досвіду роботи з Photoshop та Illustrator.	red	Відсутній досвід роботи з дизайнерськими інструментами Photoshop та Illustrator, які вказані як обов'язкові вимоги.	Photoshop та Illustrator – це графічні редактори для створення та обробки растрових і векторних зображень. У вакансії очікується, що розробник володіє цими інструментами, можливо, для роботи з макетами або для внесення невеликих правок.	t	8
cmt4ns1j500104olchp8zcyz8	cmt4ns1iv000u4olcrztw5c7z	Experience developing with Angular (version 21 or a close equivalent)	Досвід розробки з Angular відсутній у профілі кандидата.	red	Відсутній досвід розробки з Angular, що є ключовою фронтенд-технологією для цієї вакансії.	Angular — це комплексний фреймворк для розробки односторінкових додатків (SPA) з використанням TypeScript. Він забезпечує структуру, інструменти для управління станом, маршрутизацію та інше. Вакансія вимагає досвіду саме з Angular 21 або подібною версією для розробки інтерфейсу користувача.	t	5
cmt4ns1j500114olctm0tpaif	cmt4ns1iv000u4olcrztw5c7z	Confident use of Git	Має досвід роботи з Git та GitHub.	green	\N	\N	t	6
cmt4ns1j500124olcwk7arp4y	cmt4ns1iv000u4olcrztw5c7z	Experience working with the OpenAI API	Використовував AI-assisted інструменти (Cursore, Claude Code), але досвід прямої інтеграції з OpenAI API не підтверджений.	red	Хоча кандидат використовував AI-assisted інструменти, досвід прямої інтеграції з OpenAI API не підтверджений.	OpenAI API надає доступ до моделей штучного інтелекту, таких як GPT, DALL-E, Whisper, для інтеграції можливостей генерації тексту, зображень, мовлення в застосунки. Досвід роботи передбачає безпосереднє використання цих API.	f	7
cmt4ns1j500134olc4h59tfdo	cmt4ns1iv000u4olcrztw5c7z	Experience using Docker	Має досвід використання Docker для деплою проєктів.	green	\N	\N	f	8
cmt4ns1j500144olcvg3pn200	cmt4ns1iv000u4olcrztw5c7z	Writing and maintaining automated tests with Playwright	Відсутній досвід роботи з Playwright або іншими фреймворками для автоматизованого тестування UI.	red	Немає підтвердженого досвіду написання та підтримки автоматизованих тестів за допомогою Playwright.	Playwright — це фреймворк для автоматизації веб-браузерів, що дозволяє писати end-to-end тести для веб-додатків. Він підтримує різні мови програмування (JS/TS, Python, Java, .NET) та надає інструменти для взаємодії з UI, виконання дій та перевірки результатів.	f	9
cmt74lcf900014onrwbor9vgg	cmt74lcej00004onrokyghlsw	Впевнене знання JavaScript (ES6+) та основних концепцій (замикання, асинхронність, прототипне успадкування), досвід роботи з TypeScript	Має 3 роки комерційного досвіду з JavaScript та TypeScript, включно з Next.js та Node.js.	green	\N	\N	t	0
cmt74lcf900024onrs425xe01	cmt74lcej00004onrokyghlsw	Глибокі знання React, розуміння компонентного підходу та створення односторінкових додатків (SPA)	Має досвід роботи з React та Next.js, розробляв фронтенд та інтерфейси.	green	\N	\N	t	1
cmt74lcf900034onrim7bqmc6	cmt74lcej00004onrokyghlsw	Досвід роботи з Node.js, Express/NestJS, розробка та інтеграція RESTful API	Має досвід роботи з Node.js, NestJS та Express.js, розробляв REST API.	green	\N	\N	t	2
cmt74lcf900044onreebmjsfd	cmt74lcej00004onrokyghlsw	Знання HTML, CSS (Flexbox, Grid, CSS-анімації), досвід роботи з фреймворком Tailwind CSS та Figma	Має досвід роботи з HTML5, CSS3, Tailwind CSS, pixel-perfect версткою, Figma. Досвід з pixel-perfect вказує на знання CSS-технік.	green	\N	\N	t	3
cmt74lcf900054onrk1ti9mb2	cmt74lcej00004onrokyghlsw	Досвід з CSS-препроцесорами (Sass, Less)	Не має досвіду з Sass або Less.	red	Кандидат не вказав досвід роботи з CSS-препроцесорами Sass або Less.	Sass (Syntactically Awesome Style Sheets) та Less є CSS-препроцесорами, що розширюють можливості стандартного CSS, додаючи змінні, вкладені правила, міксини, функції та інші фічі для спрощення та прискорення розробки стилів. Вакансія вимагає досвіду використання цих інструментів.	t	4
cmt74lcf900064onrupbjduto	cmt74lcej00004onrokyghlsw	Досвід з CSS-фреймворком Bootstrap	Не має досвіду з Bootstrap.	red	Кандидат не вказав досвід роботи з Bootstrap.	Bootstrap — це популярний фронтенд-фреймворк, що містить HTML, CSS та JavaScript-шаблони для компонентів інтерфейсу користувача (кнопки, форми, типографія, навігація тощо) та адаптивну сіткову систему, що спрощує створення адаптивних веб-сайтів.	t	5
cmt74lcf900074onraz8j1hnh	cmt74lcej00004onrokyghlsw	Досвід роботи з Git та GitFlow	Має досвід роботи з Git та GitHub.	green	\N	\N	t	6
cmt74lcf900084onr00dlxs7i	cmt74lcej00004onrokyghlsw	Досвід роботи з інструментами автоматизації (Webpack, Gulp, Vite)	Не має досвіду з Webpack, Gulp або Vite.	red	Кандидат не вказав досвід роботи з Webpack, Gulp або Vite.	Webpack, Gulp та Vite — це інструменти автоматизації та збірки (bundlers/build tools) для фронтенд-розробки. Вони використовуються для мініфікації коду, компіляції SASS/LESS, транспіляції JavaScript (наприклад, ES6+ до ES5), бандлінгу модулів та оптимізації ресурсів для продакшену.	t	7
cmt74x4x7000x4onrdd9uo762	cmt74x4x0000n4onr4hqmr84a	PixelPerfect	Має досвід 'pixel-perfect' верстки з Figma.	green	\N	\N	t	9
cmt74x4x7000y4onrbxmdzppa	cmt74x4x0000n4onr4hqmr84a	Understanding BEM	Немає прямої згадки про розуміння BEM.	yellow	Розуміння BEM є хорошою практикою, але не підтверджено в профілі, хоча може бути частиною професійного досвіду.	\N	f	10
cmt74lcf900094onr1355bzse	cmt74lcej00004onrokyghlsw	Досвід з CI/CD для розгортання	Має досвід з Docker, Linux та VPS Deployment, але CI/CD не вказано.	red	Кандидат має досвід деплою, але не вказав досвіду з повноцінними CI/CD-процесами або інструментами.	CI/CD (Continuous Integration/Continuous Deployment) — це набір практик та інструментів для автоматизації етапів розробки, тестування та розгортання програмного забезпечення. Це включає автоматичне збирання коду при кожному коміті (CI) та автоматичне розгортання (CD) його на тестові або виробничі сервери.	t	8
cmt74lcf9000a4onryk3w9rvq	cmt74lcej00004onrokyghlsw	Досвід написання юніт- та інтеграційних тестів (Jest, Mocha, Cypress), розуміння TDD та BDD	Не має досвіду з Jest, Mocha, Cypress, TDD або BDD.	red	У профілі кандидата відсутній досвід з тестуванням та відповідними фреймворками/методологіями.	Jest, Mocha, Cypress — це популярні фреймворки для написання тестів у JavaScript-розробці. Jest та Mocha часто використовуються для юніт- та інтеграційних тестів, тоді як Cypress — для наскрізного (end-to-end) тестування. TDD (Test-Driven Development) та BDD (Behavior-Driven Development) — це методології розробки, де тести пишуться до написання основного коду.	t	9
cmt74lcf9000b4onra66guex1	cmt74lcej00004onrokyghlsw	Знання GraphQL (буде плюсом)	Не має знань GraphQL.	red	Кандидат не вказав знання GraphQL.	GraphQL — це мова запитів для API та середовище виконання для цих запитів на основі існуючих даних. Вона пропонує ефективніший, потужніший та гнучкіший підхід до розробки API у порівнянні з REST.	f	10
cmt74t2r9000d4onret3tegkt	cmt74t2qu000c4onr2l10hxba	Впевнене знання JavaScript (ES6+), основних концепцій (замикання, асинхронність, прототипне успадкування), досвід роботи з TypeScript.	Має 3 роки комерційного досвіду з JavaScript (ES6+), TypeScript, Node.js та NestJS.	green	\N	\N	t	0
cmt74t2r9000e4onrx5y7jf99	cmt74t2qu000c4onr2l10hxba	Глибокі знання React, розуміння компонентного підходу та створення односторінкових додатків (SPA).	Має досвід з React, Next.js та Redux Toolkit, розробляв SPA.	green	\N	\N	t	1
cmt74t2r9000f4onrkzwmgcu5	cmt74t2qu000c4onr2l10hxba	Досвід роботи з Node.js, Express/NestJS; розробка та інтеграція RESTful API.	Має досвід з Node.js, NestJS, express.js та REST API, розробляв бекенд та інтегрував API.	green	\N	\N	t	2
cmt74t2r9000g4onr3k68uwgi	cmt74t2qu000c4onr2l10hxba	Знання HTML, CSS (Flexbox, Grid, CSS-анімації), досвід з CSS-препроцесорами (Sass, Less), фреймворками (Bootstrap, Tailwind CSS), робота з Figma або Adobe XD.	Має досвід з HTML5, CSS3, Tailwind, Bootstrap, Sass, Less та Figma, працював з pixel-perfect версткою.	green	\N	\N	t	3
cmt74t2r9000h4onrjd69drdk	cmt74t2qu000c4onr2l10hxba	Досвід з Git, GitFlow, інструментами автоматизації (Webpack, Gulp, Vite), CI/CD для розгортання.	Має досвід з Git, GitHub, Webpack, Gulp, Vite, Git CI/CD та Docker для розгортання проєктів.	green	\N	\N	t	4
cmt74t2r9000i4onrh6dagczc	cmt74t2qu000c4onr2l10hxba	Досвід написання юніт- та інтеграційних тестів (Jest, Mocha, Cypress), розуміння TDD та BDD.	Має досвід з Jest.	yellow	Кандидат має досвід з Jest, але не зазначено досвіду з Mocha, Cypress, TDD або BDD.	\N	t	5
cmt74t2r9000j4onrghy6vup2	cmt74t2qu000c4onr2l10hxba	Знання GraphQL.	Відсутнє у профілі.	red	Відсутній досвід роботи з GraphQL у профілі кандидата.	GraphQL — це мова запитів для API та середовище виконання для виконання цих запитів з вашими наявними даними. Це альтернатива REST API, яка дозволяє клієнтам запитувати саме ті дані, які їм потрібні.	f	6
cmt74tsza000l4onrsbgoisd4	cmt74tsyz000k4onrdd4q9ei5	Досвід роботи 3+ роки з Node.js та React	Кандидат має 3 роки комерційного досвіду та активно використовує React, Next.js та Node.js у своїх проєктах.	green	\N	\N	t	0
cmt74tsza000m4onroqlpkray	cmt74tsyz000k4onrdd4q9ei5	Рівень англійської мови B2 або вище	Рівень англійської мови кандидата B1 (Intermediate).	red	Рівень англійської кандидата B1, тоді як вакансія вимагає B2 або вище.	\N	t	1
cmt74x4x7000o4onrnjrmhycf	cmt74x4x0000n4onr4hqmr84a	HTML5 / CSS3 by prof. level	Має досвід роботи з HTML5 та CSS3.	green	\N	\N	t	0
cmt74x4x7000p4onr82c6xbrg	cmt74x4x0000n4onr4hqmr84a	Sass / Scss, CSS3 animations	Знає Sass, CSS3. Немає прямої згадки про CSS3 animations.	yellow	Sass присутній у стеку, але досвід з CSS3 animations не підтверджено, хоча може бути частиною професійного володіння CSS3.	\N	t	1
cmt74x4x7000q4onrwidmxo1v	cmt74x4x0000n4onr4hqmr84a	JavaScript / jQuery	Має досвід з JavaScript, але не згадано jQuery.	yellow	Кандидат має сильний досвід з JavaScript, але відсутній досвід з jQuery, який може бути менш релевантним для сучасних проєктів.	\N	t	2
cmt74x4x7000r4onr3cxcorqg	cmt74x4x0000n4onr4hqmr84a	FlexBox, CssGrid	Немає прямої згадки про FlexBox та CssGrid.	yellow	Хоча FlexBox та CssGrid є стандартними для сучасної верстки, досвід кандидата не підтверджено явно, але він імовірно використовував їх у pixel-perfect проєктах.	\N	t	3
cmt74x4x7000s4onr1rx95x5e	cmt74x4x0000n4onr4hqmr84a	Adaptive cross-browser layout, valid code	Має досвід 'pixel-perfect' верстки та розробки UI з Next.js.	green	\N	\N	t	4
cmt74x4x7000t4onrvxoeavdk	cmt74x4x0000n4onr4hqmr84a	Strong knowledge of Bootstrap	Bootstrap вказано у стеку.	green	\N	\N	t	5
cmt74x4x7000z4onr8xieg739	cmt74x4x0000n4onr4hqmr84a	GSAP	Немає в профілі досвіду роботи з GSAP.	red	Відсутній досвід роботи з бібліотекою GSAP для анімацій.	GSAP (GreenSock Animation Platform) – це потужна JavaScript бібліотека для створення високопродуктивних анімацій у вебі.	f	11
cmt74x4x700104onrvayaaly1	cmt74x4x0000n4onr4hqmr84a	WordPress	Є досвід роботи з WordPress, але кандидат не хоче з ним працювати.	yellow	Хоча кандидат має досвід роботи з WordPress, він висловив небажання працювати з цією технологією.	\N	f	12
\.


--
-- Data for Name: ExampleCoverLetter; Type: TABLE DATA; Schema: public; Owner: aicl
--

COPY public."ExampleCoverLetter" (id, "profileId", title, company, role, "whyItWorks", body, "sortOrder", "createdAt", "updatedAt") FROM stdin;
cmt3ciad100024op1912bn7ht	cmt3gwtm900004olcuaqzfbs0	Geniuse	Geniuse	Full-Stack	- Привітання з назвою компанії/команди\r\n- Чому мені сподобалась конкретна вакансія\r\n- Коротко про мене + ОДИН релевантний кейс\r\n- Завершення\r\n- Контакти	Вітаю, командо Geniusee!\r\n\r\nМене зацікавила ця вакансія можливістю працювати над сучасними web-застосунками в команді, де цінують розвиток, відповідальність та якість реалізації. Також мені близький формат роботи з новими функціями від ідеї до production та співпраця frontend, backend і design команд.\r\n\r\nЯ розробник із 3 роками комерційного досвіду, працюю з React, Next.js, TypeScript, Redux Toolkit та Tailwind CSS. В одному з проєктів я розробив web-додаток для централізованого керування рекламними аудіо та відеороликами у 28 торгових точках. \r\n\r\nБуду радий поспілкуватися, детальніше розповісти про свій досвід та виконати тестове завдання.\r\n\r\nLinkedIn: linkedin.com/in/andriiinf/\r\nEmail: andriiinf@gmail.com\r\nTelegram: t.me/andriiinf	0	2026-08-21 19:31:45.014	2026-08-21 19:31:45.014
cmt3cv4b900034op1b2jp6rkr	cmt3gwtm900004olcuaqzfbs0	Dripro-M	Dripro-M	Full-Stack	Це велика та перспективна компанія яка займає велику частину ринку і лист стилізований та персоналізований під неї і є чітка структура повідомлення\r\n\r\n- Привітання з назвою компанії/команди\r\n- Чому мені сподобалась конкретна вакансія\r\n- Коротко про мене + ОДИН релевантний кейс\r\n- Завершення\r\n- Контакти	Вітаю, командо Dnipro-M! Мене зацікавила ця вакансія можливістю працювати в сильній компанії, яка дійсно впливає на ринок України і працювати з такою компанією як ви це велике досягнення, адже для мене важливо впливати на продукт і бачити реалізовані рішення. Я розробник із 3 роками комерційного досвіду, працюю з React, Next.js, TypeScript, Node.js та NestJS використовуючи Express.js. В одному з проєктів я розробив web-додаток для централізованого керування рекламними аудіо та відеороликами у 28 торгових точках. Впроваджував UI за макетами Figma, писав кастовмі API та інтегровував їх. Буду радий поспілкуватися, детальніше розповісти про свій досвід та виконати тестове завдання. LinkedIn: linkedin.com/in/andriiinf/ Email: andriiinf@gmail.com Telegram: t.me/andriiinf	1	2026-08-21 19:41:43.702	2026-08-21 19:41:43.702
\.


--
-- Data for Name: Profile; Type: TABLE DATA; Schema: public; Owner: aicl
--

COPY public."Profile" (id, "createdAt", "updatedAt", "fullName", headline, "yearsExperience", "englishLevel", location, "workFormat", "targetLevel", "clLanguage", linkedin, email, telegram, "cvFileName", "cvMimeType", "cvText", "coreStack", "avoidInCl", "extraNotes", "clMatchThreshold", "clCharLimit", "userId") FROM stdin;
cmt3gwtm900004olcuaqzfbs0	2026-08-21 15:15:01.031	2026-08-24 11:12:17.286	Андрій	Full-Stack developer	3	B1	Україна	Remote	Middle	uk	https://www.linkedin.com/in/andriiinf/	andriiinf@gmail.com	@andriiinf	FullStack-developer_Pershko_Andrii.pdf	application/pdf	Developed an MVP marketplace from scratch using Next.js and Node.js, implementing customer and\r\nseller dashboards, an admin panel, REST APIs, and core marketplace functionality.\r\nDeveloped the frontend of an e-commerce application for UPS systems using Next.js, based on Figma\r\ndesigns and following a pixel-perfect approach while collaborating with a backend developer.\r\nDeveloped the frontend of an airport transfer service using Next.js, implementing Figma designs with a\r\npixel-perfect approach.\r\nDeveloped REST APIs, integrated third-party services, and customized OpenCart and WordPress\r\nsolutions to meet client business requirements.\r\nDeveloped a football information website on WordPress. Connected it with a streaming platform API to\r\nget match and player data and display it on the website.\r\nAdministered Linux VPS servers, deployed projects using Docker, and ensured stable client access to\r\napplication versions during development.\r\nUsed Cursor AI to automate routine development tasks, speed up implementation, and improve\r\ndevelopment productivity.\r\nUpdated the UI with Next.js and extended the Node.js backend for managing store music and ads\r\nacross 28 stores. Automated manual processes, reducing ad setup time from 30 minutes to 2 minutes\r\nand adding the ability to schedule ad deadlines.\r\nDeveloped an order reporting system for 28 retail stores, replacing manual Excel reports with\r\nautomated reports by date range or store. Reduced weekly report preparation time from 2 hours to\r\nunder 2 minutes.\r\nRestricted access to an internal system by adding user authentication and an admin panel for user\r\nmanagement. Improved usability by adding filters, sorting, and updating the interface based on new\r\nrequirements.\r\nCreated reusable WordPress templates that allowed the marketing team to create customer surveys\r\nwithout developers. Also developed promotional websites with REST API and 1C integration.\r\nOptimized SQL queries and database indexes, reducing query time from 5 seconds to 300 ms and page\r\nload time from 5–6 seconds to 0.8–1.2 seconds.\r\nPERSHKO ANDRII\r\nFULL-STACK DEVELOPER\r\nTelegram Mail +380 67 954 3102\r\nS K I L L S\r\nFrontend: React.js, Next.js, JS, TypeScript,\r\nRedux Toolkit, HTML5, CSS3, Tailwind\r\nBackend: Node.js, NestJS, JS, TypeScript, REST\r\nAPI, PHP\r\nDatabases: MySQL, PostgreSQL, SQL, MongoDB\r\nS U M M A R YFull-Stack Developer with 3 years of commercial experience building internal business systems\r\nand commercial web applications using React, Next.js, TypeScript, NestJS, PHP, and SQL.\r\nDelivered solutions used across 28 retail stores, reducing ad placement time from 30 minutes to 2\r\nminutes, automating reporting from 2 hours to under 2 minutes, and improving SQL query\r\nperformance from 5 seconds to 300 ms.\r\nTools: GIT, GITHUB, Figma, Postman\r\nAI-assisted development: Cursore, Claude Code\r\nDevOps: Linux, Docker, VPS Deployment, LAMPP\r\nLanguages: English Intermediate (B1), Ukrainian Native\r\nFull-Stack Developer, OBNOVA 10/2023 – 10/2025\r\nE X P E R I E N C E\r\nFull-Stack Developer, GrinDev 10/2025 – Present\r\nLinkedin\r\nEDUCATION\r\nVinnytsia Mykhailo Kotsiubynskyi State Pedagogical University (VSPU) 9/2014 – 6/2018\r\nBachelor's Degree in Primary Education\r\nVinnitsa	React, Next.js, TypeScript, JavaScript, Node.js, NestJS, MySQL, PostgreSQL, SQL, Docker, Linux, GitHub, GIT,REST API, API, MUI, pixel-perfect, express.js, figma, Postman, Cursore, Claude Code, VPS Deployment, LAMPP, Redux Toolkit, HTML5, CSS3, Tailwind, TypeORM, Prisma, Cloude, Cusror, Bootstrap, Sass, Less, Webpack, Gulp, Vite, Git  CI/CD, Jest, Sass / Scss, CSS3 animations, JavaScript / jQuery, FlexBox, CssGrid, BEM	Не хочу wordpress, php, laravel.	\N	50	1000	cmt3gwtm900004olcuaqzfbs0
\.


--
-- Data for Name: Project; Type: TABLE DATA; Schema: public; Owner: aicl
--

COPY public."Project" (id, "profileId", title, product, problem, contribution, stack, result, tags, "sortOrder", "createdAt", "updatedAt") FROM stdin;
cmt3c4nqg00004op1a6ucd82c	cmt3gwtm900004olcuaqzfbs0	Медіа портал для керування ads на магазинах	Внутрішній продукт	Оновити UI/UX, відокремити функціонал на окремий сайт, додати масові зміни по фільтрах та автоматизувати старт та дедлан.	- оновив інтерфейс користувача за допомогою Next.js\r\n- розширив функціонал бекенд на Node.js\r\n- Задеплоїв все на продакшен	{Next.js,TS,Node.js,express,multer,MySQL,VPS}	Оновлений інтерфейс користувача за допомогою Next.js та розширений бекенд на Node.js для керування музикою та рекламою на 28 магазинах. Автоматизовано ручні процеси, що скоротило час налаштування реклами з 30 хвилин до 2 хвилин та додало можливість планувати терміни показу реклами.	{}	0	2026-08-21 19:21:09.16	2026-08-21 19:21:09.16
cmt3ce1t500014op18a6vuzp6	cmt3gwtm900004olcuaqzfbs0	Автоматизація бізнес процесу	внутрішній функціонал	Автоматизувати формування звітності в гугл таблицю.	- Провів аналіз\r\n- Додав функціонал на UI\r\n- розширив backend новим функціоналом	{Next.js,TS,Node.js,express,MySQL,VPS}	Розроблено систему звітності замовленнь для 28 роздрібних магазинів, замінивши ручні звіти Excel на автоматичні звіти за діапазоном дат або магазином. Скорочено час підготовки щотижневих звітів з 2 годин до менш ніж 2 хвилин.	{}	1	2026-08-21 19:28:27.305	2026-08-21 19:28:27.305
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: aicl
--

COPY public."User" (id, email, "passwordHash", "createdAt", "updatedAt") FROM stdin;
cmt3gwtm900004olcuaqzfbs0	andriiinf@gmail.com	43c1d9be3e6dc1e54df2dbe6102d7240:d2926b500d4d27352cb2ce8712364521e010408bce4cc653f1a0d3f04f0d5736733fdfdea128ae926ca0959adc730b7f19ee9eeff486f90764f98806075a85a1	2026-08-21 21:35:01.617	2026-08-21 21:35:01.617
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: aicl
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
1f5de1fd-3b77-41d9-89e0-c7b6dac34aa1	ffcd2ac8f6d6334b27b286afa2da65ac81166d617f5368db1eb173ee9409e482	2026-08-21 15:01:01.519799+00	20260821100000_init	\N	\N	2026-08-21 15:01:01.481379+00	1
a7687bb4-537c-4a79-ae2e-49af263ac9fa	9dce820525625d6c892296c4d6fc46846b7ec5bb0d5f481987ba840eb5933ffa	2026-08-21 19:59:07.144915+00	20260821215500_cl_limits	\N	\N	2026-08-21 19:59:07.113057+00	1
39957e3d-8d18-4ed0-9794-5ec7b390e754	9664d7ab3aa2847e338f96d11c3110b596375402268bf97c0c1b0d3759d3b158	2026-08-21 20:40:29.508912+00	20260821223000_auth_users	\N	\N	2026-08-21 20:40:29.427571+00	1
\.


--
-- Name: AnalysisRequirement AnalysisRequirement_pkey; Type: CONSTRAINT; Schema: public; Owner: aicl
--

ALTER TABLE ONLY public."AnalysisRequirement"
    ADD CONSTRAINT "AnalysisRequirement_pkey" PRIMARY KEY (id);


--
-- Name: Analysis Analysis_pkey; Type: CONSTRAINT; Schema: public; Owner: aicl
--

ALTER TABLE ONLY public."Analysis"
    ADD CONSTRAINT "Analysis_pkey" PRIMARY KEY (id);


--
-- Name: ExampleCoverLetter ExampleCoverLetter_pkey; Type: CONSTRAINT; Schema: public; Owner: aicl
--

ALTER TABLE ONLY public."ExampleCoverLetter"
    ADD CONSTRAINT "ExampleCoverLetter_pkey" PRIMARY KEY (id);


--
-- Name: Profile Profile_pkey; Type: CONSTRAINT; Schema: public; Owner: aicl
--

ALTER TABLE ONLY public."Profile"
    ADD CONSTRAINT "Profile_pkey" PRIMARY KEY (id);


--
-- Name: Project Project_pkey; Type: CONSTRAINT; Schema: public; Owner: aicl
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: aicl
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: aicl
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: AnalysisRequirement_analysisId_idx; Type: INDEX; Schema: public; Owner: aicl
--

CREATE INDEX "AnalysisRequirement_analysisId_idx" ON public."AnalysisRequirement" USING btree ("analysisId");


--
-- Name: Analysis_profileId_idx; Type: INDEX; Schema: public; Owner: aicl
--

CREATE INDEX "Analysis_profileId_idx" ON public."Analysis" USING btree ("profileId");


--
-- Name: ExampleCoverLetter_profileId_idx; Type: INDEX; Schema: public; Owner: aicl
--

CREATE INDEX "ExampleCoverLetter_profileId_idx" ON public."ExampleCoverLetter" USING btree ("profileId");


--
-- Name: Profile_userId_key; Type: INDEX; Schema: public; Owner: aicl
--

CREATE UNIQUE INDEX "Profile_userId_key" ON public."Profile" USING btree ("userId");


--
-- Name: Project_profileId_idx; Type: INDEX; Schema: public; Owner: aicl
--

CREATE INDEX "Project_profileId_idx" ON public."Project" USING btree ("profileId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: aicl
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: AnalysisRequirement AnalysisRequirement_analysisId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aicl
--

ALTER TABLE ONLY public."AnalysisRequirement"
    ADD CONSTRAINT "AnalysisRequirement_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES public."Analysis"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Analysis Analysis_profileId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aicl
--

ALTER TABLE ONLY public."Analysis"
    ADD CONSTRAINT "Analysis_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES public."Profile"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ExampleCoverLetter ExampleCoverLetter_profileId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aicl
--

ALTER TABLE ONLY public."ExampleCoverLetter"
    ADD CONSTRAINT "ExampleCoverLetter_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES public."Profile"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Profile Profile_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aicl
--

ALTER TABLE ONLY public."Profile"
    ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Project Project_profileId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: aicl
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES public."Profile"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict cIrIu1HTGjhm6TGBQ3jIKv1QMtctXwv6ytc70PPmmN95KKfJY688bt845RlTHqx

