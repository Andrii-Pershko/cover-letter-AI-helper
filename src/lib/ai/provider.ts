import { createGoogleGenerativeAI } from "@ai-sdk/google";

export function getModelId() {
  return process.env["GEMINI_MODEL"]?.trim() || "gemini-2.5-flash";
}

export function getGoogleProviderOptions() {
  const modelId = getModelId();
  const gemini3 = modelId.includes("gemini-3");

  return {
    google: {
      thinkingConfig: gemini3
        ? { thinkingLevel: "minimal" as const }
        : { thinkingBudget: 0 },
    },
  };
}

export function getModel() {
  const apiKey = process.env["GOOGLE_GENERATIVE_AI_API_KEY"];
  if (!apiKey) {
    throw new Error(
      "Не задано GOOGLE_GENERATIVE_AI_API_KEY. Додай ключ з Google AI Studio у .env",
    );
  }

  const google = createGoogleGenerativeAI({ apiKey });
  return google(getModelId());
}
