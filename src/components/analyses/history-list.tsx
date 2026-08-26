"use client";

import { getAnalysisHistory } from "@/app/actions/analyses";
import { Button } from "@/components/ui/button";
import type { AnalysisHistoryItem } from "@/lib/analysis-history";
import { HISTORY_PAGE_SIZE } from "@/lib/analysis-history";
import { cn, recommendationLabel } from "@/lib/utils";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

function historyHref(page: number) {
  return page <= 1 ? "/" : `/?page=${page}`;
}

function pageFromSearch(search: string) {
  return Math.max(
    1,
    Number.parseInt(new URLSearchParams(search).get("page") ?? "1", 10) || 1,
  );
}

export function HistoryList({
  items: initialItems,
  page: initialPage,
  total: initialTotal,
}: {
  items: AnalysisHistoryItem[];
  page: number;
  total: number;
}) {
  const [items, setItems] = useState(initialItems);
  const [page, setPage] = useState(initialPage);
  const [total, setTotal] = useState(initialTotal);
  const [pending, setPending] = useState(false);

  const loadPage = useCallback(async (nextPage: number, updateUrl: boolean) => {
    setPending(true);
    try {
      const result = await getAnalysisHistory(nextPage);
      setItems(result.items);
      setPage(result.page);
      setTotal(result.total);
      if (updateUrl) {
        const href = historyHref(result.page);
        const current = `${window.location.pathname}${window.location.search}`;
        if (current !== href) {
          window.history.pushState(null, "", href);
        }
      }
    } finally {
      setPending(false);
    }
  }, []);

  useEffect(() => {
    function onPopState() {
      void loadPage(pageFromSearch(window.location.search), false);
    }

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [loadPage]);

  if (total === 0) return null;

  const totalPages = Math.max(1, Math.ceil(total / HISTORY_PAGE_SIZE));
  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = page < totalPages ? page + 1 : null;

  return (
    <section>
      <h2 className="mb-3 text-xl font-semibold tracking-tight text-ink">
        Історія
      </h2>
      <ul
        className={cn(
          "flex flex-col gap-2 transition-opacity duration-200",
          pending && "opacity-60",
        )}
        aria-busy={pending}
      >
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={`/analyses/${item.id}`}
              className="glass-row flex cursor-pointer items-center justify-between gap-4 rounded-[18px] px-4 py-3.5 transition-all duration-200 hover:-translate-y-px hover:bg-white/50"
            >
              <span>
                <span className="block text-sm font-medium text-ink">
                  {item.companyName || item.jobTitle || "Вакансія"}
                </span>
                <span className="text-xs text-muted">
                  {item.jobTitle ? `${item.jobTitle} · ` : ""}
                  {recommendationLabel(item.recommendation)}
                </span>
              </span>
              <span className="text-lg font-semibold tracking-tight text-ink">
                {item.matchMin}–{item.matchMax}%
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {totalPages > 1 ? (
        <nav
          className="mt-4 flex items-center justify-between gap-3"
          aria-label="Сторінки історії"
        >
          <Button
            type="button"
            variant="secondary"
            disabled={!prevPage || pending}
            onClick={() => prevPage && void loadPage(prevPage, true)}
          >
            Назад
          </Button>
          <span className="text-sm text-muted">
            {page} / {totalPages}
          </span>
          <Button
            type="button"
            variant="secondary"
            disabled={!nextPage || pending}
            onClick={() => nextPage && void loadPage(nextPage, true)}
          >
            Далі
          </Button>
        </nav>
      ) : null}
    </section>
  );
}
