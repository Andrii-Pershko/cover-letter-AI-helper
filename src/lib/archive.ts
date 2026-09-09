export function parseArchiveFlag(value: string | undefined): boolean {
  return value === "1" || value === "true";
}

export function hrefWithArchive(
  pathname: string,
  showArchive: boolean,
  extra?: Record<string, string | undefined>,
): string {
  const params = new URLSearchParams();
  if (extra) {
    for (const [key, item] of Object.entries(extra)) {
      if (item) params.set(key, item);
    }
  }
  if (showArchive) params.set("archive", "1");
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}
