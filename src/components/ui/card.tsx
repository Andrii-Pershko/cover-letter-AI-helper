import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
  muted = false,
}: {
  children: React.ReactNode;
  className?: string;
  muted?: boolean;
}) {
  return (
    <section
      className={cn(
        muted ? "glass-card-muted" : "glass-card",
        "min-w-0 p-4 sm:p-6",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted sm:text-[15px]">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}

export function FormMessage({
  error,
  ok,
}: {
  error?: string;
  ok?: boolean;
}) {
  if (error) {
    return (
      <p className="whitespace-pre-wrap break-all rounded-2xl bg-[rgb(220_120_110_/_0.18)] px-3.5 py-2 text-sm text-match-red">
        {error}
      </p>
    );
  }
  if (ok) {
    return (
      <p className="rounded-2xl bg-[rgb(80_180_140_/_0.18)] px-3.5 py-2 text-sm text-match-green">
        Збережено
      </p>
    );
  }
  return null;
}
