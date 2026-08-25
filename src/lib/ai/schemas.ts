import { z } from "zod";

const nullishText = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((value) => {
    if (value == null) return null;
    const trimmed = value.trim();
    return trimmed.length === 0 ? null : trimmed;
  });

const percent = z.coerce.number().transform((value) => {
  const rounded = Math.round(value);
  return Math.min(100, Math.max(0, rounded));
});

const recommendation = z
  .string()
  .transform((value) => value.trim().toLowerCase())
  .pipe(z.enum(["strong", "try", "weak"]));

const mustHave = z
  .union([z.boolean(), z.string(), z.number()])
  .transform((value) => value === true || value === "true" || value === 1);

function scoreToMatch(score: number): "green" | "yellow" | "red" {
  if (score >= 80) return "green";
  if (score >= 40) return "yellow";
  return "red";
}

const requirementRow = z
  .object({
    requirement: z.string().optional(),
    name: z.string().optional(),
    title: z.string().optional(),
    candidate: z.string().optional(),
    match: z.union([z.string(), z.number()]),
    isMustHave: mustHave.default(true),
    explanation: nullishText.optional(),
    techExplainer: nullishText.optional(),
  })
  .transform((row) => {
    const requirement = (row.requirement ?? row.name ?? row.title ?? "").trim();
    let match: "green" | "yellow" | "red";
    if (typeof row.match === "number") {
      match = scoreToMatch(row.match);
    } else {
      const normalized = row.match.trim().toLowerCase();
      if (
        normalized === "green" ||
        normalized === "yellow" ||
        normalized === "red"
      ) {
        match = normalized;
      } else {
        const asNumber = Number(normalized);
        match = Number.isFinite(asNumber) ? scoreToMatch(asNumber) : "yellow";
      }
    }
    return {
      requirement: requirement || "вимога",
      candidate:
        row.candidate?.trim() ||
        (match === "green" ? "є" : match === "red" ? "немає" : "частково"),
      match,
      isMustHave: row.isMustHave,
      explanation: match === "green" ? null : (row.explanation ?? null),
      techExplainer: match === "red" ? (row.techExplainer ?? null) : null,
    };
  });

export const analysisSchema = z.object({
  companyName: nullishText,
  jobTitle: nullishText,
  jobLevel: nullishText,
  matchMin: percent,
  matchMax: percent,
  recommendation,
  gaps: z.array(z.string()).default([]),
  requirements: z.array(requirementRow).default([]),
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
