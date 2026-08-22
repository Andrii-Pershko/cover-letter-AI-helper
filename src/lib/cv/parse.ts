import mammoth from "mammoth";
import { extractText } from "unpdf";

const MAX_BYTES = 8 * 1024 * 1024;

export async function parseCvFile(file: File): Promise<{
  text: string;
  fileName: string;
  mimeType: string;
}> {
  if (file.size > MAX_BYTES) {
    throw new Error("Файл CV більший за 8 МБ");
  }

  const fileName = file.name;
  const mimeType = file.type || "application/octet-stream";
  const buffer = Buffer.from(await file.arrayBuffer());
  const lower = fileName.toLowerCase();

  if (mimeType.includes("pdf") || lower.endsWith(".pdf")) {
    const result = await extractText(new Uint8Array(buffer), { mergePages: true });
    const text = Array.isArray(result.text) ? result.text.join("\n\n") : result.text;
    return { text: cleanCvText(text), fileName, mimeType: "application/pdf" };
  }

  if (
    mimeType.includes("wordprocessingml") ||
    mimeType.includes("msword") ||
    lower.endsWith(".docx")
  ) {
    const parsed = await mammoth.extractRawText({ buffer });
    return {
      text: cleanCvText(parsed.value),
      fileName,
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    };
  }

  if (mimeType.startsWith("text/") || lower.endsWith(".txt")) {
    return { text: cleanCvText(buffer.toString("utf8")), fileName, mimeType: "text/plain" };
  }

  throw new Error("Підтримуються лише PDF, DOCX і TXT");
}

function cleanCvText(text: string): string {
  return text.replace(/\r/g, "").replace(/\n{3,}/g, "\n\n").trim();
}
