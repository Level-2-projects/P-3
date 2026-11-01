import { createHmac, randomBytes } from "node:crypto";

export function createSessionToken(): string {
  return randomBytes(32).toString("hex"); // This is commonly used for generating secure session tokens.
}

export function hashSessionToken(token: string, secret: string): string {
  return createHmac("sha256",secret) //:)
  .update(token).digest("hex");
}