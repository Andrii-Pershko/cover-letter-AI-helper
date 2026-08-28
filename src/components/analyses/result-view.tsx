import { ApplyButton } from "@/components/analyses/apply-button";
import { CopyButton } from "@/components/analyses/copy-button";
import { buttonClassName } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { coverLetterProseLength } from "@/lib/cl-settings";
import { formatContacts, recommendationLabel, stripUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Analysis, AnalysisRequirement } from "@/generated/prisma/client";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

type Result = Analysis & { requirements: AnalysisRequirement[] };

const matchDot: Record<string, string> = {
  green: "bg-match-green shadow-[0_0_0_4px_rgb(42_138_100_/_0.16)]",
  yellow: "bg-match-yellow shadow-[0_0_0_4px_rgb(184_117_22_/_0.16)]",
  red: "bg-match-red shadow-[0_0_0_4px_rgb(194_74_66_/_0.16)]",
};

const recommendationBadge: Record<string, string> = {
  strong: "bg-[rgb(80_180_140_/_0.18)] text-match-green",
  try: "bg-[rgb(232_180_80_/_0.2)] text-match-yellow",
  weak: "bg-[rgb(220_120_110_/_0.18)] text-match-red",
};

export function ResultView({
  analysis,
  clMatchThreshold,
  clCharLimit,
  contacts,
}: {
  analysis: Result;
  clMatchThreshold: number;
  clCharLimit: number;
  contacts: { linkedin: string; email: string; telegram: string };
}) {
  const must = analysis.requirements.filter((item) => item.isMustHave);
  const nice = analysis.requirements.filter((item) => !item.isMustHave);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
          {[analysis.companyName, analysis.jobTitle, analysis.jobLevel]
            .filter(Boolean)
            .join(" · ") || "Вакансія"}
        </p>
        {analysis.jobUrl ? (
          <a
            href={analysis.jobUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex max-w-full items-center gap-1.5 text-sm text-accent transition-colors hover:text-accent-hover"
          >
            <ExternalLink className="size-3.5 shrink-0" aria-hidden />
            <span className="truncate">{stripUrl(analysis.jobUrl)}</span>
          </a>
        ) : null}
        <p className="mt-3 text-5xl font-semibold tracking-tight text-ink">
          {analysis.matchMin}–{analysis.matchMax}%
        </p>
        <p
          className={cn(
            "mt-3 inline-flex rounded-full px-3 py-1 text-sm font-medium",
            recommendationBadge[analysis.recommendation] ??
              "bg-white/40 text-muted",
          )}
        >
          {recommendationLabel(analysis.recommendation)}
        </p>
      </Card>

      <RequirementGroup title="Обов'язкові вимоги" items={must} />
      {nice.length > 0 ? (
        <RequirementGroup title="Буде перевагою" items={nice} muted />
      ) : null}

      {analysis.gaps.length > 0 ? (
        <Card>
          <h2 className="text-xl font-semibold tracking-tight text-ink">
            Основні прогалини
          </h2>
          <ul className="mt-3 flex flex-col gap-1.5 text-sm leading-6 text-ink">
            {analysis.gaps.map((gap) => (
              <li key={gap}>— {gap}</li>
            ))}
          </ul>
        </Card>
      ) : null}

      {analysis.coverLetter ? (
        <Card>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-ink">
                Cover letter
              </h2>
              {analysis.usedProjectTitle ? (
                <p className="mt-1 text-sm text-muted">
                  Кейс у листі: {analysis.usedProjectTitle}
                </p>
              ) : null}
              <p className="mt-1 text-sm text-muted">
                {coverLetterProseLength(
                  analysis.coverLetter ?? "",
                  formatContacts(contacts),
                )}{" "}
                / {clCharLimit} символів
              </p>
            </div>
            <CoverLetterActions analysis={analysis} />
          </div>
          <pre className="glass-row mt-4 whitespace-pre-wrap rounded-[16px] px-4 py-3 font-sans text-sm leading-7 text-ink">
            {analysis.coverLetter}
          </pre>
        </Card>
      ) : (
        <Card>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-ink">
                Cover letter
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                Лист не генерується, якщо середній match нижчий за{" "}
                {clMatchThreshold}% — щоб не відправляти слабку заявку з гарним
                текстом.
              </p>
            </div>
            <CoverLetterActions analysis={analysis} />
          </div>
        </Card>
      )}
    </div>
  );
}

function CoverLetterActions({ analysis }: { analysis: Result }) {
  return (
    <div className="flex flex-wrap gap-2 shrink-0">
      {analysis.coverLetter ? <CopyButton text={analysis.coverLetter} /> : null}
      <ApplyButton
        analysisId={analysis.id}
        applied={Boolean(analysis.pipelineStatus)}
      />
      <Link href="/" className={buttonClassName("primary")}>
        Новий аналіз
      </Link>
    </div>
  );
}

function RequirementGroup({
  title,
  items,
  muted = false,
}: {
  title: string;
  items: AnalysisRequirement[];
  muted?: boolean;
}) {
  if (items.length === 0) return null;

  return (
    <Card muted={muted}>
      <h2 className="text-xl font-semibold tracking-tight text-ink">{title}</h2>
      <ul className="mt-4 flex flex-col gap-4">
        {items.map((item) => (
          <li key={item.id} className="flex gap-3">
            <span
              className={cn(
                "mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full",
                matchDot[item.match] ?? "bg-muted",
              )}
              aria-label={item.match}
            />
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink">
                {item.requirement}
                <span className="ml-2 font-normal text-muted">
                  {item.candidate}
                </span>
              </p>
              {item.match !== "green" && item.explanation ? (
                <p className="mt-1 text-sm leading-6 text-muted">
                  {item.explanation}
                </p>
              ) : null}
              {item.match === "red" && item.techExplainer ? (
                <p className="mt-1 text-sm leading-6 text-ink/80">
                  {item.techExplainer}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
