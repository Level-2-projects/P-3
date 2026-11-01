import type { User } from "../core/db/schema/core/users.js";

// for express Request type declaration merging
declare global {
  namespace Express {
    interface Request {
      user?: User;
      sessionId?: string;
    }
  }
}

export {};