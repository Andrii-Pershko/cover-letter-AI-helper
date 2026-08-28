"use client";

import { getAppVersionLabel } from "@/lib/app-version";
import { logout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Columns3,
  FileSearch,
  Layers,
  LogIn,
  LogOut,
  Mail,
  UserPlus,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

const nav = [
  { href: "/", label: "Аналіз", icon: FileSearch },
  { href: "/monitoring", label: "Моніторинг", icon: Columns3 },
  { href: "/stats", label: "Статистика", icon: BarChart3 },
  { href: "/profile", label: "Профіль", icon: UserRound },
  { href: "/projects", label: "Проєкти", icon: Layers },
  { href: "/examples", label: "Ідеальні CL", icon: Mail },
];

const authNav = [
  { href: "/login", label: "Вхід", icon: LogIn },
  { href: "/register", label: "Реєстрація", icon: UserPlus },
];

function isActivePath(href: string, pathname: string) {
  if (href === "/") return pathname === "/" || pathname.startsWith("/analyses");
  return pathname === href;
}

export function AppShell({
  children,
  email,
}: {
  children: React.ReactNode;
  email: string | null;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const items = isAuthPage ? authNav : nav;
  const navRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pill, setPill] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);
  const [animatePill, setAnimatePill] = useState(false);

  const updatePill = useCallback(() => {
    const navEl = navRef.current;
    const active = navEl?.querySelector<HTMLElement>("[data-active='true']");
    if (!navEl || !active) {
      setPill(null);
      return;
    }
    setPill({
      x: active.offsetLeft,
      y: active.offsetTop,
      w: active.offsetWidth,
      h: active.offsetHeight,
    });
  }, []);

  useLayoutEffect(() => {
    updatePill();
    const frame = requestAnimationFrame(() => setAnimatePill(true));
    return () => cancelAnimationFrame(frame);
  }, [pathname, items, updatePill]);

  useEffect(() => {
    const navEl = navRef.current;
    if (!navEl) return;

    const observer = new ResizeObserver(() => updatePill());
    observer.observe(navEl);
    window.addEventListener("resize", updatePill);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updatePill);
    };
  }, [updatePill]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <div className="flex min-h-dvh flex-col p-2.5 sm:p-4 lg:p-6">
      <div
        className="glass-shell relative mx-auto flex w-full max-w-[1280px] flex-1 flex-col overflow-hidden lg:flex-row"
      >
        <header className="relative z-50 flex items-center justify-between border-b border-white/25 px-4 py-3 lg:hidden">
          <Link href={email ? "/" : "/login"} className="min-w-0 cursor-pointer px-0.5">
            <span className="block text-lg font-semibold tracking-tight text-ink">
              AI-CL
            </span>
            <span className="mt-0.5 block text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
              Match & letter
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <span
              className="font-mono text-[10px] tracking-wide text-muted"
              title="Версія додатка"
            >
              {getAppVersionLabel()}
            </span>
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Закрити меню" : "Відкрити меню"}
              onClick={() => setMenuOpen((open) => !open)}
              className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-2xl text-ink transition-colors duration-200 hover:bg-white/35"
            >
            <span className="relative block h-3.5 w-5">
              <span
                className={cn(
                  "absolute left-0 top-0 h-0.5 w-full rounded-full bg-ink transition-all duration-200",
                  menuOpen && "top-[6px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-[6px] h-0.5 w-full rounded-full bg-ink transition-all duration-200",
                  menuOpen && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-[12px] h-0.5 w-full rounded-full bg-ink transition-all duration-200",
                  menuOpen && "top-[6px] -rotate-45",
                )}
              />
            </span>
          </button>
          </div>
        </header>

        <span
          className="pointer-events-none absolute right-5 top-4 z-40 hidden font-mono text-[11px] tracking-wide text-muted lg:block"
          title="Версія додатка"
        >
          {getAppVersionLabel()}
        </span>

        <div
          id="mobile-menu"
          hidden={!menuOpen}
          inert={!menuOpen ? true : undefined}
          className={cn(
            "absolute inset-0 z-40 lg:hidden",
            menuOpen ? "pointer-events-auto" : "pointer-events-none",
          )}
        >
          <button
            type="button"
            aria-label="Закрити меню"
            onClick={() => setMenuOpen(false)}
            className={cn(
              "absolute inset-0 cursor-pointer bg-[rgb(20_48_44_/_0.22)] backdrop-blur-[6px] transition-opacity duration-200",
              menuOpen ? "opacity-100" : "opacity-0",
            )}
          />
          <div
            className={cn(
              "absolute inset-x-0 top-0 px-4 pb-5 pt-[5.5rem] transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
              menuOpen
                ? "translate-y-0 opacity-100"
                : "-translate-y-3 opacity-0",
            )}
          >
            <div className="glass-card p-3 !bg-white/70">
              <nav className="flex flex-col gap-1">
                {items.map((item) => {
                  const Icon = item.icon;
                  const active = isActivePath(item.href, pathname);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "flex cursor-pointer items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors duration-200",
                        active
                          ? "bg-accent text-white"
                          : "text-muted hover:bg-white/35 hover:text-ink",
                      )}
                    >
                      <Icon className="size-4 shrink-0" aria-hidden />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              {!isAuthPage && email ? (
                <div className="mt-3 flex items-center gap-2.5 border-t border-white/30 px-1 pt-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/50 bg-white/40 text-xs font-semibold text-ink shadow-[0_1px_0_rgb(255_255_255_/_0.7)_inset]">
                    {email.slice(0, 1).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-ink">
                      {email}
                    </p>
                    <form action={logout}>
                      <Button
                        type="submit"
                        variant="ghost"
                        className="h-auto px-0 py-0.5 text-xs"
                      >
                        <LogOut className="size-3" aria-hidden />
                        Вийти
                      </Button>
                    </form>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <aside className="hidden shrink-0 flex-col gap-6 overflow-y-auto border-white/25 px-5 py-7 lg:flex lg:w-60 lg:border-r">
          <Link href={email ? "/" : "/login"} className="shrink-0 cursor-pointer px-1">
            <span className="block text-lg font-semibold tracking-tight text-ink">
              AI-CL
            </span>
            <span className="mt-0.5 block text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
              Match & letter
            </span>
          </Link>

          <div className="flex flex-col gap-4">
            <nav ref={navRef} className="relative -mx-1 flex flex-col">
              {pill ? (
                <span
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute rounded-2xl bg-accent shadow-[0_8px_22px_rgb(44_185_164_/_0.32)]",
                    animatePill
                      ? "transition-[transform,width,height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                      : "",
                  )}
                  style={{
                    width: pill.w,
                    height: pill.h,
                    transform: `translate(${pill.x}px, ${pill.y}px)`,
                  }}
                />
              ) : null}
              {items.map((item) => {
                const Icon = item.icon;
                const active = isActivePath(item.href, pathname);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    data-active={active ? "true" : undefined}
                    className={cn(
                      "relative z-10 flex cursor-pointer items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors duration-200",
                      active
                        ? "text-white"
                        : "text-muted hover:bg-white/35 hover:text-ink",
                      active &&
                      !pill &&
                      "bg-accent shadow-[0_8px_22px_rgb(44_185_164_/_0.32)]",
                    )}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {!isAuthPage && email ? (
              <div className="flex items-center gap-2.5 px-1">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/50 bg-white/40 text-xs font-semibold text-ink shadow-[0_1px_0_rgb(255_255_255_/_0.7)_inset]">
                  {email.slice(0, 1).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-ink">{email}</p>
                  <form action={logout}>
                    <Button
                      type="submit"
                      variant="ghost"
                      className="h-auto px-0 py-0.5 text-xs"
                    >
                      <LogOut className="size-3" aria-hidden />
                      Вийти
                    </Button>
                  </form>
                </div>
              </div>
            ) : null}
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-9">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
