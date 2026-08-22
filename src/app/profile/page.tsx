import { ProfileForm } from "@/components/profile/profile-form";
import { PageHeader } from "@/components/ui/card";
import { getProfile } from "@/lib/profile";

export default async function ProfilePage() {
  const profile = await getProfile();

  return (
    <>
      <PageHeader
        title="Профіль"
        description="CV, стек, роки досвіду і контакти. Це рамка правди: модель не має права домальовувати те, чого тут немає."
      />
      <ProfileForm
        profile={{
          fullName: profile.fullName,
          headline: profile.headline,
          yearsExperience: profile.yearsExperience,
          englishLevel: profile.englishLevel,
          location: profile.location,
          workFormat: profile.workFormat,
          targetLevel: profile.targetLevel,
          linkedin: profile.linkedin,
          email: profile.email,
          telegram: profile.telegram,
          coreStack: profile.coreStack,
          avoidInCl: profile.avoidInCl,
          extraNotes: profile.extraNotes,
          cvFileName: profile.cvFileName,
          cvText: profile.cvText,
        }}
      />
    </>
  );
}
