import {
  createHash,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";

export const SESSION_COOKIE_NAME = "bloodnet_session";

export function createSessionToken(): string {
  return randomBytes(32).toString("hex");
}

export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function hashUserAgent(
  userAgent: string | undefined,
): string | null {
  if (!userAgent) {
    return null;
  }

  return createHash("sha256").update(userAgent).digest("hex");
}

export function getSessionExpiry(): Date {
  const ttlDays = Number(process.env.SESSION_TTL_DAYS ?? 1);

  if (!Number.isFinite(ttlDays) || ttlDays <= 0) {
    throw new Error("SESSION_TTL_DAYS must be a positive number");
  }

  return new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);
}

export function isProduction(): boolean {
  return process.env.APP_ENV === "production";
}

export function getSessionToken(
  cookieHeader: string | undefined,
): string | null {
  if (!cookieHeader) {
    return null;
  }

  const cookie = cookieHeader
    .split(";")
    .map((item) => item.trim())
    .find((item) =>
      item.startsWith(`${SESSION_COOKIE_NAME}=`),
    );

  if (!cookie) {
    return null;
  }

  const token = cookie.slice(
    `${SESSION_COOKIE_NAME}=`.length,
  );

  return token.length > 0 ? token : null;
}

export function setSessionCookie(
  response: {
    setHeader: (name: string, value: string) => void;
  },
  token: string,
  expiresAt: Date,
): void {
  const parts = [
    `${SESSION_COOKIE_NAME}=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Expires=${expiresAt.toUTCString()}`,
  ];

  if (isProduction()) {
    parts.push("Secure");
  }

  response.setHeader("Set-Cookie", parts.join("; "));
}

export function clearSessionCookie(response: {
  setHeader: (name: string, value: string) => void;
}): void {
  const parts = [
    `${SESSION_COOKIE_NAME}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
  ];

  if (isProduction()) {
    parts.push("Secure");
  }

  response.setHeader("Set-Cookie", parts.join("; "));
}

export function safeStringEqual(
  left: string,
  right: string,
): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}