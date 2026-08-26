"use server";

import {
  getAnalysisHistoryPage,
  type AnalysisHistoryPage,
} from "@/lib/analysis-history";
import { requireSession } from "@/lib/auth/require-session";
import { prisma } from "@/lib/db";

export async function getAnalysisHistory(
  requestedPage: number,
): Promise<AnalysisHistoryPage> {
  const session = await requireSession();
  const profile = await prisma.profile.findUnique({
    where: { userId: session.userId },
    select: { id: true },
  });
  if (!profile) {
    return { items: [], page: 1, total: 0 };
  }
  return getAnalysisHistoryPage(profile.id, requestedPage);
}
