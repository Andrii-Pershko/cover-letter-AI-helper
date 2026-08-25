import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { generateText } from "ai";
import { z } from "zod";
import { getGoogleProviderOptions, getModel, getModelId } from "./provider";

function unfence(text: string): string {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  return (fenced ? fenced[1] : trimmed).trim();
}

function extractJson(text: string): string {
  const raw = unfence(text);
  const start = raw.indexOf("{");
  if (start === -1) {
    throw new Error("no-json");
  }

  let depth = 0;
  let inString = false;
  let escape = false;
  for (let index = start; index < raw.length; index += 1) {
    const char = raw[index];
    if (inString) {
      if (escape) {
        escape = false;
        continue;
      }
      if (char === "\\") {
        escape = true;
        continue;
      }
      if (char === '"') inString = false;
      continue;
    }
    if (char === '"') {
      inString = true;
      continue;
    }
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) return raw.slice(start, index + 1);
    }
  }

  throw new Error("truncated-json");
}

function repairJson(raw: string): string {
  return raw.replace(/,\s*([}\]])/g, "$1");
}

function dumpLastResponse(payload: unknown) {
  try {
    writeFileSync(
      join(process.cwd(), ".ai-last-response.txt"),
      typeof payload === "string" ? payload : JSON.stringify(payload, null, 2),
      "utf8",
    );
  } catch (error) {
    console.error("[ai] failed to write .ai-last-response.txt", error);
  }
}

function formatParseError(step: string, reason: unknown, text: string): Error {
  const reasonText =
    reason instanceof z.ZodError
      ? JSON.stringify(reason.issues, null, 2)
      : reason instanceof Error
        ? reason.message
        : String(reason);
  const body = text.trim().length > 0 ? text : "(порожня відповідь)";
  return new Error(
    `Модель повернула невалідний JSON (${step}).\nПричина: ${reasonText}\n\nВідповідь моделі:\n${body}`,
  );
}

export async function generateJson<S extends z.ZodType>(
  step: string,
  schema: S,
  {
    system,
    prompt,
    maxOutputTokens,
    timeoutMs,
    temperature = 0,
  }: {
    system: string;
    prompt: string;
    maxOutputTokens: number;
    timeoutMs: number;
    temperature?: number;
  },
): Promise<z.infer<S>> {
  const started = Date.now();
  try {
    const result = await generateText({
      model: getModel(),
      system: `${system}

Відповідь — лише один JSON-об'єкт, без markdown і без тексту навколо.`,
      prompt,
      temperature,
      reasoning: "minimal",
      maxOutputTokens,
      maxRetries: 0,
      abortSignal: AbortSignal.timeout(timeoutMs),
      providerOptions: getGoogleProviderOptions(),
    });

    const reasoningText = Array.isArray(result.reasoning)
      ? result.reasoning
          .map((part) => ("text" in part ? part.text : JSON.stringify(part)))
          .join("\n")
      : "";
    const text = result.text?.trim() || reasoningText.trim();

    console.info("[ai]", {
      step,
      model: getModelId(),
      ms: Date.now() - started,
      inputTokens: result.usage?.inputTokens,
      outputTokens: result.usage?.outputTokens,
      textLength: text.length,
      usage: result.usage,
    });

    try {
      const extracted = repairJson(extractJson(text));
      return schema.parse(JSON.parse(extracted));
    } catch (error) {
      dumpLastResponse({
        step,
        model: getModelId(),
        ms: Date.now() - started,
        reason: error instanceof Error ? error.message : error,
        issues: error instanceof z.ZodError ? error.issues : undefined,
        text: result.text,
        reasoning: result.reasoning,
        warnings: result.warnings,
      });
      console.error("[ai] json parse failed — see .ai-last-response.txt");
      throw formatParseError(step, error, text);
    }
  } catch (error) {
    console.error("[ai] call failed", {
      step,
      model: getModelId(),
      ms: Date.now() - started,
      name: error instanceof Error ? error.name : typeof error,
      message: error instanceof Error ? error.message : error,
    });
    throw error;
  }
}
