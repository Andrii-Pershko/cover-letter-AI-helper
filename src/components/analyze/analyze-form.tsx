"use client";

import { analyzeJob, type AnalyzeState } from "@/app/actions/analyze";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/field";
import { AiOverlay } from "@/components/ui/ai-overlay";
import {
  CL_CHAR_LIMIT_MAX,
  CL_CHAR_LIMIT_MIN,
  CL_MATCH_THRESHOLD_MAX,
  CL_MATCH_THRESHOLD_MIN,
} from "@/lib/cl-settings";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, type KeyboardEvent } from "react";

export function AnalyzeForm({
  disabled,
  clMatchThreshold,
  clCharLimit,
}: {
  disabled: boolean;
  clMatchThreshold: number;
  clCharLimit: number;
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState<AnalyzeState, FormData>(
    analyzeJob,
    null,
  );

  useEffect(() => {
    if (state?.id) {
      router.replace(`/analyses/${state.id}`);
    }
  }, [router, state?.id]);

  const overlayOpen = pending || Boolean(state?.id);

  function onJobTextKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (
      event.key !== "Enter" ||
      event.shiftKey ||
      event.nativeEvent.isComposing
    ) {
      return;
    }
    event.preventDefault();
    if (disabled || overlayOpen) return;
    event.currentTarget.form?.requestSubmit();
  }

  return (
    <form action={action} className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-ink">Формування листа</h2>
        <p className="mt-1 text-sm text-muted">
          Коли писати cover letter і скільки в ньому має бути символів.
        </p>
        <div className="mt-4 grid items-end gap-x-4 gap-y-4 sm:grid-cols-2">
          <Field
            label="Поріг match"
            htmlFor="clMatchThreshold"
            hint="Лист, якщо середній % не нижчий за це"
          >
            <Input
              id="clMatchThreshold"
              name="clMatchThreshold"
              type="number"
              min={CL_MATCH_THRESHOLD_MIN}
              max={CL_MATCH_THRESHOLD_MAX}
              required
              disabled={disabled || overlayOpen}
              defaultValue={clMatchThreshold}
              placeholder="80"
            />
          </Field>
          <Field
            label="Довжина листа"
            htmlFor="clCharLimit"
            hint="Символи тіла листа, без контактів"
          >
            <Input
              id="clCharLimit"
              name="clCharLimit"
              type="number"
              min={CL_CHAR_LIMIT_MIN}
              max={CL_CHAR_LIMIT_MAX}
              step={50}
              required
              disabled={disabled || overlayOpen}
              defaultValue={clCharLimit}
              placeholder="1500"
            />
          </Field>
        </div>
      </div>

      <div>
        <Field
          label="Лінк на вакансію"
          htmlFor="jobUrl"
          hint="Необов'язково, зберігається для статистики й моніторингу"
        >
          <Input
            id="jobUrl"
            name="jobUrl"
            type="text"
            inputMode="url"
            autoComplete="url"
            disabled={disabled || overlayOpen}
            placeholder="https://djinni.co/jobs/..."
          />
        </Field>
        <Textarea
          name="jobText"
          required
          minLength={120}
          rows={16}
          disabled={disabled || overlayOpen}
          placeholder="Встав текст вакансії: компанія, рівень, обов'язки, must-have, nice-to-have..."
          onKeyDown={onJobTextKeyDown}
          className="mt-4"
        />
        <p className="mt-1.5 text-xs text-muted">
          Enter — проаналізувати, Shift+Enter — новий рядок
        </p>
      </div>
      <FormMessage error={state?.error} />
      <div>
        <Button disabled={disabled || overlayOpen}>
          {overlayOpen ? "Аналізую вакансію…" : "Проаналізувати"}
        </Button>
      </div>
      <AiOverlay open={overlayOpen} />
    </form>
  );
}
