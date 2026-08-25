import { HistoryList, PAGE_SIZE } from "@/components/analyses/history-list";
import { AnalyzeForm } from "@/components/analyze/analyze-form";
import { SetupGate } from "@/components/analyze/setup-gate";
import { Card, PageHeader } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { getProfile } from "@/lib/profile";
import { getSetupStatus } from "@/lib/setup";

export const maxDuration = 120;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const profile = await getProfile();
  const setup = getSetupStatus(profile);
  const { page: pageRaw } = await searchParams;
  const requestedPage = Math.max(1, Number.parseInt(pageRaw ?? "1", 10) || 1);

  const total = await prisma.analysis.count({
    where: { profileId: profile.id },
  });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);
  const analyses = await prisma.analysis.findMany({
    where: { profileId: profile.id },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    select: {
      id: true,
      companyName: true,
      jobTitle: true,
      matchMin: true,
      matchMax: true,
      recommendation: true,
    },
  });

  return (
    <>
      <PageHeader
        title="Новий аналіз"
        description="Встав текст вакансії. Сторінки не парсимо — так надійніше, ніж боротися з ботами LinkedIn."
      />
      <div className="flex flex-col gap-6">
        <SetupGate setup={setup} />
        <Card>
          <AnalyzeForm
            disabled={!setup.ready}
            clMatchThreshold={profile.clMatchThreshold}
            clCharLimit={profile.clCharLimit}
          />
        </Card>
        <HistoryList items={analyses} page={page} total={total} />
      </div>
    </>
  );
}
