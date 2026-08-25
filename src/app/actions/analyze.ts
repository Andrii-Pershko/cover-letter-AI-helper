"use server";

import { revalidatePath } from "next/cache";
import { runAnalysis } from "@/lib/ai/analyze";
import { parseClCharLimit, parseClMatchThreshold } from "@/lib/cl-settings";
import { prisma } from "@/lib/db";
import { getProfileForAnalysis } from "@/lib/profile";
import { getSetupStatus } from "@/lib/setup";

export type AnalyzeState = { error?: string; id?: string } | null;

export async function analyzeJob(
  _prev: AnalyzeState,
  formData: FormData,
): Promise<AnalyzeState> {
  const jobText = String(formData.get("jobText") ?? "").trim();
  if (jobText.length < 120) {
    return { error: "Встав повніший опис вакансії (хоча б кілька вимог)." };
  }

  const clMatchThreshold = parseClMatchThreshold(
    String(formData.get("clMatchThreshold") ?? ""),
  );
  if (typeof clMatchThreshold !== "number") {
    return { error: clMatchThreshold.error };
  }

  const clCharLimit = parseClCharLimit(String(formData.get("clCharLimit") ?? ""));
  if (typeof clCharLimit !== "number") {
    return { error: clCharLimit.error };
  }

  const profile = await getProfileForAnalysis();
  const setup = getSetupStatus(profile);
  if (!setup.ready) {
    return {
      error: `Спочатку заповни вводні: ${setup.missing.map((item) => item.label).join(", ")}`,
    };
  }

  await prisma.profile.update({
    where: { id: profile.id },
    data: { clMatchThreshold, clCharLimit },
  });

  try {
    const analysis = await runAnalysis(
      { ...profile, clMatchThreshold, clCharLimit },
      jobText,
    );
    revalidatePath("/");
    return { id: analysis.id };
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === "TimeoutError" || error.name === "AbortError")
    ) {
      return {
        error:
          "Gemini не відповів за 55 секунд (часто зависає thinking на structured JSON). Спробуй ще раз або поверни gemini-2.5-flash.",
      };
    }
    const message =
      error instanceof Error ? error.message : "Не вдалося виконати аналіз";
    return { error: message };
  }
}
