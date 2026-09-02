import { AddPipelineForm } from "@/components/monitoring/add-pipeline-form";
import { KanbanBoard } from "@/components/monitoring/kanban-board";
import { PageHeader } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import {
  isPipelineSource,
  isPipelineStatus,
  type PipelineCard,
} from "@/lib/pipeline";
import { getProfile } from "@/lib/profile";

export default async function MonitoringPage() {
  const profile = await getProfile();
  const rows = await prisma.analysis.findMany({
    where: {
      profileId: profile.id,
      pipelineStatus: { not: null },
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
    },
  });

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
      },
    ];
  });

  return (
    <>
      <PageHeader
        title="Моніторинг"
        description="Вакансії, на які ти вже відгукнувся. Додай компанію з лінком або перетягни картку, коли зміниться статус."
      />
      <div className="flex flex-col gap-4">
        <AddPipelineForm />
        <KanbanBoard items={items} />
      </div>
    </>
  );
}
