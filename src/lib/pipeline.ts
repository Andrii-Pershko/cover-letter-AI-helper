export const PIPELINE_STATUSES = [
  "applied",
  "interview",
  "test",
  "rejected",
  "offer",
] as const;

export type PipelineStatus = (typeof PIPELINE_STATUSES)[number];

export const PIPELINE_COLUMNS: Array<{
  id: PipelineStatus;
  label: string;
}> = [
  { id: "applied", label: "Подався" },
  { id: "interview", label: "Співбесіда" },
  { id: "test", label: "Тестове" },
  { id: "rejected", label: "Відхилили" },
  { id: "offer", label: "Офер" },
];

export function isPipelineStatus(value: string): value is PipelineStatus {
  return PIPELINE_STATUSES.includes(value as PipelineStatus);
}

export type PipelineCard = {
  id: string;
  companyName: string | null;
  jobTitle: string | null;
  jobLevel: string | null;
  jobUrl: string | null;
  matchMin: number;
  matchMax: number;
  pipelineStatus: PipelineStatus;
  appliedAt: string | null;
};
