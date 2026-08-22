"use client";

import { deleteProject, saveProject, type ActionState } from "@/app/actions/projects";
import { Button } from "@/components/ui/button";
import { Card, FormMessage } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/field";
import { useActionState, useState } from "react";

export type ProjectItem = {
  id: string;
  title: string;
  product: string;
  problem: string;
  contribution: string;
  stack: string[];
  result: string;
  tags: string[];
};

function ProjectForm({
  project,
  onCancel,
}: {
  project?: ProjectItem;
  onCancel?: () => void;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    saveProject,
    null,
  );

  return (
    <form action={action} className="flex flex-col gap-4">
      {project ? <input type="hidden" name="id" value={project.id} /> : null}
      <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2">
        <Field label="Назва кейса" htmlFor={`title-${project?.id ?? "new"}`}>
          <Input
            id={`title-${project?.id ?? "new"}`}
            name="title"
            required
            defaultValue={project?.title}
            placeholder="Адмінка замовлень для e-commerce"
          />
        </Field>
        <Field label="Продукт" htmlFor={`product-${project?.id ?? "new"}`}>
          <Input
            id={`product-${project?.id ?? "new"}`}
            name="product"
            defaultValue={project?.product}
            placeholder="SaaS / внутрішній інструмент / клієнтський сайт"
          />
        </Field>
      </div>
      <Field
        label="Яка була задача"
        htmlFor={`problem-${project?.id ?? "new"}`}
      >
        <Textarea
          id={`problem-${project?.id ?? "new"}`}
          name="problem"
          required
          rows={3}
          defaultValue={project?.problem}
        />
      </Field>
      <Field
        label="Що зробив ти"
        htmlFor={`contribution-${project?.id ?? "new"}`}
        hint="Конкретно, від першої особи. Це сировина для абзацу в CL."
      >
        <Textarea
          id={`contribution-${project?.id ?? "new"}`}
          name="contribution"
          required
          rows={4}
          defaultValue={project?.contribution}
        />
      </Field>
      <Field label="Стек" htmlFor={`stack-${project?.id ?? "new"}`} hint="Через кому">
        <Input
          id={`stack-${project?.id ?? "new"}`}
          name="stack"
          defaultValue={project?.stack.join(", ")}
          placeholder="Next.js, NestJS, PostgreSQL"
        />
      </Field>
      <Field label="Результат" htmlFor={`result-${project?.id ?? "new"}`}>
        <Textarea
          id={`result-${project?.id ?? "new"}`}
          name="result"
          rows={2}
          defaultValue={project?.result}
          placeholder="Що змінилось: швидкість, запуск, міграція, менше ручної роботи..."
        />
      </Field>
      <Field
        label="Теги"
        htmlFor={`tags-${project?.id ?? "new"}`}
        hint="greenfield, AI, performance, WordPress, architecture..."
      >
        <Input
          id={`tags-${project?.id ?? "new"}`}
          name="tags"
          defaultValue={project?.tags.join(", ")}
        />
      </Field>
      <FormMessage error={state?.error} ok={state?.ok} />
      <div className="flex gap-2">
        <Button disabled={pending}>{pending ? "Зберігаю…" : "Зберегти кейс"}</Button>
        {onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Скасувати
          </Button>
        ) : null}
      </div>
    </form>
  );
}

export function ProjectList({ projects }: { projects: ProjectItem[] }) {
  const [editingId, setEditingId] = useState<string | "new" | null>(
    projects.length === 0 ? "new" : null,
  );

  return (
    <div className="flex flex-col gap-4">
      {projects.map((project) => (
        <Card key={project.id}>
          {editingId === project.id ? (
            <ProjectForm project={project} onCancel={() => setEditingId(null)} />
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h2 className="text-xl font-semibold tracking-tight text-ink">{project.title}</h2>
                  {project.product ? (
                    <p className="mt-1 text-sm text-muted">{project.product}</p>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-1 sm:shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setEditingId(project.id)}
                  >
                    Редагувати
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => {
                      if (confirm("Видалити цей кейс?")) {
                        void deleteProject(project.id);
                      }
                    }}
                  >
                    Видалити
                  </Button>
                </div>
              </div>
              <p className="text-sm leading-6 text-foreground">{project.contribution}</p>
              {project.stack.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {project.stack.map((item, index) => (
                    <span
                    key={`${item}-${index}`}
                      className="rounded-full bg-[rgb(44_185_164_/_0.12)] px-2.5 py-0.5 text-xs font-medium text-ink"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </Card>
      ))}

      {editingId === "new" ? (
        <Card>
          <h2 className="mb-4 text-xl font-semibold tracking-tight text-ink">Новий кейс</h2>
          <ProjectForm onCancel={() => setEditingId(null)} />
        </Card>
      ) : (
        <Button type="button" variant="secondary" onClick={() => setEditingId("new")}>
          Додати проєкт
        </Button>
      )}
    </div>
  );
}
