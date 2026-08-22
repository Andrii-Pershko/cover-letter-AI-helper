import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AppShell } from "@/components/layout/app-shell";
import { getSession } from "@/lib/auth/require-session";
import "./globals.css";

const sans = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI-CL — match вакансії та cover letter",
  description:
    "Чесний match CV з вакансією і cover letter українською на основі твоїх кейсів та ідеальних листів.",
};

export const viewport: Viewport = {
  themeColor: "#2cb9a4",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await getSession();

  return (
    <html lang="uk" className={`${sans.variable} h-full antialiased`}>
      <body className={`${sans.className} min-h-full`}>
        <AppShell email={session?.email ?? null}>{children}</AppShell>
      </body>
    </html>
  );
}
