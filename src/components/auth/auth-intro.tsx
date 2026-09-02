import { Card } from "@/components/ui/card";

const STEPS = [
  "Заповни профіль: хто ти, роки досвіду, стек, CV і контакти для листа.",
  "Додай щонайменше два кейси. У cover letter піде один, підібраний під вакансію.",
  "Напиши два ідеальні листи як еталон тону — не для копіпасти речень.",
  "Встав текст вакансії. Отримаєш чесний match і, якщо він високий, лист українською.",
];

export function AuthIntro() {
  return (
    <Card muted className="h-fit">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
        Що це
      </p>
      <p className="mt-2 text-sm leading-6 text-ink sm:text-[15px]">
        AI-CL — персональний інструмент для відгуків. Готуєш профіль один раз,
        вставляєш текст вакансії й отримуєш чесний match. Якщо він високий —
        cover letter українською в твоєму тоні.
      </p>
      <p className="mt-3 text-sm leading-6 text-muted">
        Це не чат і не скрейпер. Сторінки LinkedIn чи Djinni не відкриваємо —
        лише текст, який ти вставив.
      </p>

      <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
        Як користуватися
      </p>
      <ol className="mt-3 flex flex-col gap-2.5">
        {STEPS.map((step, index) => (
          <li key={step} className="flex gap-3">
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-semibold tabular-nums text-accent">
              {index + 1}
            </span>
            <p className="text-sm leading-6 text-ink">{step}</p>
          </li>
        ))}
      </ol>
    </Card>
  );
}
