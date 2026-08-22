import { ProjectList } from "@/components/projects/project-list";
import { PageHeader } from "@/components/ui/card";
import { getProfile } from "@/lib/profile";

export default async function ProjectsPage() {
  const profile = await getProfile();

  return (
    <>
      <PageHeader
        title="Проєкти"
        description="Мінімум два кейси. Для кожної вакансії в cover letter піде один, підібраний під продукт і задачі — не той самий абзац на всі відгуки."
      />
      <ProjectList
        projects={profile.projects.map((project) => ({
          id: project.id,
          title: project.title,
          product: project.product,
          problem: project.problem,
          contribution: project.contribution,
          stack: project.stack,
          result: project.result,
          tags: project.tags,
        }))}
      />
    </>
  );
}
