import { buttonClassName } from "@/components/ui/button";
import { recommendationLabel } from "@/lib/utils";
import Link from "next/link";

const PAGE_SIZE = 5;

export { PAGE_SIZE };

export function HistoryList({
  items,
  page,
  total,
}: {
  items: {
    id: string;
    companyName: string;
    jobTitle: string;
    matchMin: number;
    matchMax: number;
    recommendation: string;
  }[];
  page: number;
  total: number;
}) {
  if (total === 0) return null;

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = page < totalPages ? page + 1 : null;

  return (
    <section>
      <h2 className="mb-3 text-xl font-semibold tracking-tight text-ink">
        Історія
      </h2>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={`/analyses/${item.id}`}
              className="glass-row flex items-center justify-between gap-4 rounded-[18px] px-4 py-3.5 transition-all duration-200 hover:-translate-y-px hover:bg-white/50"
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
          {prevPage ? (
            <Link
              href={prevPage === 1 ? "/" : `/?page=${prevPage}`}
              className={buttonClassName("secondary")}
            >
              Назад
            </Link>
          ) : (
            <span className={buttonClassName("secondary", "pointer-events-none opacity-40")}>
              Назад
            </span>
          )}
          <span className="text-sm text-muted">
            {page} / {totalPages}
          </span>
          {nextPage ? (
            <Link
              href={`/?page=${nextPage}`}
              className={buttonClassName("secondary")}
            >
              Далі
            </Link>
          ) : (
            <span className={buttonClassName("secondary", "pointer-events-none opacity-40")}>
              Далі
            </span>
          )}
        </nav>
      ) : null}
    </section>
  );
}
