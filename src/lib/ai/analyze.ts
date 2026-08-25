import { prisma } from "@/lib/db";
import { shouldWriteCoverLetter } from "@/lib/cl-settings";
import { assembleCoverLetter } from "@/lib/utils";
import { generateJson } from "./generate-json";
import { getModelId } from "./provider";
import {
  buildCoverLetterPrompt,
  buildMatchPrompt,
  COVER_LETTER_SYSTEM,
  MATCH_SYSTEM,
} from "./prompts";
import { analysisSchema, coverLetterSchema } from "./schemas";
import type {
  ExampleCoverLetter,
  Profile,
  Project,
} from "@/generated/prisma/client";

type ProfilePayload = Profile & {
  projects: Project[];
  exampleLetters: ExampleCoverLetter[];
};

const MATCH_TIMEOUT_MS = 90_000;
const COVER_LETTER_TIMEOUT_MS = 45_000;

export async function runAnalysis(profile: ProfilePayload, jobText: string) {
  console.info("[ai]", { step: "start", model: getModelId() });

  const analysis = await generateJson("match", analysisSchema, {
    system: MATCH_SYSTEM,
    prompt: buildMatchPrompt(profile, jobText),
    maxOutputTokens: 2048,
    timeoutMs: MATCH_TIMEOUT_MS,
  });

  const matchMin = Math.min(analysis.matchMin, analysis.matchMax);
  const matchMax = Math.max(analysis.matchMin, analysis.matchMax);

  let coverLetter: string | null = null;
  let usedProjectTitle: string | null = null;

  if (shouldWriteCoverLetter(matchMin, matchMax, profile.clMatchThreshold)) {
    const letter = await generateJson("cover-letter", coverLetterSchema, {
      system: COVER_LETTER_SYSTEM,
      prompt: buildCoverLetterPrompt(profile, jobText, {
        companyName: analysis.companyName,
        jobTitle: analysis.jobTitle,
        jobLevel: analysis.jobLevel,
        matchMin,
        matchMax,
        clCharLimit: profile.clCharLimit,
      }),
      maxOutputTokens: 1024,
      timeoutMs: COVER_LETTER_TIMEOUT_MS,
      temperature: 0.5,
    });

    const knownTitles = new Set(profile.projects.map((project) => project.title));
    usedProjectTitle = knownTitles.has(letter.usedProjectTitle)
      ? letter.usedProjectTitle
      : profile.projects[0]?.title ?? letter.usedProjectTitle;

    coverLetter = assembleCoverLetter(letter, profile);
  }

  return prisma.analysis.create({
    data: {
      profileId: profile.id,
      companyName: analysis.companyName,
      jobTitle: analysis.jobTitle,
      jobLevel: analysis.jobLevel,
      jobText,
      matchMin,
      matchMax,
      recommendation: analysis.recommendation,
      gaps: analysis.gaps,
      coverLetter,
      usedProjectTitle,
      requirements: {
        create: analysis.requirements.map((requirement, index) => ({
          requirement: requirement.requirement,
          candidate: requirement.candidate,
          match: requirement.match,
          explanation: requirement.match === "green" ? null : requirement.explanation,
          techExplainer:
            requirement.match === "red" ? requirement.techExplainer : null,
          isMustHave: requirement.isMustHave,
          sortOrder: index,
        })),
      },
    },
  });
}
