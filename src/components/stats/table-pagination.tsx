import { buttonClassName } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export function StatsTablePagination({
  page,
  totalPages,
  hrefForPage,
}: {
  page: number;
  totalPages: number;
  hrefForPage: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const prev = page > 1 ? hrefForPage(page - 1) : null;
  const next = page < totalPages ? hrefForPage(page + 1) : null;

  return (
    <nav
      className="flex items-center justify-between gap-3 border-t border-white/30 px-4 py-3 sm:px-6"
      aria-label="Сторінки таблиці статистики"
    >
      <p className="text-sm text-muted">
        Сторінка {page} з {totalPages}
      </p>
      <div className="flex items-center gap-1.5">
        {prev ? (
          <Link
            href={prev}
            className={buttonClassName("secondary", "px-3 py-2")}
            aria-label="Попередня сторінка"
          >
            <ChevronLeft className="size-4" aria-hidden />
            Назад
          </Link>
        ) : (
          <span
            className={cn(buttonClassName("secondary", "px-3 py-2"), "opacity-40")}
            aria-disabled="true"
          >
            <ChevronLeft className="size-4" aria-hidden />
            Назад
          </span>
        )}
        {next ? (
          <Link
            href={next}
            className={buttonClassName("secondary", "px-3 py-2")}
            aria-label="Наступна сторінка"
          >
            Далі
            <ChevronRight className="size-4" aria-hidden />
          </Link>
        ) : (
          <span
            className={cn(buttonClassName("secondary", "px-3 py-2"), "opacity-40")}
            aria-disabled="true"
          >
            Далі
            <ChevronRight className="size-4" aria-hidden />
          </span>
        )}
      </div>
    </nav>
  );
}
