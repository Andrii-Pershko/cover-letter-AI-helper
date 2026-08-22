"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { signAuthToken } from "@/lib/auth/jwt";
import { clearAuthCookie, setAuthCookie } from "@/lib/auth/session";

export type AuthState = { error?: string } | null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export async function register(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!EMAIL_RE.test(email)) {
    return { error: "Вкажи коректний email" };
  }
  if (password.length < 8) {
    return { error: "Пароль має бути щонайменше 8 символів" };
  }
  if (password !== confirm) {
    return { error: "Паролі не збігаються" };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Користувач з таким email уже є" };
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.$transaction(async (tx) => {
    const created = await tx.user.create({
      data: { email, passwordHash },
    });
    const orphan = await tx.profile.findFirst({
      where: { userId: null },
      orderBy: { createdAt: "asc" },
    });
    if (orphan) {
      await tx.profile.update({
        where: { id: orphan.id },
        data: { userId: created.id },
      });
    } else {
      await tx.profile.create({
        data: { userId: created.id },
      });
    }
    return created;
  });

  const token = await signAuthToken({ userId: user.id, email: user.email });
  await setAuthCookie(token);
  redirect("/");
}

export async function login(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const password = String(formData.get("password") ?? "");

  if (!EMAIL_RE.test(email) || !password) {
    return { error: "Вкажи email і пароль" };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "Невірний email або пароль" };
  }

  const token = await signAuthToken({ userId: user.id, email: user.email });
  await setAuthCookie(token);
  redirect("/");
}

export async function logout() {
  await clearAuthCookie();
  redirect("/login");
}
