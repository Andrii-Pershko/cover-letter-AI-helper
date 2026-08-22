import { AnalyzeForm } from "@/components/analyze/analyze-form";
import { SetupGate } from "@/components/analyze/setup-gate";
import { Card, PageHeader } from "@/components/ui/card";
import { getProfile } from "@/lib/profile";
import { getSetupStatus } from "@/lib/setup";
import { recommendationLabel } from "@/lib/utils";
import Link from "next/link";

export const maxDuration = 60;

export default async function HomePage() {
  const profile = await getProfile();
  const setup = getSetupStatus(profile);

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
        {profile.analyses.length > 0 ? (
          <section>
            <h2 className="mb-3 text-xl font-semibold tracking-tight text-ink">Історія</h2>
            <ul className="flex flex-col gap-2">
              {profile.analyses.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/analyses/${item.id}`}
                    className="glass-row flex items-center justify-between gap-4 rounded-[18px] px-4 py-3.5 transition-all duration-200 hover:-translate-y-px hover:bg-white/50"
                  >
                    <span>
                      <span className="block text-sm font-medium text-ink">
                        {item.companyName || item.jobTitle || "Вакансія"}
                      </span>
                      <span className="text-xs text-muted">
                        {item.jobTitle ? `${item.jobTitle} · ` : ""}
                        {recommendationLabel(item.recommendation)}
                      </span>
                    </span>
                    <span className="text-lg font-semibold tracking-tight text-ink">
                      {item.matchMin}–{item.matchMax}%
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </>
  );
}
