"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getProfile } from "@/lib/profile";
import { isPipelineStatus, type PipelineStatus } from "@/lib/pipeline";

export type PipelineActionResult = { error?: string; ok?: boolean };

async function ownedAnalysis(id: string) {
  const profile = await getProfile();
  return prisma.analysis.findFirst({
    where: { id, profileId: profile.id },
    select: {
      id: true,
      appliedAt: true,
      pipelineStatus: true,
    },
  });
}

export async function markApplied(
  analysisId: string,
): Promise<PipelineActionResult> {
  const analysis = await ownedAnalysis(analysisId);
  if (!analysis) return { error: "Аналіз не знайдено" };

  const now = new Date();
  await prisma.analysis.update({
    where: { id: analysis.id },
    data: {
      appliedAt: analysis.appliedAt ?? now,
      pipelineStatus: analysis.pipelineStatus ?? "applied",
      pipelineUpdatedAt: now,
    },
  });

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function updatePipelineStatus(
  analysisId: string,
  status: PipelineStatus,
): Promise<PipelineActionResult> {
  if (!isPipelineStatus(status)) {
    return { error: "Невідомий статус" };
  }

  const analysis = await ownedAnalysis(analysisId);
  if (!analysis) return { error: "Вакансію не знайдено" };
  if (!analysis.pipelineStatus) {
    return { error: "Спочатку познач, що подався на вакансію" };
  }

  const now = new Date();
  await prisma.analysis.update({
    where: { id: analysis.id },
    data: {
      pipelineStatus: status,
      pipelineUpdatedAt: now,
      appliedAt: analysis.appliedAt ?? now,
    },
  });

  revalidatePath("/", "layout");
  return { ok: true };
}
