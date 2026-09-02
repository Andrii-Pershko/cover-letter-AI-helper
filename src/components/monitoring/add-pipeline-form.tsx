"use client";

import { addManualApplication } from "@/app/actions/pipeline";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";

export function AddPipelineForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const companyName = String(data.get("companyName") ?? "");
    const jobUrl = String(data.get("jobUrl") ?? "");
    setError(null);
    startTransition(async () => {
      const result = await addManualApplication(companyName, jobUrl);
      if (result.error) {
        setError(result.error);
        return;
      }
      form.reset();
      router.refresh();
    });
  }

  return (
    <section className="glass-card p-4 sm:p-5">
      <form
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
        onSubmit={onSubmit}
      >
        <Field label="Компанія" htmlFor="pipelineCompany" className="sm:flex-1">
          <Input
            id="pipelineCompany"
            name="companyName"
            required
            maxLength={120}
            placeholder="Devart"
            disabled={pending}
            autoComplete="organization"
          />
        </Field>
        <Field
          label="Посилання на вакансію"
          htmlFor="pipelineJobUrl"
          className="sm:flex-[1.4]"
        >
          <Input
            id="pipelineJobUrl"
            name="jobUrl"
            type="text"
            inputMode="url"
            autoComplete="url"
            required
            placeholder="https://djinni.co/jobs/..."
            disabled={pending}
          />
        </Field>
        <Button
          type="submit"
          disabled={pending}
          className="h-11 w-full shrink-0 sm:w-auto"
        >
          <span className="inline-grid justify-items-center">
            <span
              className={cn(
                "col-start-1 row-start-1",
                pending && "invisible",
              )}
            >
              Додати в подані
            </span>
            <span
              className={cn(
                "col-start-1 row-start-1",
                !pending && "invisible",
              )}
            >
              Додаю…
            </span>
          </span>
        </Button>
      </form>
      <div className="mt-3 min-h-10">
        {error ? (
          <p className="text-sm text-match-red">{error}</p>
        ) : (
          <p className="text-xs leading-5 text-muted">
            Картка зʼявиться в колонці «Подався». Далі її можна перетягнути в
            інший статус.
          </p>
        )}
      </div>
    </section>
  );
}
