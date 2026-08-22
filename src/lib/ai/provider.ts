import { createGoogleGenerativeAI } from "@ai-sdk/google";

export function getModel() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Не задано GOOGLE_GENERATIVE_AI_API_KEY. Додай ключ з Google AI Studio у .env",
    );
  }

  const google = createGoogleGenerativeAI({ apiKey });
  const modelId = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";
  return google(modelId);
}
