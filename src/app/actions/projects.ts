"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getProfile } from "@/lib/profile";
import { splitList } from "@/lib/utils";

export type ActionState = { error?: string; ok?: boolean } | null;

export async function saveProject(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const problem = String(formData.get("problem") ?? "").trim();
  const contribution = String(formData.get("contribution") ?? "").trim();

  if (!title || !problem || !contribution) {
    return { error: "Потрібні назва, задача і що зробив ти" };
  }

  const profile = await getProfile();

  const data = {
    title,
    product: String(formData.get("product") ?? "").trim(),
    problem,
    contribution,
    stack: splitList(String(formData.get("stack") ?? "")),
    result: String(formData.get("result") ?? "").trim(),
    tags: splitList(String(formData.get("tags") ?? "")),
  };

  if (id) {
    const existing = await prisma.project.findFirst({
      where: { id, profileId: profile.id },
    });
    if (!existing) {
      return { error: "Кейс не знайдено" };
    }
    await prisma.project.update({
      where: { id },
      data,
    });
  } else {
    const count = await prisma.project.count({
      where: { profileId: profile.id },
    });
    await prisma.project.create({
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

export async function deleteProject(id: string) {
  const profile = await getProfile();
  const existing = await prisma.project.findFirst({
    where: { id, profileId: profile.id },
  });
  if (!existing) return;
  await prisma.project.delete({ where: { id } });
  revalidatePath("/", "layout");
}
