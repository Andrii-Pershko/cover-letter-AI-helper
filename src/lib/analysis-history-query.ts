import {
  HISTORY_PAGE_SIZE,
  type AnalysisHistoryPage,
} from "@/lib/analysis-history";
import { prisma } from "@/lib/db";

export async function getAnalysisHistoryPage(
  profileId: string,
  requestedPage: number,
): Promise<AnalysisHistoryPage> {
  const total = await prisma.analysis.count({
    where: { profileId },
  });
  const totalPages = Math.max(1, Math.ceil(total / HISTORY_PAGE_SIZE));
  const page = Math.min(Math.max(1, requestedPage), totalPages);
  const items = await prisma.analysis.findMany({
    where: { profileId },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * HISTORY_PAGE_SIZE,
    take: HISTORY_PAGE_SIZE,
    select: {
      id: true,
      companyName: true,
      jobTitle: true,
      matchMin: true,
      matchMax: true,
      recommendation: true,
    },
  });
  return { items, page, total };
}
