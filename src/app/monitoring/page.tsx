import { AddPipelineForm } from "@/components/monitoring/add-pipeline-form";
import { KanbanBoard } from "@/components/monitoring/kanban-board";
import {
  ArchiveToggle,
  StartNewMonitoringButton,
} from "@/components/monitoring/period-controls";
import { PageHeader } from "@/components/ui/card";
import { hrefWithArchive, parseArchiveFlag } from "@/lib/archive";
import { prisma } from "@/lib/db";
import {
  isPipelineSource,
  isPipelineStatus,
  type PipelineCard,
} from "@/lib/pipeline";
import { getProfile } from "@/lib/profile";

export default async function MonitoringPage({
  searchParams,
}: {
  searchParams: Promise<{ archive?: string }>;
}) {
  const profile = await getProfile();
  const { archive: archiveRaw } = await searchParams;
  const showArchive = parseArchiveFlag(archiveRaw);
  const [rows, currentCount] = await Promise.all([
    prisma.analysis.findMany({
      where: {
        profileId: profile.id,
        pipelineStatus: { not: null },
        ...(showArchive ? {} : { archivedAt: null }),
      },
      orderBy: [
        { pipelineUpdatedAt: { sort: "desc", nulls: "last" } },
        { appliedAt: { sort: "desc", nulls: "last" } },
      ],
      select: {
        id: true,
        companyName: true,
        jobTitle: true,
        jobLevel: true,
        jobUrl: true,
        matchMin: true,
        matchMax: true,
        pipelineStatus: true,
        appliedAt: true,
        source: true,
        archivedAt: true,
      },
    }),
    prisma.analysis.count({
      where: { profileId: profile.id, archivedAt: null },
    }),
  ]);

  const items: PipelineCard[] = rows.flatMap((row) => {
    if (!row.pipelineStatus || !isPipelineStatus(row.pipelineStatus)) {
      return [];
    }
    return [
      {
        id: row.id,
        companyName: row.companyName,
        jobTitle: row.jobTitle,
        jobLevel: row.jobLevel,
        jobUrl: row.jobUrl,
        matchMin: row.matchMin,
        matchMax: row.matchMax,
        pipelineStatus: row.pipelineStatus,
        appliedAt: row.appliedAt?.toISOString() ?? null,
        source: isPipelineSource(row.source) ? row.source : "analysis",
        archived: Boolean(row.archivedAt),
      },
    ];
  });

  return (
    <>
      <PageHeader
        title="Моніторинг"
        description="Вакансії, на які ти вже відгукнувся. Новий моніторинг архівує поточну дошку й починає новий відрізок статистики."
        action={
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:items-end">
            <ArchiveToggle
              checked={showArchive}
              hrefOn={hrefWithArchive("/monitoring", true)}
              hrefOff={hrefWithArchive("/monitoring", false)}
            />
            <StartNewMonitoringButton disabled={currentCount === 0} />
          </div>
        }
      />
      <div className="flex flex-col gap-4">
        <AddPipelineForm />
        <KanbanBoard items={items} showArchive={showArchive} />
      </div>
    </>
  );
}
