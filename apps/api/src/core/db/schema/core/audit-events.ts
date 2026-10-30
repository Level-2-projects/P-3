import {
  index,
  jsonb,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { auditOutcomeEnum } from "./enums.js";

export const auditEvents = pgTable(
  "audit_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    recordedAt: timestamp("recorded_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),

    eventAt: timestamp("event_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),

    actorId: uuid("actor_id"),

    actorRole: varchar("actor_role", {
      length: 50,
    }),

    institutionId: uuid("institution_id"),

    centerId: uuid("center_id"),

    action: varchar("action", {
      length: 100,
    }).notNull(),

    entityType: varchar("entity_type", {
      length: 100,
    }).notNull(),

    entityId: varchar("entity_id", {
      length: 100,
    }),

    outcome: auditOutcomeEnum("outcome").notNull(),

    requestId: varchar("request_id", {
      length: 100,
    }),

    // jsonb column to store additional metadata related to the audit event
    meta: jsonb("meta"),
  },
  (table) => ({
    actionIndex: index("audit_events_action_idx").on(
      table.action,
    ),

    actorIndex: index("audit_events_actor_idx").on(
      table.actorId,
    ),

    recordedAtIndex: index(
      "audit_events_recorded_at_idx",
    ).on(table.recordedAt),
  }),
);

export type AuditEvent =
  typeof auditEvents.$inferSelect;

export type NewAuditEvent =
  typeof auditEvents.$inferInsert;