import { cookies } from "next/headers";
import { AUTH_COOKIE } from "./constants";

export { AUTH_COOKIE };

const MAX_AGE = 60 * 60 * 24 * 30;

function cookieSecure() {
  if (process.env.COOKIE_SECURE === "true") return true;
  if (process.env.COOKIE_SECURE === "false") return false;
  return process.env.NODE_ENV === "production";
}

export async function setAuthCookie(token: string) {
  const jar = await cookies();
  jar.set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: cookieSecure(),
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearAuthCookie() {
  const jar = await cookies();
  jar.delete(AUTH_COOKIE);
}

export async function readAuthCookie() {
  const jar = await cookies();
  return jar.get(AUTH_COOKIE)?.value ?? null;
}
