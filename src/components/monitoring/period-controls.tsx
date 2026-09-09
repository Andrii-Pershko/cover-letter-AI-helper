"use client";

import { startNewMonitoring } from "@/app/actions/pipeline";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Archive, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState, useTransition } from "react";
import { createPortal } from "react-dom";

const CONFIRM_DELAY_MS = 2000;

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
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function confirm() {
    setError(null);
    startTransition(async () => {
      const result = await startNewMonitoring();
      if (result.error) {
        setError(result.error);
        setOpen(false);
        return;
      }
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <div className="flex min-w-0 flex-col items-stretch gap-1.5 sm:items-end">
      <Button
        type="button"
        variant="secondary"
        disabled={disabled || pending}
        onClick={() => {
          setError(null);
          setOpen(true);
        }}
        className="h-11 w-full sm:w-auto"
      >
        <Archive className="size-4" aria-hidden />
        {pending ? "Архівую…" : "Почати новий моніторинг"}
      </Button>
      {error ? <p className="text-sm text-match-red">{error}</p> : null}
      {open ? (
        <ArchiveConfirmModal
          pending={pending}
          onCancel={() => setOpen(false)}
          onConfirm={confirm}
        />
      ) : null}
    </div>
  );
}

function ArchiveConfirmModal({
  pending,
  onCancel,
  onConfirm,
}: {
  pending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const titleId = useId();
  const descriptionId = useId();
  const [startedAt] = useState(() => Date.now());
  const [now, setNow] = useState(startedAt);
  const leftMs = Math.max(0, CONFIRM_DELAY_MS - (now - startedAt));
  const unlocked = leftMs <= 0;
  const secondsLeft = Math.ceil(leftMs / 1000);
  const confirmReady = unlocked && !pending;

  useEffect(() => {
    const tick = window.setInterval(() => setNow(Date.now()), 100);
    return () => window.clearInterval(tick);
  }, []);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    if (pending) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pending, onCancel]);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Закрити"
        disabled={pending}
        onClick={onCancel}
        className="absolute inset-0 cursor-pointer bg-[rgb(20_48_44_/_0.28)] backdrop-blur-[8px]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="glass-card relative z-10 w-full max-w-md p-5 sm:p-6"
      >
        <h2
          id={titleId}
          className="text-xl font-semibold tracking-tight text-ink"
        >
          Почати новий моніторинг?
        </h2>
        <p id={descriptionId} className="mt-2 text-sm leading-6 text-muted">
          Поточні вакансії та статистика цього відрізка перейдуть в архів.
          Скасувати цю дію не можна.
        </p>
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            disabled={pending}
            onClick={onCancel}
            className="h-11"
          >
            Скасувати
          </Button>
          <Button
            type="button"
            disabled={!confirmReady}
            onClick={onConfirm}
            className="h-11 min-w-36"
          >
            {pending
              ? "Архівую…"
              : unlocked
                ? "Підтвердити"
                : `Підтвердити (${secondsLeft})`}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
