import {
  index,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import {
  centerStatusEnum,
  centerTypeEnum,
} from "./enums.js";

import { institutions } from "./institutions.js";

export const bloodCenters = pgTable(
  "blood_centers",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: varchar("name", {
      length: 255,
    }).notNull(),

    type: centerTypeEnum("type").notNull(),

    institutionId: uuid("institution_id").references(
      () => institutions.id,
      {
        onDelete: "set null", // If the referenced institution is deleted, set the institutionId to null
      },
    ),

    latitude: varchar("latitude", {
      length: 30,
    }),

    longitude: varchar("longitude", {
      length: 30,
    }),

    status: centerStatusEnum("status")
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
      mode: "date",
    })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    institutionIndex: index(
      "blood_centers_institution_idx",
    ).on(table.institutionId), // Create an index on the institutionId column for faster lookups
  }),
);

export type BloodCenter = typeof bloodCenters.$inferSelect;

export type NewBloodCenter = typeof bloodCenters.$inferInsert;