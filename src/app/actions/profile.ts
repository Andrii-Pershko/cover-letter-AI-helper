"use server";

import { revalidatePath } from "next/cache";
import { parseCvFile } from "@/lib/cv/parse";
import { prisma } from "@/lib/db";
import { getProfile } from "@/lib/profile";

export type ActionState = { error?: string; ok?: boolean } | null;

export async function saveProfile(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const yearsRaw = String(formData.get("yearsExperience") ?? "").trim();
  const yearsExperience = yearsRaw === "" ? null : Number(yearsRaw);

  if (yearsRaw !== "" && Number.isNaN(yearsExperience)) {
    return { error: "Роки досвіду мають бути числом" };
  }

  const profile = await getProfile();

  await prisma.profile.update({
    where: { id: profile.id },
    data: {
      fullName: String(formData.get("fullName") ?? "").trim(),
      headline: String(formData.get("headline") ?? "").trim(),
      yearsExperience,
      englishLevel: String(formData.get("englishLevel") ?? "").trim(),
      location: String(formData.get("location") ?? "").trim(),
      workFormat: String(formData.get("workFormat") ?? "").trim(),
      targetLevel: String(formData.get("targetLevel") ?? "").trim(),
      linkedin: String(formData.get("linkedin") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      telegram: String(formData.get("telegram") ?? "").trim(),
      coreStack: String(formData.get("coreStack") ?? "").trim(),
      avoidInCl: String(formData.get("avoidInCl") ?? "").trim() || null,
      extraNotes: String(formData.get("extraNotes") ?? "").trim() || null,
      cvText: String(formData.get("cvText") ?? "").trim() || null,
    },
  });

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function uploadCv(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const file = formData.get("cv");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Обери файл CV" };
  }

  try {
    const parsed = await parseCvFile(file);
    if (!parsed.text) {
      return { error: "Не вдалося витягнути текст. Встав CV вручну." };
    }

    const profile = await getProfile();
    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        cvFileName: parsed.fileName,
        cvMimeType: parsed.mimeType,
        cvText: parsed.text,
      },
    });
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Не вдалося прочитати CV",
    };
  }
}
