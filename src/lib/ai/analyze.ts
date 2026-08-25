import { generateObject } from "ai";
import { prisma } from "@/lib/db";
import { shouldWriteCoverLetter } from "@/lib/cl-settings";
import { assembleCoverLetter } from "@/lib/utils";
import { getGoogleProviderOptions, getModel, getModelId } from "./provider";
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

const ANALYSIS_TIMEOUT_MS = 55_000;

async function timedGenerateObject<
  T extends {
    usage?: {
      inputTokens?: number;
      outputTokens?: number;
      reasoningTokens?: number;
    };
  },
>(step: string, run: () => Promise<T>): Promise<T> {
  const started = Date.now();
  const result = await run();
  console.info("[ai]", {
    step,
    model: getModelId(),
    ms: Date.now() - started,
    inputTokens: result.usage?.inputTokens,
    outputTokens: result.usage?.outputTokens,
    reasoningTokens: result.usage?.reasoningTokens,
  });
  return result;
}

export async function runAnalysis(profile: ProfilePayload, jobText: string) {
  const model = getModel();
  const providerOptions = getGoogleProviderOptions();
  const abortSignal = AbortSignal.timeout(ANALYSIS_TIMEOUT_MS);

  console.info("[ai]", { step: "start", model: getModelId() });

  const { object: analysis } = await timedGenerateObject("match", () =>
    generateObject({
      model,
      schema: analysisSchema,
      system: MATCH_SYSTEM,
      prompt: buildMatchPrompt(profile, jobText),
      maxOutputTokens: 8192,
      maxRetries: 1,
      abortSignal,
      providerOptions,
    }),
  );

  const matchMin = Math.min(analysis.matchMin, analysis.matchMax);
  const matchMax = Math.max(analysis.matchMin, analysis.matchMax);

  let coverLetter: string | null = null;
  let usedProjectTitle: string | null = null;

  if (shouldWriteCoverLetter(matchMin, matchMax, profile.clMatchThreshold)) {
    const { object: letter } = await timedGenerateObject("cover-letter", () =>
      generateObject({
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
        maxOutputTokens: 4096,
        maxRetries: 1,
        abortSignal,
        providerOptions,
      }),
    );

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
