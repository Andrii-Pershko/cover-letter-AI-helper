import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function splitList(value: string): string[] {
  return value
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function stripUrl(value: string): string {
  return value.trim().replace(/^https?:\/\//i, "").replace(/\/$/, "");
}

export function formatContacts(profile: {
  linkedin: string;
  email: string;
  telegram: string;
}): string {
  return [
    `LinkedIn: ${stripUrl(profile.linkedin)}`,
    `Email: ${profile.email.trim()}`,
    `Telegram: ${stripUrl(profile.telegram)}`,
  ].join("\n");
}

export function assembleCoverLetter(
  parts: {
    greeting: string;
    whyJob: string;
    aboutAndCase: string;
    closing: string;
  },
  profile: { linkedin: string; email: string; telegram: string },
): string {
  return [
    parts.greeting.trim(),
    parts.whyJob.trim(),
    parts.aboutAndCase.trim(),
    parts.closing.trim(),
    formatContacts(profile),
  ].join("\n\n");
}

export function matchAverage(min: number, max: number): number {
  return (min + max) / 2;
}

export function recommendationLabel(
  value: string,
): "Так, сильний match" | "Так, є сенс спробувати" | "Слабкий match" {
  if (value === "strong") return "Так, сильний match";
  if (value === "try") return "Так, є сенс спробувати";
  return "Слабкий match";
}
