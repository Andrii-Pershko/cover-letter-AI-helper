import { prisma } from "@/lib/db";

export const HISTORY_PAGE_SIZE = 5;

export type AnalysisHistoryItem = {
  id: string;
  companyName: string | null;
  jobTitle: string | null;
  matchMin: number;
  matchMax: number;
  recommendation: string;
};

export type AnalysisHistoryPage = {
  items: AnalysisHistoryItem[];
  page: number;
  total: number;
};

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
