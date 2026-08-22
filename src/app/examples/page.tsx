import { ExampleList } from "@/components/examples/example-list";
import { PageHeader } from "@/components/ui/card";
import { getProfile } from "@/lib/profile";

export default async function ExamplesPage() {
  const profile = await getProfile();

  return (
    <>
      <PageHeader
        title="Ідеальні cover letter"
        description="Обов'язково додай мінімум два листи, які тобі справді подобаються — краще ті, після яких кликали. Це еталон тону й довжини, не банк речень для копіпасти. Для нової вакансії модель напише інший текст у твоєму стилі."
      />
      <ExampleList
        examples={profile.exampleLetters.map((example) => ({
          id: example.id,
          title: example.title,
          company: example.company,
          role: example.role,
          whyItWorks: example.whyItWorks,
          body: example.body,
        }))}
      />
    </>
  );
}
