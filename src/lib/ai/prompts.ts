import type {
  ExampleCoverLetter,
  Profile,
  Project,
} from "@/generated/prisma/client";

type ProfilePayload = Profile & {
  projects: Project[];
  exampleLetters: ExampleCoverLetter[];
};

function clip(text: string, max: number): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max)}\n[...обрізано]`;
}

export const MATCH_SYSTEM = `Ти аналітик відповідності кандидата вакансії. Відповідай українською.

ПРАВИЛА:
- Не вигадуй технології, продукти, роки досвіду, обов’язки.
- Джерела правди: підтверджений стек, роки досвіду, CV, кейси проєктів. Ідеальні CL — НЕ джерело фактів.
- Не перебільшуй рівень. Якщо вакансія Senior, а в профілі Middle / менше років — це gap.
- Nice to have / «буде перевагою» не прирівнюй до обов’язкової вимоги (isMustHave=false).
- Аліаси: Next.js=NextJS, RTK=Redux Toolkit, Postgres=PostgreSQL, Nest=NestJS, JS=JavaScript.
- matchMin і matchMax — чесний діапазон 0–100. Краще занизити, ніж завищити.
- recommendation: strong (сильний match), try (є сенс спробувати), weak (слабкий match).
- green: кандидат закриває вимогу. explanation=null, techExplainer=null.
- yellow: частково / суміжний досвід. Коротке explanation (1 речення). techExplainer=null.
- red: немає в профілі. explanation — що бракує. techExplainer — що це за технологія/поняття, для чого, що саме хочуть у вакансії.
- candidate — коротко «що є у кандидата» по цій вимозі (або «немає»).
- gaps — лише основні прогалини, короткі рядки.
- Вимоги групуй: спочатку must-have, потім nice-to-have. Не дублюй одне й те саме.`;

export const COVER_LETTER_SYSTEM = `Ти пишеш короткий cover letter українською від першої особи.

Це НЕ шаблон з інтернету. Тон, довжина, ритм абзаців і манера заходити в кейс мають бути як у ідеальних листів користувача. Не копіюй їхні речення. Не копіюй їхні компанії/кейси, якщо вакансія інша.

ЖОРСТКА СТРУКТУРА (окремі поля, без зайвих абзаців):
1. greeting — привітання з назвою компанії/команди: «Вітаю, командо Devart!» або «Добрий день, командо Playtech!»
2. whyJob — чому сподобалась саме ця вакансія. Природно. Без «особливо близький», «я з ентузіазмом», «команда мрії». Прив’яжи до продукту, задач або формату з опису.
3. aboutAndCase — коротко про себе + ОДИН релевантний кейс з кейс-банку. Не пояснюй, що кандидат Full-Stack. Не розбивай frontend/backend окремими блоками. Кейс під цю вакансію, не той самий що в усіх листах.
4. closing — лише коротка фраза на кшталт: «Буду радий поспілкуватися, детальніше розповісти про свій досвід та виконати тестове завдання.»
5. usedProjectTitle — точна назва кейса з наданого списку.

ДОВЖИНА: у промпті буде ліміт символів. Чотири поля (greeting + whyJob + aboutAndCase + closing) разом мають вкластися в нього. Рахуй пробіли. Не роздувай і не пиши контакти.

ЗАБОРОНЕНО:
- «З повагою», Best regards, ім’я, підпис
- контакти (їх додасть система)
- гіперпосилання і markdown
- вигаданий досвід
- окремий мотиваційний абзац після завершення`;

export function buildMatchPrompt(profile: ProfilePayload, jobText: string): string {
  return `КАНДИДАТ
Ім'я: ${profile.fullName}
Позиціонування: ${profile.headline || "—"}
Цільовий рівень: ${profile.targetLevel || "—"}
Комерційний досвід: ${profile.yearsExperience ?? "—"} років
Англійська: ${profile.englishLevel || "—"}
Локація: ${profile.location || "—"}
Формат роботи: ${profile.workFormat || "—"}
Підтверджений стек (це база, не вигадуй зверху):
${clip(profile.coreStack, 4000)}

Обмеження для CL / нотатки:
${clip(profile.avoidInCl || profile.extraNotes || "немає", 2000)}

CV:
${clip(profile.cvText || "", 24000)}

КЕЙСИ ПРОЄКТІВ:
${formatProjects(profile.projects)}

ОПИС ВАКАНСІЇ:
${clip(jobText, 20000)}`;
}

export function buildCoverLetterPrompt(
  profile: ProfilePayload,
  jobText: string,
  analysis: {
    companyName: string | null;
    jobTitle: string | null;
    jobLevel: string | null;
    matchMin: number;
    matchMax: number;
    clCharLimit: number;
  },
): string {
  const minChars = Math.round(analysis.clCharLimit * 0.75);
  return `Вакансія: ${analysis.jobTitle || "не вказано"}
Компанія: ${analysis.companyName || "не вказано"}
Рівень вакансії: ${analysis.jobLevel || "не вказано"}
Match: ${analysis.matchMin}–${analysis.matchMax}%

ЛІМІТ ДОВЖИНИ (обов'язково):
Чотири поля greeting + whyJob + aboutAndCase + closing РАЗОМ — близько ${analysis.clCharLimit} символів (пробіли й переноси теж). Не довше за ${analysis.clCharLimit}. Не коротше за ${minChars}. Контакти не пиши — їх додасть система.

Кандидат: ${profile.fullName}
Headline: ${profile.headline || "—"}
Рівень, як себе подаємо: ${profile.targetLevel || "—"}
Досвід: ${profile.yearsExperience ?? "—"} років
Англійська: ${profile.englishLevel || "—"}
Стек:
${clip(profile.coreStack, 2000)}

Не згадуй у листі:
${clip(profile.avoidInCl || "немає", 1500)}

КЕЙС-БАНК (вибери ОДИН, usedProjectTitle = точна title):
${formatProjects(profile.projects)}

ІДЕАЛЬНІ COVER LETTER КОРИСТУВАЧА (еталон тону, не копіюй текст і не кради факти звідси):
${formatExamples(profile.exampleLetters)}

ОПИС ВАКАНСІЇ:
${clip(jobText, 12000)}`;
}

function formatProjects(projects: Project[]): string {
  if (projects.length === 0) return "немає";
  return projects
    .map((project, index) => {
      return `${index + 1}. title: ${project.title}
   product: ${project.product || "—"}
   problem: ${clip(project.problem, 800)}
   contribution: ${clip(project.contribution, 800)}
   stack: ${project.stack.join(", ") || "—"}
   result: ${clip(project.result, 400)}
   tags: ${project.tags.join(", ") || "—"}`;
    })
    .join("\n\n");
}

function formatExamples(examples: ExampleCoverLetter[]): string {
  if (examples.length === 0) return "немає";
  return examples
    .map((example, index) => {
      return `${index + 1}. ${example.title}
   компанія/роль: ${example.company || "—"} / ${example.role || "—"}
   чому вдалий: ${clip(example.whyItWorks, 600)}
   текст:
${clip(example.body, 3500)}`;
    })
    .join("\n\n");
}
