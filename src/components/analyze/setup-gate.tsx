import Link from "next/link";
import type { SetupStatus } from "@/lib/setup";

export function SetupGate({ setup }: { setup: SetupStatus }) {
  if (setup.ready) return null;

  return (
    <div className="rounded-[22px] border border-[rgb(232_180_80_/_0.28)] bg-[rgb(255_236_200_/_0.45)] px-5 py-4 text-sm text-[#7a5410] shadow-[0_8px_24px_rgb(22_72_66_/_0.04)] backdrop-blur-md">
      <p className="font-medium">Щоб запускати аналіз, заповни вводні дані:</p>
      <ul className="mt-2 flex flex-col gap-1">
        {setup.missing.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="cursor-pointer font-medium text-ink underline-offset-2 transition-colors hover:text-accent hover:underline"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
