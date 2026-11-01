import { and, eq, gt, isNull } from "drizzle-orm";

import { db } from "../index.js";
import {
  sessions,
  users,
  type NewSession,
  type User,
} from "../db/schema/index.js";

import {
  createSessionToken,
  hashSessionToken,
} from "./session-token.js";

export function getSessionExpiry(): Date {
  const ttlDays = Number(
    process.env.SESSION_TTL_DAYS ?? 1,
  );

  if (!Number.isFinite(ttlDays) || ttlDays <= 0) {
    throw new Error(
      "SESSION_TTL_DAYS must be a positive number",
    );
  }

  return new Date(
    Date.now() + ttlDays * 24 * 60 * 60 * 1000,
  );
}

export async function createSession(input: {
  userId: string;
  ip?: string;
  userAgentHash?: string | null;
}): Promise<{
  token: string;
  expiresAt: Date;
  sessionId: string;
}> {
  const token = createSessionToken();
  const tokenHash = hashSessionToken(token,process.env.COOKIE_SECRET as string);
  const expiresAt = getSessionExpiry();

  const newSession: NewSession = {
    userId: input.userId,
    tokenHash,
    expiresAt,
    ip: input.ip,
    userAgentHash: input.userAgentHash,
  };

  const [session] = await db
    .insert(sessions)
    .values(newSession)
    .returning({
      id: sessions.id,
      expiresAt: sessions.expiresAt,
    });

  if (!session) {
    throw new Error("Failed to create session");
  }

  return {
    token,
    expiresAt: session.expiresAt,
    sessionId: session.id,
  };
}

export async function findSessionByToken(
  token: string,
): Promise<{
  sessionId: string;
  user: User;
} | null> {
  const tokenHash = hashSessionToken(token,process.env.COOKIE_SECRET as string);

  const [result] = await db
    .select({
      sessionId: sessions.id,
      user: users,
    })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(
      and(
        eq(sessions.tokenHash, tokenHash),
        isNull(sessions.revokedAt),
        gt(sessions.expiresAt, new Date()),
      ),
    )
    .limit(1);

  if (!result || result.user.status !== "active") {
    return null;
  }

  return result;
}

export async function revokeSession(
  token: string,
): Promise<void> {
  await db
    .update(sessions)
    .set({
      revokedAt: new Date(),
    })
    .where(
      and(
        eq(sessions.tokenHash, hashSessionToken(token,process.env.COOKIE_SECRET as string)),
        isNull(sessions.revokedAt),
      ),
    );
}