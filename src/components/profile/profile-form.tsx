"use client";

import { uploadCv, saveProfile, type ActionState } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Card, FormMessage } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import {
  ENGLISH_LEVELS,
  LOCATIONS,
  TARGET_LEVELS,
  WORK_FORMATS,
} from "@/lib/profile-options";
import { useActionState } from "react";

type ProfileFields = {
  fullName: string;
  headline: string;
  yearsExperience: number | null;
  englishLevel: string;
  location: string;
  workFormat: string;
  targetLevel: string;
  linkedin: string;
  email: string;
  telegram: string;
  coreStack: string;
  avoidInCl: string | null;
  extraNotes: string | null;
  cvFileName: string | null;
  cvText: string | null;
};

export function ProfileForm({ profile }: { profile: ProfileFields }) {
  const [saveState, saveAction, saving] = useActionState<ActionState, FormData>(
    saveProfile,
    null,
  );
  const [uploadState, uploadAction, uploading] = useActionState<
    ActionState,
    FormData
  >(uploadCv, null);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <h2 className="text-xl font-semibold tracking-tight text-ink">Хто ти</h2>
        <p className="mt-1 text-sm text-muted">
          Ці поля — рамка для match: модель не має права малювати Senior, якщо ти
          ставиш Middle і 3 роки.
        </p>
        <form action={saveAction} className="mt-6 flex flex-col gap-6">
          <div className="grid items-end gap-x-4 gap-y-4 sm:grid-cols-6">
            <Field label="Ім'я" htmlFor="fullName" className="sm:col-span-3">
              <Input
                id="fullName"
                name="fullName"
                required
                autoComplete="name"
                defaultValue={profile.fullName}
                placeholder="Андрій"
              />
            </Field>
            <Field
              label="Позиціонування"
              htmlFor="headline"
              hint="Як себе називаєш у листі одним рядком"
              className="sm:col-span-3"
            >
              <Input
                id="headline"
                name="headline"
                defaultValue={profile.headline}
                placeholder="Full-Stack Developer"
              />
            </Field>
            <Field
              label="Роки комерційного досвіду"
              htmlFor="yearsExperience"
              className="sm:col-span-3"
            >
              <Input
                id="yearsExperience"
                name="yearsExperience"
                type="number"
                min="0"
                step="0.5"
                inputMode="decimal"
                defaultValue={profile.yearsExperience ?? ""}
                placeholder="3"
              />
            </Field>
            <Field
              label="Цільовий рівень"
              htmlFor="targetLevel"
              hint="Як себе подаємо, не як хочеться звучати"
              className="sm:col-span-3"
            >
              <Select
                id="targetLevel"
                name="targetLevel"
                defaultValue={profile.targetLevel}
                options={[...TARGET_LEVELS]}
                placeholder="Middle / Strong Middle"
              />
            </Field>
            <Field
              label="Англійська"
              htmlFor="englishLevel"
              className="sm:col-span-2"
            >
              <Select
                id="englishLevel"
                name="englishLevel"
                defaultValue={profile.englishLevel}
                options={[...ENGLISH_LEVELS]}
                placeholder="B1–B2"
              />
            </Field>
            <Field
              label="Формат роботи"
              htmlFor="workFormat"
              className="sm:col-span-2"
            >
              <Select
                id="workFormat"
                name="workFormat"
                defaultValue={profile.workFormat}
                options={[...WORK_FORMATS]}
                placeholder="Remote / Hybrid"
              />
            </Field>
            <Field label="Локація" htmlFor="location" className="sm:col-span-2">
              <Select
                id="location"
                name="location"
                defaultValue={profile.location}
                options={[...LOCATIONS]}
                placeholder="Україна / Warsaw"
              />
            </Field>
          </div>

          <div>
            <h2 className="text-xl font-semibold tracking-tight text-ink">Контакти для CL</h2>
            <p className="mt-1 text-sm text-muted">
              У лист підуть звичайним текстом, без гіперпосилань.
            </p>
            <div className="mt-4 grid items-end gap-x-4 gap-y-4 sm:grid-cols-3">
            <Field label="LinkedIn" htmlFor="linkedin">
              <Input
                id="linkedin"
                name="linkedin"
                defaultValue={profile.linkedin}
                placeholder="linkedin.com/in/username/"
              />
            </Field>
            <Field label="Email" htmlFor="email">
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={profile.email}
                placeholder="name@gmail.com"
              />
            </Field>
            <Field label="Telegram" htmlFor="telegram">
              <Input
                id="telegram"
                name="telegram"
                defaultValue={profile.telegram}
                placeholder="t.me/username"
              />
            </Field>
            </div>
          </div>

          <Field
            label="Підтверджений стек"
            htmlFor="coreStack"
            hint="Це база правди. Не пиши те, чого не було в проді."
          >
            <Textarea
              id="coreStack"
              name="coreStack"
              rows={5}
              defaultValue={profile.coreStack}
              placeholder="React, Next.js, TypeScript, NestJS, PostgreSQL, Prisma, Docker..."
            />
          </Field>

          <Field
            label="Текст CV"
            htmlFor="cvText"
            hint={
              profile.cvFileName
                ? `Останній файл: ${profile.cvFileName}. Можна правити витягнутий текст.`
                : "Завантаж файл нижче або встав текст сюди."
            }
          >
            <Textarea
              id="cvText"
              name="cvText"
              rows={12}
              defaultValue={profile.cvText ?? ""}
            />
          </Field>

          <Field
            label="Не згадувати в CL"
            htmlFor="avoidInCl"
            hint="Наприклад PHP, якщо не хочеш на WordPress-вакансії"
          >
            <Textarea
              id="avoidInCl"
              name="avoidInCl"
              rows={3}
              defaultValue={profile.avoidInCl ?? ""}
            />
          </Field>

          <Field label="Нотатки для аналізу" htmlFor="extraNotes">
            <Textarea
              id="extraNotes"
              name="extraNotes"
              rows={3}
              defaultValue={profile.extraNotes ?? ""}
              placeholder="Що ще варто знати моделі: релокація, нотіс, формат..."
            />
          </Field>

          <FormMessage error={saveState?.error} ok={saveState?.ok} />
          <div>
            <Button disabled={saving}>{saving ? "Зберігаю…" : "Зберегти профіль"}</Button>
          </div>
        </form>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold tracking-tight text-ink">Файл CV</h2>
        <p className="mt-1 text-sm text-muted">
          PDF, DOCX або TXT. Текст витягнеться сюди, щоб ти міг поправити кривий
          парсинг.
        </p>
        <form action={uploadAction} className="mt-5 flex flex-col gap-4">
          <Input name="cv" type="file" accept=".pdf,.docx,.txt,application/pdf" />
          <FormMessage error={uploadState?.error} ok={uploadState?.ok} />
          <div>
            <Button variant="secondary" disabled={uploading}>
              {uploading ? "Читаю файл…" : "Завантажити CV"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
