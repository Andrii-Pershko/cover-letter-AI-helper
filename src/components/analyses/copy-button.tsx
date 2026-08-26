"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

function copyWithExecCommand(text: string) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "0";
  textarea.style.width = "2em";
  textarea.style.height = "2em";
  textarea.style.padding = "0";
  textarea.style.border = "none";
  textarea.style.outline = "none";
  textarea.style.boxShadow = "none";
  textarea.style.background = "transparent";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);
  const ok = document.execCommand("copy");
  document.body.removeChild(textarea);
  if (!ok) {
    throw new Error("copy failed");
  }
}

async function copyText(text: string) {
  if (window.isSecureContext && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      copyWithExecCommand(text);
      return;
    }
  }
  copyWithExecCommand(text);
}

export function CopyButton({ text }: { text: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const timeoutRef = useRef<number>(0);

  useEffect(() => {
    return () => window.clearTimeout(timeoutRef.current);
  }, []);

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={async () => {
        try {
          await copyText(text);
          setStatus("copied");
        } catch {
          setStatus("error");
        }
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => setStatus("idle"), 1500);
      }}
    >
      {status === "copied"
        ? "Скопійовано"
        : status === "error"
          ? "Не вдалося скопіювати"
          : "Копіювати лист"}
    </Button>
  );
}
