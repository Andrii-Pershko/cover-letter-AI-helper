"use client";

import { useRef, useState } from "react";
import { addDays, parseDateKey, type StatsPeriod, type StatsRow } from "@/lib/stats";

type SeriesKey = "analyses" | "applications" | "flow" | "rejected" | "offers";

const SERIES: Array<{ key: SeriesKey; label: string; color: string }> = [
  { key: "analyses", label: "Аналізів", color: "var(--series-1)" },
  { key: "applications", label: "Заявок", color: "var(--series-2)" },
  { key: "flow", label: "Флоу", color: "var(--series-3)" },
  { key: "rejected", label: "Відхилили", color: "var(--series-4)" },
  { key: "offers", label: "Офер", color: "var(--series-5)" },
];

const MAX_GROUPS = 8;
const PLOT_HEIGHT = 200;
const BAR_WIDTH = 11;
const BAR_GAP = 3;
const GROUP_GAP = 26;
const PADDING_TOP = 20;
const PADDING_RIGHT = 10;
const AXIS_GUTTER = 30;
const AXIS_BAND_HEIGHT = 40;
const TOOLTIP_HALF_WIDTH = 100;

function niceMax(value: number): number {
  if (value <= 5) return 5;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const steps = [1, 2, 2.5, 5, 10];
  for (const step of steps) {
    const candidate = step * magnitude;
    if (candidate >= value) return candidate;
  }
  return Math.ceil(value / magnitude) * magnitude;
}

