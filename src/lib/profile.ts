import { prisma } from "./db";
import { requireSession } from "./auth/require-session";

export async function getProfile() {
  const session = await requireSession();
  const include = {
    projects: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
    exampleLetters: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
    analyses: {
      where: { source: { not: "manual" } },
      orderBy: { createdAt: "desc" },
      take: 12,
      select: {
        id: true,
        companyName: true,
        jobTitle: true,
        matchMin: true,
        matchMax: true,
        recommendation: true,
        createdAt: true,
        coverLetter: true,
      },
    },
  } satisfies Parameters<typeof prisma.profile.findUnique>[0]["include"];

  const existing = await prisma.profile.findUnique({
    where: { userId: session.userId },
    include,
  });
  if (existing) return existing;

  return prisma.profile.create({
    data: { userId: session.userId },
    include,
  });
}

export async function getProfileForAnalysis() {
  const session = await requireSession();
  const include = {
    projects: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
    exampleLetters: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
  } satisfies Parameters<typeof prisma.profile.findUnique>[0]["include"];

  const existing = await prisma.profile.findUnique({
    where: { userId: session.userId },
    include,
  });
  if (existing) return existing;

  return prisma.profile.create({
    data: { userId: session.userId },
    include,
  });
}
