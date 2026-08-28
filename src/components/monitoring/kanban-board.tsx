"use client";

import { updatePipelineStatus } from "@/app/actions/pipeline";
import {
  PIPELINE_COLUMNS,
  type PipelineCard,
  type PipelineStatus,
} from "@/lib/pipeline";
import { cn, stripUrl } from "@/lib/utils";
import { ExternalLink, GripVertical } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

type DragState = {
  id: string;
  from: PipelineStatus;
  x: number;
  y: number;
  width: number;
  offsetX: number;
  offsetY: number;
  title: string;
  subtitle: string;
};

function cardTitle(card: PipelineCard) {
  return card.companyName || card.jobTitle || "Вакансія";
}

function cardSubtitle(card: PipelineCard) {
  return [card.jobTitle, card.jobLevel].filter(Boolean).join(" · ");
}

function formatAppliedAt(value: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat("uk-UA", {
    day: "numeric",
    month: "short",
  }).format(new Date(value));
}

const SCROLLABLE_COLUMNS = new Set<PipelineStatus>([
  "applied",
  "interview",
  "test",
]);

function columnFromPoint(x: number, y: number): PipelineStatus | null {
  const target = document
    .elementsFromPoint(x, y)
    .find((el) => el instanceof HTMLElement && el.dataset.column);
  return target instanceof HTMLElement && target.dataset.column
    ? (target.dataset.column as PipelineStatus)
    : null;
}

