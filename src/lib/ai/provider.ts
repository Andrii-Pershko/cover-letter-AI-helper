import { createGoogleGenerativeAI } from "@ai-sdk/google";

export function getModelId() {
  return process.env["GEMINI_MODEL"]?.trim() || "gemini-3.1-flash-lite";
}

export function getGoogleProviderOptions() {
  const modelId = getModelId();
  const google: {
    structuredOutputs: false;
    thinkingConfig?: {
      thinkingLevel?: "minimal";
      thinkingBudget?: number;
      includeThoughts: false;
    };
  } = { structuredOutputs: false };

  if (modelId.includes("gemini-3")) {
    google.thinkingConfig = {
      thinkingLevel: "minimal",
      includeThoughts: false,
    };
  } else if (modelId.includes("gemini-2.5") && !modelId.includes("lite")) {
    google.thinkingConfig = { thinkingBudget: 0, includeThoughts: false };
  }

  return { google };
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
