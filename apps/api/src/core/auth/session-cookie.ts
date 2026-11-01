
function getCookieAttributes(): string[] {
  const attributes = [
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
  ];

  if (process.env.APP_ENV === "production") {
    attributes.push("Secure");
  }

  return attributes;
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
      item.startsWith(`${process.env.SESSION_COOKIE_NAME}=`),
    );

  if (!cookie) {
    return null;
  }

  const token = cookie.slice(
    `${process.env.SESSION_COOKIE_NAME}=`.length,
  );

  return token.length > 0 ? token : null;
}

export function setSessionCookie(
  response: {
    setHeader(name: string, value: string): void;
  },
  token: string,
  expiresAt: Date,
): void {
  const cookie = [
    `${process.env.SESSION_COOKIE_NAME}=${token}`,
    ...getCookieAttributes(),
    `Expires=${expiresAt.toUTCString()}`,
  ];

  response.setHeader("Set-Cookie", cookie.join("; "));
}

export function clearSessionCookie(response: {
  setHeader(name: string, value: string): void;
}): void {
  const cookie = [
    `${process.env.SESSION_COOKIE_NAME}=`,
    ...getCookieAttributes(),
    "Max-Age=0",
  ];

  response.setHeader("Set-Cookie", cookie.join("; "));
}