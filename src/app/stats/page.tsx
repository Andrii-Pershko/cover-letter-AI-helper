import { Card, PageHeader } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { getProfile } from "@/lib/profile";
import {
  buildStatsView,
  parseStatsPeriod,
  type StatsPeriod,
} from "@/lib/stats";
import { cn } from "@/lib/utils";
import Link from "next/link";

const PERIODS: Array<{ id: StatsPeriod; label: string }> = [
  { id: "day", label: "День" },
  { id: "week", label: "Тиждень" },
  { id: "month", label: "Місяць" },
];

export default async function StatsPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const profile = await getProfile();
  const { period: periodRaw } = await searchParams;
  const period = parseStatsPeriod(periodRaw);
  const events = await prisma.analysis.findMany({
    where: { profileId: profile.id },
    select: { createdAt: true, appliedAt: true },
  });
  const stats = buildStatsView(period, events);

  const currentLabel =
    period === "day" ? "сьогодні" : period === "week" ? "цей тиждень" : "цей місяць";

  return (
    <>
      <PageHeader
        title="Статистика"
        description="Скільки аналізів зроблено і скільки заявок подано. Дати — за київським часом."
      />
      <div className="flex flex-col gap-6">
        <div
          className="glass-card inline-flex w-full gap-1 p-1.5 sm:w-auto"
          role="tablist"
          aria-label="Період статистики"
        >
          {PERIODS.map((item) => {
            const active = item.id === period;
            const href = item.id === "day" ? "/stats" : `/stats?period=${item.id}`;
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
              Усього
            </p>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-ink">
              {stats.totals.analyses}
              <span className="ml-2 text-lg font-medium text-muted">
                / {stats.totals.applications} заявок
              </span>
            </p>
          </Card>
        </div>

        <Card className="overflow-hidden p-0 sm:p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/30 text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
                  <th className="px-4 py-3.5 font-medium sm:px-6">Дата</th>
                  <th className="px-4 py-3.5 font-medium sm:px-6">Аналізів</th>
                  <th className="px-4 py-3.5 font-medium sm:px-6">
                    Поданих заявок
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.rows.map((row) => (
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}
