import { jwtVerify, SignJWT } from "jose";

export type AuthPayload = {
  userId: string;
  email: string;
};

const TOKEN_TTL = "30d";

function getSecret() {
  const value = process.env.JWT_SECRET;
  if (!value || value.length < 32) {
    throw new Error("JWT_SECRET має бути щонайменше 32 символи");
  }
  return new TextEncoder().encode(value);
}

export async function signAuthToken(user: AuthPayload): Promise<string> {
  return new SignJWT({ email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.userId)
    .setIssuedAt()
    .setExpirationTime(TOKEN_TTL)
    .sign(getSecret());
}

export async function verifyAuthToken(token: string): Promise<AuthPayload> {
  const { payload } = await jwtVerify(token, getSecret());
  const email = payload.email;
  if (!payload.sub || typeof email !== "string") {
    throw new Error("Невалідний токен");
  }
  return { userId: payload.sub, email };
}
