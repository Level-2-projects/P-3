import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { getSessionToken } from "./session-cookie.js";
import { findSessionByToken } from "./session-service.js";

export async function requireAuth(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const token = getSessionToken(request.headers.cookie);

  if (!token) {
    response.status(401).json({
      error: {
        code: "UNAUTHENTICATED",
        message: "Authentication is required",
      },
    });
    return;
  }

  const session = await findSessionByToken(token);

  if (!session) {
    response.status(401).json({
      error: {
        code: "INVALID_SESSION",
        message: "Session is invalid or expired",
      },
    });
    return;
  }

  request.user = session.user;
  request.sessionId = session.sessionId;

  next();
}