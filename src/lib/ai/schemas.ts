import { z } from "zod";

export const analysisSchema = z.object({
  companyName: z.string().nullable(),
  jobTitle: z.string().nullable(),
  jobLevel: z.string().nullable(),
  matchMin: z.number().int().min(0).max(100),
  matchMax: z.number().int().min(0).max(100),
  recommendation: z.enum(["strong", "try", "weak"]),
  gaps: z.array(z.string()),
  requirements: z.array(
    z.object({
      requirement: z.string(),
      candidate: z.string(),
      match: z.enum(["green", "yellow", "red"]),
      isMustHave: z.boolean(),
      explanation: z.string().nullable(),
      techExplainer: z.string().nullable(),
    }),
  ),
});

export const coverLetterSchema = z.object({
  greeting: z.string(),
  whyJob: z.string(),
  aboutAndCase: z.string(),
  closing: z.string(),
  usedProjectTitle: z.string(),
});

export type AnalysisResult = z.infer<typeof analysisSchema>;
export type CoverLetterParts = z.infer<typeof coverLetterSchema>;
