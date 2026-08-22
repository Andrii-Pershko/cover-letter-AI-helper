import type {
  ExampleCoverLetter,
  Profile,
  Project,
} from "@/generated/prisma/client";

export type SetupItem = {
  href: string;
  label: string;
};

export type SetupStatus = {
  ready: boolean;
  missing: SetupItem[];
  projectCount: number;
  exampleCount: number;
};

type SetupInput = Profile & {
  projects: Project[];
  exampleLetters: ExampleCoverLetter[];
};

export function getSetupStatus(profile: SetupInput): SetupStatus {
  const missing: SetupItem[] = [];

  if (!profile.fullName.trim()) {
    missing.push({ href: "/profile", label: "ім'я" });
  }
  if (profile.yearsExperience == null) {
    missing.push({ href: "/profile", label: "роки комерційного досвіду" });
  }
  if (!profile.coreStack.trim()) {
    missing.push({ href: "/profile", label: "підтверджений стек" });
  }
  if (!profile.cvText?.trim()) {
    missing.push({ href: "/profile", label: "текст CV" });
  }
  if (!profile.email.trim() || !profile.linkedin.trim() || !profile.telegram.trim()) {
    missing.push({
      href: "/profile",
      label: "контакти для CL (LinkedIn, email, Telegram)",
    });
  }
  if (profile.projects.length < 2) {
    missing.push({
      href: "/projects",
      label: `успішні проєкти (${profile.projects.length}/2)`,
    });
  }
  if (profile.exampleLetters.length < 2) {
    missing.push({
      href: "/examples",
      label: `ідеальні cover letter (${profile.exampleLetters.length}/2)`,
    });
  }

  return {
    ready: missing.length === 0,
    missing,
    projectCount: profile.projects.length,
    exampleCount: profile.exampleLetters.length,
  };
}
