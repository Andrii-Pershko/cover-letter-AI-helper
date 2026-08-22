import { generateObject } from "ai";
import { prisma } from "@/lib/db";
import { shouldWriteCoverLetter } from "@/lib/cl-settings";
import { assembleCoverLetter } from "@/lib/utils";
import { getModel } from "./provider";
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

export async function runAnalysis(profile: ProfilePayload, jobText: string) {
  const model = getModel();

  const { object: analysis } = await generateObject({
    model,
    schema: analysisSchema,
    system: MATCH_SYSTEM,
    prompt: buildMatchPrompt(profile, jobText),
  });

  const matchMin = Math.min(analysis.matchMin, analysis.matchMax);
  const matchMax = Math.max(analysis.matchMin, analysis.matchMax);

  let coverLetter: string | null = null;
  let usedProjectTitle: string | null = null;

  if (shouldWriteCoverLetter(matchMin, matchMax, profile.clMatchThreshold)) {
    const { object: letter } = await generateObject({
      model,
      schema: coverLetterSchema,
      system: COVER_LETTER_SYSTEM,
      prompt: buildCoverLetterPrompt(profile, jobText, {
        companyName: analysis.companyName,
        jobTitle: analysis.jobTitle,
        jobLevel: analysis.jobLevel,
        matchMin,
        matchMax,
        clCharLimit: profile.clCharLimit,
      }),
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
