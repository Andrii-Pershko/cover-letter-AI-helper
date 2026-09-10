export const STATS_TIME_ZONE = "Europe/Kyiv";

export const STATS_PERIODS = ["day", "week", "month"] as const;

export type StatsPeriod = (typeof STATS_PERIODS)[number];

export type StatsRow = {
  key: string;
  label: string;
  analyses: number;
  applications: number;
  flow: number;
  rejected: number;
  offers: number;
};

export type StatsView = {
  period: StatsPeriod;
  rows: StatsRow[];
  current: StatsRow;
  totals: {
    analyses: number;
    applications: number;
    flow: number;
    rejected: number;
    offers: number;
  };
};

export const STATS_TABLE_PAGE_SIZE = 7;

export type StatsTablePage = {
  rows: StatsRow[];
  page: number;
  totalPages: number;
  totalRows: number;
};

export function parseStatsPeriod(value: string | undefined): StatsPeriod {
  if (value === "week" || value === "month" || value === "day") return value;
  return "day";
}

export function parseStatsPage(value: string | undefined): number {
  const parsed = Number.parseInt(value ?? "1", 10);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return parsed;
}

export function paginateStatsRows(
  rows: StatsRow[],
  page: number,
  pageSize = STATS_TABLE_PAGE_SIZE,
): StatsTablePage {
  const totalRows = rows.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    rows: rows.slice(start, start + pageSize),
    page: safePage,
    totalPages,
    totalRows,
  };
}

export function dateKeyInZone(
  date: Date,
  timeZone = STATS_TIME_ZONE,
): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function parseDateKey(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function addDays(key: string, days: number): string {
  const date = parseDateKey(key);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function startOfIsoWeek(key: string): string {
  const date = parseDateKey(key);
  const weekday = date.getUTCDay();
  const offset = weekday === 0 ? 6 : weekday - 1;
  date.setUTCDate(date.getUTCDate() - offset);
  return date.toISOString().slice(0, 10);
}

function monthKey(key: string): string {
  return key.slice(0, 7);
}

function bucketKey(dayKey: string, period: StatsPeriod): string {
  if (period === "day") return dayKey;
  if (period === "week") return startOfIsoWeek(dayKey);
  return monthKey(dayKey);
}

function formatLabel(key: string, period: StatsPeriod): string {
  if (period === "day") {
    return new Intl.DateTimeFormat("uk-UA", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(parseDateKey(key));
  }
  if (period === "week") {
    const start = parseDateKey(key);
    const end = parseDateKey(addDays(key, 6));
    const startFmt = new Intl.DateTimeFormat("uk-UA", {
      day: "numeric",
      month: "short",
      timeZone: "UTC",
    }).format(start);
    const endFmt = new Intl.DateTimeFormat("uk-UA", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(end);
    return `${startFmt} – ${endFmt}`;
  }
  const [year, month] = key.split("-").map(Number);
  return new Intl.DateTimeFormat("uk-UA", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}

type BucketCounts = {
  analyses: number;
  applications: number;
  flow: number;
  rejected: number;
  offers: number;
};

function emptyCounts(): BucketCounts {
  return {
    analyses: 0,
    applications: 0,
    flow: 0,
    rejected: 0,
    offers: 0,
  };
}

function bump(
  buckets: Map<string, BucketCounts>,
  key: string,
  field: keyof BucketCounts,
) {
  const current = buckets.get(key) ?? emptyCounts();
  current[field] += 1;
  buckets.set(key, current);
}

export function buildStatsView(
  period: StatsPeriod,
  events: Array<{
    createdAt: Date;
    appliedAt: Date | null;
    source?: string | null;
    flowAt?: Date | null;
    rejectedAt?: Date | null;
    offerAt?: Date | null;
  }>,
  now = new Date(),
): StatsView {
  const todayKey = dateKeyInZone(now);
  const currentKey = bucketKey(todayKey, period);
  const buckets = new Map<string, BucketCounts>();

  for (const event of events) {
    if (event.source !== "manual") {
      bump(buckets, bucketKey(dateKeyInZone(event.createdAt), period), "analyses");
    }
    if (event.appliedAt) {
      bump(
        buckets,
        bucketKey(dateKeyInZone(event.appliedAt), period),
        "applications",
      );
    }
    if (event.flowAt) {
      bump(buckets, bucketKey(dateKeyInZone(event.flowAt), period), "flow");
    }
    if (event.rejectedAt) {
      bump(
        buckets,
        bucketKey(dateKeyInZone(event.rejectedAt), period),
        "rejected",
      );
    }
    if (event.offerAt) {
      bump(buckets, bucketKey(dateKeyInZone(event.offerAt), period), "offers");
    }
  }

  const keys = new Set<string>([currentKey, ...buckets.keys()]);
  const rows = [...keys]
    .sort((a, b) => (a < b ? 1 : a > b ? -1 : 0))
    .map((key) => {
      const counts = buckets.get(key) ?? emptyCounts();
      return {
        key,
        label: formatLabel(key, period),
        ...counts,
      };
    });

  const current = rows.find((row) => row.key === currentKey) ?? {
    key: currentKey,
    label: formatLabel(currentKey, period),
    ...emptyCounts(),
  };

  return {
    period,
    rows,
    current,
    totals: {
      analyses: events.filter((event) => event.source !== "manual").length,
      applications: events.filter((event) => event.appliedAt).length,
      flow: events.filter((event) => event.flowAt).length,
      rejected: events.filter((event) => event.rejectedAt).length,
      offers: events.filter((event) => event.offerAt).length,
    },
  };
}
