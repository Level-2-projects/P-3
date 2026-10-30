import {
  index,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { users } from "./users.js";

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    tokenHash: varchar("token_hash", {
      length: 128,
    }).notNull(),

    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),

    revokedAt: timestamp("revoked_at", {
      withTimezone: true,
      mode: "date",
    }),

    ip: varchar("ip", {
      length: 64,
    }),

    userAgentHash: varchar("user_agent_hash", {
      length: 128,
    }),

    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    tokenUnique: uniqueIndex(
      "sessions_token_hash_unique_idx",
    ).on(table.tokenHash),

    userIndex: index("sessions_user_idx").on(
      table.userId,
    ),

    expiryIndex: index("sessions_expiry_idx").on(
      table.expiresAt,
    ),
  }),
);

export type Session = typeof sessions.$inferSelect; 
export type NewSession = typeof sessions.$inferInsert;
