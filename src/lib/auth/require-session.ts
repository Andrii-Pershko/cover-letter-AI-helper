import { redirect } from "next/navigation";
import { verifyAuthToken, type AuthPayload } from "./jwt";
import { readAuthCookie } from "./session";

export async function getSession(): Promise<AuthPayload | null> {
  const token = await readAuthCookie();
  if (!token) return null;
  try {
    return await verifyAuthToken(token);
  } catch {
    return null;
  }
}

export async function requireSession(): Promise<AuthPayload> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}
