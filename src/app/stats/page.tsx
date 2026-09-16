import { ArchiveToggle } from "@/components/monitoring/period-controls";
import { ComparisonChart } from "@/components/stats/comparison-chart";
import { StatsTablePagination } from "@/components/stats/table-pagination";
import { Card, PageHeader } from "@/components/ui/card";
import { hrefWithArchive, parseArchiveFlag } from "@/lib/archive";
import { prisma } from "@/lib/db";
import { getProfile } from "@/lib/profile";
import {
  buildStatsView,
  paginateStatsRows,
  parseStatsPage,
  parseStatsPeriod,
  type StatsPeriod,
} from "@/lib/stats";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";

const PERIODS: Array<{ id: StatsPeriod; label: string }> = [
  { id: "day", label: "День" },
  { id: "week", label: "Тиждень" },
  { id: "month", label: "Місяць" },
];

function statsHref(period: StatsPeriod, page = 1, showArchive = false) {
  return hrefWithArchive("/stats", showArchive, {
    period: period === "day" ? undefined : period,
    page: page > 1 ? String(page) : undefined,
  });
}

export default async function StatsPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string; page?: string; archive?: string }>;
}) {
  const profile = await getProfile();
  const {
    period: periodRaw,
    page: pageRaw,
    archive: archiveRaw,
  } = await searchParams;
  const period = parseStatsPeriod(periodRaw);
  const showArchive = parseArchiveFlag(archiveRaw);
  const events = await prisma.analysis.findMany({
    where: {
      profileId: profile.id,
      ...(showArchive ? {} : { archivedAt: null }),
    },
    select: {
      createdAt: true,
      appliedAt: true,
      source: true,
      flowAt: true,
      rejectedAt: true,
      offerAt: true,
    },
  });
  const stats = buildStatsView(period, events);
  const requestedPage = parseStatsPage(pageRaw);
  const table = paginateStatsRows(stats.rows, requestedPage);
  if (requestedPage !== table.page) {
    redirect(statsHref(period, table.page, showArchive));
  }

  const currentLabel =
    period === "day" ? "сьогодні" : period === "week" ? "цей тиждень" : "цей місяць";

  return (
    <>
      <PageHeader
        title="Статистика"
        description={
          showArchive
            ? "Усі відрізки: аналізи, заявки та перенесення у Флоу, Відхилили й Офер. Дати — за київським часом."
            : "Поточний відрізок: аналізи, заявки та перенесення у Флоу, Відхилили й Офер. Дати — за київським часом."
        }
        action={
          <ArchiveToggle
            checked={showArchive}
            hrefOn={statsHref(period, 1, true)}
            hrefOff={statsHref(period, 1, false)}
          />
        }
      />
      <div className="flex flex-col gap-6">
        <div
          className="glass-card inline-flex w-full gap-1 p-1.5 sm:w-auto"
          role="tablist"
          aria-label="Період статистики"
        >
          {PERIODS.map((item) => {
            const active = item.id === period;
            const href = statsHref(item.id, 1, showArchive);
            return (
              <Link
                key={item.id}
                href={href}
                role="tab"
                aria-selected={active}
                className={cn(
                  "flex-1 rounded-[14px] px-4 py-2.5 text-center text-sm font-medium transition-colors duration-200 sm:flex-none",
                  active
                    ? "bg-accent text-white shadow-[0_8px_22px_rgb(44_185_164_/_0.32)]"
                    : "text-muted hover:bg-white/35 hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Card>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
              Аналізи · {currentLabel}
            </p>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-ink">
              {stats.current.analyses}
            </p>
          </Card>
          <Card>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
              Заявки · {currentLabel}
            </p>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-ink">
              {stats.current.applications}
            </p>
          </Card>
          <Card>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
              {showArchive ? "Усього в архіві й зараз" : "Усього за відрізок"}
            </p>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-ink">
              {stats.totals.analyses}
              <span className="ml-2 text-lg font-medium text-muted">
                / {stats.totals.applications} заявок
              </span>
            </p>
          </Card>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Card>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
              Флоу · {currentLabel}
            </p>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-ink">
              {stats.current.flow}
            </p>
            <p className="mt-2 text-sm text-muted">
              Усього {stats.totals.flow}
            </p>
          </Card>
          <Card>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
              Відхилили · {currentLabel}
            </p>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-ink">
              {stats.current.rejected}
            </p>
            <p className="mt-2 text-sm text-muted">
              Усього {stats.totals.rejected}
            </p>
          </Card>
          <Card>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
              Прийняті · {currentLabel}
            </p>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-ink">
              {stats.current.offers}
            </p>
            <p className="mt-2 text-sm text-muted">
              Усього {stats.totals.offers}
            </p>
          </Card>
        </div>

        {stats.rows.length > 1 && (
          <Card>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
              Порівняння {period === "day" ? "по днях" : period === "week" ? "по тижнях" : "по місяцях"}
            </p>
            <div className="mt-4">
              <ComparisonChart rows={stats.rows} period={period} />
            </div>
          </Card>
        )}

        <Card className="overflow-hidden p-0 sm:p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/30 text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
                  <th className="px-4 py-3.5 font-medium sm:px-6">Дата</th>
                  <th className="px-4 py-3.5 font-medium sm:px-6">Аналізів</th>
                  <th className="px-4 py-3.5 font-medium sm:px-6">Заявок</th>
                  <th className="px-4 py-3.5 font-medium sm:px-6">Флоу</th>
                  <th className="px-4 py-3.5 font-medium sm:px-6">Відхилили</th>
                  <th className="px-4 py-3.5 font-medium sm:px-6">Офер</th>
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row) => (
                  <tr
                    key={row.key}
                    className="border-b border-white/20 last:border-0"
                  >
                    <td className="px-4 py-3 capitalize text-ink sm:px-6">
                      {row.label}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-ink sm:px-6">
                      {row.analyses}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-ink sm:px-6">
                      {row.applications}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-ink sm:px-6">
                      {row.flow}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-ink sm:px-6">
                      {row.rejected}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-ink sm:px-6">
                      {row.offers}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <StatsTablePagination
            page={table.page}
            totalPages={table.totalPages}
            hrefForPage={(page) => statsHref(period, page, showArchive)}
          />
        </Card>
      </div>
    </>
  );
}
