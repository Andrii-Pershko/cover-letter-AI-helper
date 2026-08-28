"use client";

import { markApplied, saveAnalysisJobUrl } from "@/app/actions/pipeline";
import { Button, buttonClassName } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";

export function ApplyPanel({
  analysisId,
  jobUrl,
  applied,
}: {
  analysisId: string;
  jobUrl: string | null;
  applied: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(applied);
  const [error, setError] = useState<string | null>(null);

  function jobUrlFromForm(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    return String(formData.get("jobUrl") ?? "");
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        const nextUrl = jobUrlFromForm(event);
        setError(null);
        startTransition(async () => {
          const result = done
            ? await saveAnalysisJobUrl(analysisId, nextUrl)
            : await markApplied(analysisId, nextUrl);
          if (result.error) {
            setError(result.error);
            return;
          }
          setDone(true);
          router.refresh();
        });
      }}
    >
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          Подача на вакансію
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Щоб не загубити вакансію, додайте на неї лінк.
        </p>
      </div>
      <Field label="Лінк на вакансію" htmlFor="applyJobUrl">
        <Input
          id="applyJobUrl"
          name="jobUrl"
          type="text"
          inputMode="url"
          autoComplete="url"
          defaultValue={jobUrl ?? ""}
          placeholder="https://djinni.co/jobs/..."
          disabled={pending}
        />
      </Field>
      <div className="flex flex-wrap items-center gap-2">
        {done ? (
          <Link href="/monitoring" className={buttonClassName("secondary")}>
            Подано
          </Link>
        ) : null}
        <Button type="submit" variant={done ? "secondary" : "primary"} disabled={pending}>
          {pending
            ? "Зберігаю…"
            : done
              ? "Зберегти лінк"
              : "Я подався на вакансію"}
        </Button>
      </div>
      {error ? (
        <p className="text-sm text-match-red">{error}</p>
      ) : null}
    </form>
  );
}