const shortDateFmt = new Intl.DateTimeFormat("uk-UA", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

function shortLabel(period: StatsPeriod, row: StatsRow): string {
  if (period === "day") {
    return shortDateFmt.format(parseDateKey(row.key));
  }
  if (period === "week") {
    const start = shortDateFmt.format(parseDateKey(row.key));
    const end = shortDateFmt.format(parseDateKey(addDays(row.key, 6)));
    return `${start} – ${end}`;
  }
  const [year, month] = row.key.split("-").map(Number);
  return new Intl.DateTimeFormat("uk-UA", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}

export function ComparisonChart({
  rows,
  period,
}: {
  rows: StatsRow[];
  period: StatsPeriod;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [scrollX, setScrollX] = useState(0);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);

  const groups = [...rows].slice(0, MAX_GROUPS).reverse();
  if (groups.length === 0) return null;

  const maxRaw = Math.max(
    1,
    ...groups.flatMap((group) => SERIES.map((series) => group[series.key])),
  );
  const maxValue = niceMax(maxRaw);

  const groupWidth = SERIES.length * BAR_WIDTH + (SERIES.length - 1) * BAR_GAP;
  const plotStartX = AXIS_GUTTER;
  const width =
    plotStartX +
    groups.length * groupWidth +
    (groups.length - 1) * GROUP_GAP +
    PADDING_RIGHT;
  const height = PADDING_TOP + PLOT_HEIGHT + AXIS_BAND_HEIGHT;

  const yTicks = [0, maxValue / 2, maxValue];

  function groupX(index: number) {
    return plotStartX + index * (groupWidth + GROUP_GAP);
  }

  const active = hovered !== null ? groups[hovered] : null;
  const clampMax = Math.max(
    (containerWidth ?? width) - TOOLTIP_HALF_WIDTH,
    TOOLTIP_HALF_WIDTH,
  );
  const tooltipLeft =
    hovered !== null
      ? Math.min(
          Math.max(groupX(hovered) + groupWidth / 2 - scrollX, TOOLTIP_HALF_WIDTH),
          clampMax,
        )
      : 0;

  function activateGroup(index: number) {
    setContainerWidth(wrapperRef.current?.clientWidth ?? null);
    setHovered(index);
  }

  return (
    <div
      className="viz-root relative"
      style={
        {
          "--series-1": "#2a78d6",
          "--series-2": "#eb6834",
          "--series-3": "#1baf7a",
          "--series-4": "#eda100",
          "--series-5": "#e87ba4",
        } as React.CSSProperties
      }
    >
      <div
        ref={wrapperRef}
        onScroll={(event) => setScrollX(event.currentTarget.scrollLeft)}
        className="overflow-x-auto overflow-y-hidden glass-scroll"
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          className="block"
          style={{ minWidth: Math.min(width, 720) }}
          role="img"
          aria-label="Порівняння показників по періодах"
        >
          {yTicks.map((tick) => {
            const y = PADDING_TOP + PLOT_HEIGHT - (tick / maxValue) * PLOT_HEIGHT;
            return (
              <g key={tick}>
                <line
                  x1={plotStartX}
                  x2={width - PADDING_RIGHT}
                  y1={y}
                  y2={y}
                  stroke="var(--chart-grid)"
                  strokeWidth={1}
                />
                <text
                  x={plotStartX - 6}
                  y={y - 4}
                  fontSize={9}
                  textAnchor="end"
                  fill="var(--chart-muted)"
                >
                  {Math.round(tick)}
                </text>
              </g>
            );
          })}

          {groups.map((group, index) => {
            const x = groupX(index);
            const isHovered = hovered === index;
            const labelX = x + groupWidth / 2;
            const labelY = PADDING_TOP + PLOT_HEIGHT + 14;
            return (
              <g
                key={group.key}
                onPointerEnter={() => activateGroup(index)}
                onPointerLeave={() =>
                  setHovered((current) => (current === index ? null : current))
                }
                onFocus={() => activateGroup(index)}
                onBlur={() =>
                  setHovered((current) => (current === index ? null : current))
                }
                tabIndex={0}
                style={{ outline: "none", cursor: "pointer" }}
              >
                <rect
                  x={x - GROUP_GAP / 2}
                  y={PADDING_TOP}
                  width={groupWidth + GROUP_GAP}
                  height={PLOT_HEIGHT}
                  fill="transparent"
                />
                {isHovered && (
                  <rect
                    x={x - 4}
                    y={PADDING_TOP}
                    width={groupWidth + 8}
                    height={PLOT_HEIGHT}
                    fill="var(--chart-hover)"
                    rx={8}
                  />
                )}
                {SERIES.map((series, seriesIndex) => {
                  const value = group[series.key];
                  const barHeight = (value / maxValue) * PLOT_HEIGHT;
                  const barX = x + seriesIndex * (BAR_WIDTH + BAR_GAP);
                  const barY = PADDING_TOP + PLOT_HEIGHT - barHeight;
                  return (
                    <rect
                      key={series.key}
                      x={barX}
                      y={barHeight > 0 ? barY : PADDING_TOP + PLOT_HEIGHT - 1}
                      width={BAR_WIDTH}
                      height={Math.max(barHeight, value > 0 ? 1 : 0)}
                      rx={4}
                      fill={series.color}
                      opacity={isHovered || hovered === null ? 1 : 0.45}
                    />
                  );
                })}
                <text
                  x={labelX}
                  y={labelY}
                  fontSize={9}
                  textAnchor="end"
                  fill="var(--chart-muted)"
                  transform={`rotate(-30 ${labelX} ${labelY})`}
                >
                  {shortLabel(period, group)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {active && (
        <div
          className="glass-dropdown pointer-events-none absolute z-10 min-w-[180px] -translate-x-1/2 rounded-2xl px-3.5 py-3 text-xs"
          style={{ left: tooltipLeft, top: 4 }}
        >
          <p className="mb-1.5 font-medium text-ink">{active.label}</p>
          <dl className="flex flex-col gap-1">
            {SERIES.map((series) => (
              <div key={series.key} className="flex items-center justify-between gap-4">
                <dt className="flex items-center gap-1.5 text-muted">
                  <span
                    className="inline-block h-[2px] w-3 rounded-full"
                    style={{ backgroundColor: series.color }}
                  />
                  {series.label}
                </dt>
                <dd className="font-semibold tabular-nums text-ink">
                  {active[series.key]}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-white/30 pt-3">
        {SERIES.map((series) => (
          <div key={series.key} className="flex items-center gap-1.5 text-xs text-muted">
            <span
              className="inline-block h-2.5 w-2.5 rounded-[3px]"
              style={{ backgroundColor: series.color }}
            />
            {series.label}
          </div>
        ))}
      </div>
    </div>
  );
}
