"use client";

import { deleteExample, saveExample, type ActionState } from "@/app/actions/examples";
import { Button } from "@/components/ui/button";
import { Card, FormMessage } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/field";
import { useActionState, useState } from "react";

export type ExampleItem = {
  id: string;
  title: string;
  company: string;
  role: string;
  whyItWorks: string;
  body: string;
};

function ExampleForm({
  example,
  onCancel,
}: {
  example?: ExampleItem;
  onCancel?: () => void;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    saveExample,
    null,
  );

  return (
    <form action={action} className="flex flex-col gap-4">
      {example ? <input type="hidden" name="id" value={example.id} /> : null}
      <Field
        label="Назва для себе"
        htmlFor={`title-${example?.id ?? "new"}`}
        hint="Наприклад: «продуктова компанія, greenfield»"
      >
        <Input
          id={`title-${example?.id ?? "new"}`}
          name="title"
          required
          defaultValue={example?.title}
        />
      </Field>
      <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2">
        <Field label="Компанія / продукт" htmlFor={`company-${example?.id ?? "new"}`}>
          <Input
            id={`company-${example?.id ?? "new"}`}
            name="company"
            defaultValue={example?.company}
          />
        </Field>
        <Field label="Роль / вакансія" htmlFor={`role-${example?.id ?? "new"}`}>
          <Input
            id={`role-${example?.id ?? "new"}`}
            name="role"
            defaultValue={example?.role}
          />
        </Field>
      </div>
      <Field
        label="Чому цей лист вдалий"
        htmlFor={`why-${example?.id ?? "new"}`}
        hint="Що копіювати: тон, довжина, як заходиш у кейс, як згадуєш продукт. Не «просто хороший лист»."
      >
        <Textarea
          id={`why-${example?.id ?? "new"}`}
          name="whyItWorks"
          required
          rows={3}
          defaultValue={example?.whyItWorks}
        />
      </Field>
      <Field
        label="Повний текст листа"
        htmlFor={`body-${example?.id ?? "new"}`}
        hint="Встав свій реальний або ідеальний CL. Модель візьме стиль, не речення."
      >
        <Textarea
          id={`body-${example?.id ?? "new"}`}
          name="body"
          required
          rows={14}
          defaultValue={example?.body}
        />
      </Field>
      <FormMessage error={state?.error} ok={state?.ok} />
      <div className="flex gap-2">
        <Button disabled={pending}>{pending ? "Зберігаю…" : "Зберегти лист"}</Button>
        {onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Скасувати
          </Button>
        ) : null}
      </div>
    </form>
  );
}

export function ExampleList({ examples }: { examples: ExampleItem[] }) {
  const [editingId, setEditingId] = useState<string | "new" | null>(
    examples.length === 0 ? "new" : null,
  );

  return (
    <div className="flex flex-col gap-4">
      {examples.map((example) => (
        <Card key={example.id}>
          {editingId === example.id ? (
            <ExampleForm example={example} onCancel={() => setEditingId(null)} />
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h2 className="text-xl font-semibold tracking-tight text-ink">{example.title}</h2>
                  <p className="mt-1 text-sm text-muted">
                    {[example.company, example.role].filter(Boolean).join(" · ") ||
                      "Без прив’язки до компанії"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1 sm:shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setEditingId(example.id)}
                  >
                    Редагувати
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => {
                      if (confirm("Видалити цей еталонний лист?")) {
                        void deleteExample(example.id);
                      }
                    }}
                  >
                    Видалити
                  </Button>
                </div>
              </div>
              <p className="text-sm leading-6 text-muted">{example.whyItWorks}</p>
              <pre className="glass-row whitespace-pre-wrap rounded-[16px] px-4 py-3 font-sans text-sm leading-6 text-ink">
                {example.body}
              </pre>
            </div>
          )}
        </Card>
      ))}

      {editingId === "new" ? (
        <Card>
          <h2 className="mb-4 text-xl font-semibold tracking-tight text-ink">Новий еталонний лист</h2>
          <ExampleForm onCancel={() => setEditingId(null)} />
        </Card>
      ) : (
        <Button type="button" variant="secondary" onClick={() => setEditingId("new")}>
          Додати ідеальний CL
        </Button>
      )}
    </div>
  );
}