export function KanbanBoard({ items }: { items: PipelineCard[] }) {
  const router = useRouter();
  const [overrides, setOverrides] = useState<Partial<Record<string, PipelineStatus>>>(
    {},
  );
  const [drag, setDrag] = useState<DragState | null>(null);
  const [overColumn, setOverColumn] = useState<PipelineStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const overColumnRef = useRef<PipelineStatus | null>(null);
  const overridesRef = useRef(overrides);

  useEffect(() => {
    overridesRef.current = overrides;
  }, [overrides]);

  const cards = useMemo(
    () =>
      items.map((card) => ({
        ...card,
        pipelineStatus: overrides[card.id] ?? card.pipelineStatus,
      })),
    [items, overrides],
  );

  const grouped = useMemo(() => {
    const map = Object.fromEntries(
      PIPELINE_COLUMNS.map((column) => [column.id, [] as PipelineCard[]]),
    ) as Record<PipelineStatus, PipelineCard[]>;
    for (const card of cards) {
      map[card.pipelineStatus].push(card);
    }
    return map;
  }, [cards]);

  useEffect(() => {
    function onPointerMove(event: PointerEvent) {
      const current = dragRef.current;
      if (!current) return;
      const next = {
        ...current,
        x: event.clientX - current.offsetX,
        y: event.clientY - current.offsetY,
      };
      dragRef.current = next;
      setDrag(next);
      const column = columnFromPoint(event.clientX, event.clientY);
      overColumnRef.current = column;
      setOverColumn(column);
    }

    async function finish() {
      const current = dragRef.current;
      const target = overColumnRef.current;
      if (!current) return;
      dragRef.current = null;
      overColumnRef.current = null;
      setDrag(null);
      setOverColumn(null);
      document.body.style.removeProperty("user-select");

      if (!target || target === current.from) return;

      const previous = overridesRef.current;
      const nextOverrides = { ...previous, [current.id]: target };
      overridesRef.current = nextOverrides;
      setOverrides(nextOverrides);
      setError(null);
      const result = await updatePipelineStatus(current.id, target);
      if (result.error) {
        overridesRef.current = previous;
        setOverrides(previous);
        setError(result.error);
        return;
      }
      router.refresh();
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", finish);
    window.addEventListener("pointercancel", finish);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", finish);
    };
  }, [router]);

  function startDrag(
    event: ReactPointerEvent<HTMLButtonElement>,
    card: PipelineCard,
  ) {
    if (event.button !== 0) return;
    event.preventDefault();
    const rect = event.currentTarget.closest("[data-card]")?.getBoundingClientRect();
    const next: DragState = {
      id: card.id,
      from: card.pipelineStatus,
      width: rect?.width ?? 220,
      offsetX: event.clientX - (rect?.left ?? event.clientX),
      offsetY: event.clientY - (rect?.top ?? event.clientY),
      x: rect?.left ?? event.clientX,
      y: rect?.top ?? event.clientY,
      title: cardTitle(card),
      subtitle: cardSubtitle(card),
    };
    dragRef.current = next;
    overColumnRef.current = card.pipelineStatus;
    setDrag(next);
    setOverColumn(card.pipelineStatus);
    document.body.style.userSelect = "none";
  }

  if (items.length === 0) {
    return (
      <p className="glass-card px-4 py-8 text-center text-sm leading-6 text-muted sm:px-6">
        Поки немає поданих вакансій. Після аналізу натисни «Я подався на
        вакансію» — картка зʼявиться тут.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {error ? (
        <p className="rounded-2xl bg-[rgb(220_120_110_/_0.18)] px-3.5 py-2 text-sm text-match-red">
          {error}
        </p>
      ) : null}
      <div className="-mx-1 overflow-x-auto p-1 pb-2">
        <div className="flex min-w-[920px] gap-3 lg:min-w-0 lg:grid lg:grid-cols-5">
          {PIPELINE_COLUMNS.map((column) => {
            const columnCards = grouped[column.id];
            const isOver = overColumn === column.id;
            const isScrollable = SCROLLABLE_COLUMNS.has(column.id);
            return (
              <section
                key={column.id}
                data-column={column.id}
                className={cn(
                  "glass-card flex min-h-[28rem] min-w-[176px] flex-1 flex-col p-3 transition-[box-shadow,background-color] duration-200",
                  isScrollable && "max-h-[600px] overflow-hidden",
                  isOver &&
                  "bg-accent/10 shadow-[0_0_0_2px_rgb(44_185_164_/_0.45)]",
                )}
              >
                <header className="pointer-events-none mb-3 flex shrink-0 items-baseline justify-between gap-2 px-1">
                  <h2 className="text-sm font-semibold tracking-tight text-ink">
                    {column.label}
                  </h2>
                  <span className="text-xs tabular-nums text-muted">
                    {columnCards.length}
                  </span>
                </header>
                <ul
                  className={cn(
                    "flex min-h-0 flex-1 flex-col gap-2",
                    isScrollable
                      ? "glass-scroll pointer-events-auto overflow-y-auto pr-1"
                      : "pointer-events-none",
                  )}
                >
                  {columnCards.map((card) => (
                    <li key={card.id} className="pointer-events-auto">
                      <KanbanCard
                        card={card}
                        dragging={drag?.id === card.id}
                        onDragStart={startDrag}
                      />
                    </li>
                  ))}
                  {columnCards.length === 0 ? (
                    <li className="flex flex-1 items-center justify-center rounded-[16px] border border-dashed border-white/50 px-3 py-6 text-center text-xs leading-5 text-muted">
                      Перетягни сюди
                    </li>
                  ) : null}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
      {drag ? (
        <div
          aria-hidden
          className="pointer-events-none fixed z-50"
          style={{
            left: drag.x,
            top: drag.y,
            width: drag.width,
          }}
        >
          <div className="glass-card rotate-1 p-3 shadow-[0_18px_40px_rgb(22_72_66_/_0.18)]">
            <p className="truncate text-sm font-medium text-ink">{drag.title}</p>
            {drag.subtitle ? (
              <p className="mt-0.5 truncate text-xs text-muted">{drag.subtitle}</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function KanbanCard({
  card,
  dragging,
  onDragStart,
}: {
  card: PipelineCard;
  dragging: boolean;
  onDragStart: (
    event: ReactPointerEvent<HTMLButtonElement>,
    card: PipelineCard,
  ) => void;
}) {
  const applied = formatAppliedAt(card.appliedAt);

  return (
    <article
      data-card
      className={cn(
        "glass-row rounded-[16px] p-3 transition-opacity duration-150",
        dragging && "opacity-40",
      )}
    >
      <div className="flex items-start gap-2">
        <button
          type="button"
          aria-label="Перетягнути вакансію"
          onPointerDown={(event) => onDragStart(event, card)}
          className="mt-0.5 flex shrink-0 cursor-grab touch-none items-center justify-center rounded-lg text-muted hover:bg-white/50 hover:text-ink active:cursor-grabbing"
        >
          <GripVertical className="size-4" aria-hidden />
        </button>
        <div className="min-w-0 flex-1">
          <Link
            href={`/analyses/${card.id}`}
            className="block truncate text-sm font-medium text-ink hover:text-accent"
          >
            {cardTitle(card)}
          </Link>
          {cardSubtitle(card) ? (
            <p className="mt-0.5 truncate text-xs text-muted">
              {cardSubtitle(card)}
            </p>
          ) : null}
          <p className="mt-1.5 text-sm font-semibold tabular-nums text-ink">
            {card.matchMin}–{card.matchMax}%
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted">
            {applied ? <span>з {applied}</span> : null}
            {card.jobUrl ? (
              <a
                href={card.jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-w-0 items-center gap-1 text-accent hover:text-accent-hover"
              >
                <ExternalLink className="size-3 shrink-0" aria-hidden />
                <span className="truncate">{stripUrl(card.jobUrl)}</span>
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
