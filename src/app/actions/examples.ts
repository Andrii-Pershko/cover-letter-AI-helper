"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getProfile } from "@/lib/profile";

export type ActionState = { error?: string; ok?: boolean } | null;

export async function saveExample(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const whyItWorks = String(formData.get("whyItWorks") ?? "").trim();

  if (!title || !body || !whyItWorks) {
    return { error: "Потрібні назва, «чому вдалий» і повний текст листа" };
  }

  const profile = await getProfile();

  const data = {
    title,
    company: String(formData.get("company") ?? "").trim(),
    role: String(formData.get("role") ?? "").trim(),
    whyItWorks,
    body,
  };

  if (id) {
    const existing = await prisma.exampleCoverLetter.findFirst({
      where: { id, profileId: profile.id },
    });
    if (!existing) {
      return { error: "Лист не знайдено" };
    }
    await prisma.exampleCoverLetter.update({ where: { id }, data });
  } else {
    const count = await prisma.exampleCoverLetter.count({
      where: { profileId: profile.id },
    });
    await prisma.exampleCoverLetter.create({
      data: {
        ...data,
        profileId: profile.id,
        sortOrder: count,
      },
    });
  }

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deleteExample(id: string) {
  const profile = await getProfile();
  const existing = await prisma.exampleCoverLetter.findFirst({
    where: { id, profileId: profile.id },
  });
  if (!existing) return;
  await prisma.exampleCoverLetter.delete({ where: { id } });
  revalidatePath("/", "layout");
}
