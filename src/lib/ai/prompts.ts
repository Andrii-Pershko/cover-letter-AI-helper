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

export const MATCH_SYSTEM = `Ти аналітик відповідності кандидата вакансії. Українською. Одразу JSON, без міркувань і без markdown.

ПРАВИЛА:
- Не вигадуй технології, продукти, роки, обов’язки.
- Джерела: підтверджений стек, роки досвіду, CV, кейси. Ідеальні CL — не факти.
- Не завищуй рівень. Senior у вакансії при меншому рівні/роках = gap.
- Nice-to-have ≠ must-have (isMustHave=false).
- Аліаси: Next.js=NextJS, RTK=Redux Toolkit, Postgres=PostgreSQL, Nest=NestJS, JS=JavaScript.
- matchMin/matchMax — чесний діапазон 0–100, краще занизити.
- recommendation: strong | try | weak.
- green: explanation=null, techExplainer=null.
- yellow: 1 коротке речення в explanation, techExplainer=null.
- red: коротке explanation + techExplainer (що це, навіщо, що хочуть).
- candidate — коротко що є (або «немає»).
- gaps — до 5 коротких рядків.
- Максимум 10 вимог, спочатку must-have, без дублів.
- JSON: companyName, jobTitle, jobLevel, matchMin, matchMax, recommendation, gaps, requirements[{requirement, candidate, match: green|yellow|red, isMustHave, explanation, techExplainer}]. Не name і не числовий match.`;

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
Формат: ${profile.workFormat || "—"}
Стек:
${clip(profile.coreStack, 1200)}
${profile.extraNotes ? `\nНотатки:\n${clip(profile.extraNotes, 400)}\n` : ""}
CV:
${clip(profile.cvText || "", 6000)}

КЕЙСИ:
${formatProjects(profile.projects, "match")}

ВАКАНСІЯ:
${clip(jobText, 6000)}`;
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
${clip(profile.coreStack, 1000)}

Не згадуй у листі:
${clip(profile.avoidInCl || "немає", 500)}

КЕЙС-БАНК (вибери ОДИН, usedProjectTitle = точна title):
${formatProjects(profile.projects, "letter")}

ІДЕАЛЬНІ COVER LETTER (тон, не копіюй речення і не бери факти):
${formatExamples(profile.exampleLetters)}

ВАКАНСІЯ:
${clip(jobText, 4000)}`;
}

function formatProjects(projects: Project[], mode: "match" | "letter"): string {
  if (projects.length === 0) return "немає";
  return projects
    .map((project, index) => {
      if (mode === "match") {
        return `${index + 1}. ${project.title} | ${project.product || "—"} | ${project.stack.join(", ") || "—"}
   ${clip(project.contribution, 280)}`;
      }
      return `${index + 1}. title: ${project.title}
   product: ${project.product || "—"}
   problem: ${clip(project.problem, 400)}
   contribution: ${clip(project.contribution, 500)}
   stack: ${project.stack.join(", ") || "—"}
   result: ${clip(project.result, 220)}
   tags: ${project.tags.join(", ") || "—"}`;
    })
    .join("\n\n");
}

function formatExamples(examples: ExampleCoverLetter[]): string {
  if (examples.length === 0) return "немає";
  return examples
    .map((example, index) => {
      return `${index + 1}. ${example.title}
   ${example.company || "—"} / ${example.role || "—"}
   чому вдалий: ${clip(example.whyItWorks, 280)}
   текст:
${clip(example.body, 1400)}`;
    })
    .join("\n\n");
}
