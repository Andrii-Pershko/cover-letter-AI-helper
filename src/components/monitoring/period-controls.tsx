"use client";

import { startNewMonitoring } from "@/app/actions/pipeline";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Archive, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function ArchiveToggle({
  checked,
  hrefOn,
  hrefOff,
}: {
  checked: boolean;
  hrefOn: string;
  hrefOff: string;
}) {
  return (
    <Link
      href={checked ? hrefOff : hrefOn}
      role="checkbox"
      aria-checked={checked}
      className="flex cursor-pointer items-center gap-2.5 text-sm text-ink"
    >
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors duration-200",
          checked
            ? "border-accent bg-accent text-white"
            : "border-[rgb(90_140_132_/_0.28)] bg-white/40 text-transparent",
        )}
        aria-hidden
      >
        <Check className="size-3" strokeWidth={3} />
      </span>
      <span>Показувати архівну статистику</span>
    </Link>
  );
}

export function StartNewMonitoringButton({ disabled }: { disabled: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onClick() {
    const confirmed = window.confirm(
      "Поточні вакансії та статистика цього відрізка перейдуть в архів. Почнеться новий моніторинг. Продовжити?",
    );
    if (!confirmed) return;
    setError(null);
    startTransition(async () => {
      const result = await startNewMonitoring();
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex min-w-0 flex-col items-stretch gap-1.5 sm:items-end">
      <Button
        type="button"
        variant="secondary"
        disabled={disabled || pending}
        onClick={onClick}
        className="h-11 w-full sm:w-auto"
      >
        <Archive className="size-4" aria-hidden />
        {pending ? "Архівую…" : "Почати новий моніторинг"}
      </Button>
      {error ? <p className="text-sm text-match-red">{error}</p> : null}
    </div>
  );
}
