import { matchAverage } from "@/lib/utils";

export const DEFAULT_CL_MATCH_THRESHOLD = 80;
export const DEFAULT_CL_CHAR_LIMIT = 1500;

export const CL_MATCH_THRESHOLD_MIN = 1;
export const CL_MATCH_THRESHOLD_MAX = 100;
export const CL_CHAR_LIMIT_MIN = 400;
export const CL_CHAR_LIMIT_MAX = 5000;

export function shouldWriteCoverLetter(
  matchMin: number,
  matchMax: number,
  threshold: number,
): boolean {
  return matchAverage(matchMin, matchMax) >= threshold;
}

export function parseClMatchThreshold(raw: string): number | { error: string } {
  const value = Number(raw.trim());
  if (!Number.isInteger(value)) {
    return { error: "Поріг match має бути цілим числом" };
  }
  if (value < CL_MATCH_THRESHOLD_MIN || value > CL_MATCH_THRESHOLD_MAX) {
    return {
      error: `Поріг match — від ${CL_MATCH_THRESHOLD_MIN} до ${CL_MATCH_THRESHOLD_MAX}%`,
    };
  }
  return value;
}

export function parseClCharLimit(raw: string): number | { error: string } {
  const value = Number(raw.trim());
  if (!Number.isInteger(value)) {
    return { error: "Довжина листа має бути цілим числом" };
  }
  if (value < CL_CHAR_LIMIT_MIN || value > CL_CHAR_LIMIT_MAX) {
    return {
      error: `Довжина листа — від ${CL_CHAR_LIMIT_MIN} до ${CL_CHAR_LIMIT_MAX} символів`,
    };
  }
  return value;
}

export function coverLetterProseLength(letter: string, contacts: string): number {
  const suffix = `\n\n${contacts}`;
  if (letter.endsWith(suffix)) {
    return letter.slice(0, -suffix.length).length;
  }
  return letter.length;
}
