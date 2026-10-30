import {
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import {
  institutionKindEnum,
  institutionStatusEnum,
} from "./enums.js";

export const institutions = pgTable("institutions", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", {
    length: 255,
  }).notNull(),

  kind: institutionKindEnum("kind").notNull(),

  governorate: varchar("governorate", {
    length: 100,
  }),

  status: institutionStatusEnum("status")
    .notNull()
    .default("active"),

  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date", // for ts
  })
    .notNull()
    .defaultNow(),
});

export type Institution = typeof institutions.$inferSelect;
export type NewInstitution = typeof institutions.$inferInsert;