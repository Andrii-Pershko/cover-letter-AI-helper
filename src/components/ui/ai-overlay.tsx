"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AiOverlayScreen } from "@/components/ui/ai-overlay-screen";

export function AiOverlay({ open }: { open: boolean }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!mounted || !open) return null;

  return createPortal(<AiOverlayScreen />, document.body);
}
