import { ResultView } from "@/components/analyses/result-view";
import { buttonClassName } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { getProfile } from "@/lib/profile";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function AnalysisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await getProfile();
  const analysis = await prisma.analysis.findUnique({
    where: { id },
    include: { requirements: { orderBy: { sortOrder: "asc" } } },
  });

  if (
    !analysis ||
    analysis.profileId !== profile.id ||
    analysis.source === "manual"
  ) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title="Результат аналізу"
        description="Зелений — лише кружечок. Жовтий — коротке пояснення. Червоний — пояснення і що це за вимога."
        action={
          <Link href="/" className={buttonClassName("primary", "shrink-0")}>
            Новий аналіз
          </Link>
        }
      />
      <ResultView
        analysis={analysis}
        clMatchThreshold={profile.clMatchThreshold}
        clCharLimit={profile.clCharLimit}
        contacts={{
          linkedin: profile.linkedin,
          email: profile.email,
          telegram: profile.telegram,
        }}
      />
    </>
  );
}
