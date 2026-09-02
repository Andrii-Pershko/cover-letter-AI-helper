"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getProfile } from "@/lib/profile";
import { isPipelineStatus, type PipelineStatus } from "@/lib/pipeline";
import { normalizeJobUrl } from "@/lib/utils";

const MAX_COMPANY_NAME_LENGTH = 120;

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

function parsedJobUrl(
  raw: string,
): { error: string } | { jobUrl: string | undefined } {
  const trimmed = raw.trim();
  if (!trimmed) return { jobUrl: undefined };
  const jobUrl = normalizeJobUrl(trimmed);
  if (!jobUrl) {
    return { error: "Лінк на вакансію має бути коректним URL." };
  }
  return { jobUrl };
}

export async function markApplied(
  analysisId: string,
  jobUrlRaw = "",
): Promise<PipelineActionResult> {
  const analysis = await ownedAnalysis(analysisId);
  if (!analysis) return { error: "Аналіз не знайдено" };

  const parsed = parsedJobUrl(jobUrlRaw);
  if ("error" in parsed) return parsed;

  const now = new Date();
  await prisma.analysis.update({
    where: { id: analysis.id },
    data: {
      appliedAt: analysis.appliedAt ?? now,
      pipelineStatus: analysis.pipelineStatus ?? "applied",
      pipelineUpdatedAt: now,
      ...(parsed.jobUrl ? { jobUrl: parsed.jobUrl } : {}),
    },
  });

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function saveAnalysisJobUrl(
  analysisId: string,
  jobUrlRaw: string,
): Promise<PipelineActionResult> {
  const analysis = await ownedAnalysis(analysisId);
  if (!analysis) return { error: "Аналіз не знайдено" };

  const trimmed = jobUrlRaw.trim();
  if (!trimmed) return { error: "Додайте лінк на вакансію." };
  const jobUrl = normalizeJobUrl(trimmed);
  if (!jobUrl) {
    return { error: "Лінк на вакансію має бути коректним URL." };
  }

  await prisma.analysis.update({
    where: { id: analysis.id },
    data: { jobUrl },
  });

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function addManualApplication(
  companyNameRaw: string,
  jobUrlRaw: string,
): Promise<PipelineActionResult> {
  const profile = await getProfile();
  const companyName = companyNameRaw.trim();
  if (!companyName) {
    return { error: "Вкажи назву компанії." };
  }
  if (companyName.length > MAX_COMPANY_NAME_LENGTH) {
    return { error: "Назва компанії занадто довга." };
  }

  const trimmedUrl = jobUrlRaw.trim();
  if (!trimmedUrl) {
    return { error: "Додайте лінк на вакансію." };
  }
  const jobUrl = normalizeJobUrl(trimmedUrl);
  if (!jobUrl) {
    return { error: "Лінк на вакансію має бути коректним URL." };
  }

  const now = new Date();
  await prisma.analysis.create({
    data: {
      profileId: profile.id,
      companyName,
      jobUrl,
      jobText: "",
      matchMin: 0,
      matchMax: 0,
      recommendation: "manual",
      source: "manual",
      gaps: [],
      appliedAt: now,
      pipelineStatus: "applied",
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
