"use client";

import { markApplied } from "@/app/actions/pipeline";
import { Button, buttonClassName } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function ApplyButton({
  analysisId,
  applied,
}: {
  analysisId: string;
  applied: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(applied);
  const [error, setError] = useState<string | null>(null);

  if (done) {
    return (
      <Link href="/monitoring" className={buttonClassName("secondary")}>
        Подано
      </Link>
    );
  }

  return (
    <span className="inline-flex flex-col items-stretch gap-1">
      <Button
        type="button"
        variant="secondary"
        disabled={pending}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const result = await markApplied(analysisId);
            if (result.error) {
              setError(result.error);
              return;
            }
            setDone(true);
            router.refresh();
          });
        }}
      >
        {pending ? "Зберігаю…" : "Я подався на вакансію"}
      </Button>
      {error ? <span className="text-xs text-match-red">{error}</span> : null}
    </span>
  );
}
