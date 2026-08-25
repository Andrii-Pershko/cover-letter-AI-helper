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

export const COVER_LETTER_SYSTEM = `Ти пишеш короткий cover letter українською від першої особи — так, ніби людина швидко накидає лист, не «продає себе».

Еталон — ідеальні листи користувача: тон, довжина, кількість речень, як заходять у кейс. Скопіюй малюнок абзаців, не речення і не їхні компанії/кейси.

ЖОРСТКА СТРУКТУРА (окремі поля):
1. greeting — «Вітаю, командо Geniusee!»
2. whyJob — 1–2 речення. Конкретно: продукт, задачі або формат з вакансії. Спокійно, без пафосу.
3. aboutAndCase — 2–3 речення. «Я розробник із N роками… стек.» Далі ОДИН кейс: що за продукт і що зробив, без розбору frontend/backend і без історії «провів аналіз → UI → бекенд → Excel».
4. closing — лише: «Буду радий поспілкуватися, детальніше розповісти про свій досвід та виконати тестове завдання.»
5. usedProjectTitle — точна title з кейс-банку.

ДОВЖИНА: як ідеальні листи. Ліміт у промпті — стеля, не ціль. Коротший лист кращий за роздутий.

ЗАБОРОНЕНО (звучить як AI):
- щиро, з ентузіазмом, особливо близький, команда мрії, до душі, прагнення, глибоке розуміння
- «Мене щиро зацікавила», «повністю відповідає», «саме той рівень технічних викликів»
- Full-Stack / «я фуллстек» / окремі абзаци frontend і backend
- ідемпотентність, high-load, масштабовані продукти — якщо цього немає в кейсі користувача як його формулювання
- «З повагою», Best regards, ім’я, підпис, контакти, markdown`;

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
  const ceiling = analysis.clCharLimit;
  return `Вакансія: ${analysis.jobTitle || "не вказано"}
Компанія: ${analysis.companyName || "не вказано"}
Рівень вакансії: ${analysis.jobLevel || "не вказано"}
Match: ${analysis.matchMin}–${analysis.matchMax}%

ДОВЖИНА: чотири поля разом — як ідеальні листи нижче. Стеля ${ceiling} символів. Не добивай ліміт «водою». Контакти не пиши.

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
   чому вдалий: ${clip(example.whyItWorks, 400)}
   текст:
${clip(example.body, 2500)}`;
    })
    .join("\n\n");
}
