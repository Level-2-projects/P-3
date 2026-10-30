import {
  index,
  integer,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
  text,
} from "drizzle-orm/pg-core";

import {
  userRoleEnum,
  userStatusEnum,
} from "./enums.js";

import { institutions } from "./institutions.js";
import { bloodCenters } from "./blood-centers.js";

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    institutionId: uuid("institution_id")
      .notNull()
      .references(() => institutions.id, {
        onDelete: "restrict", // Prevent deletion of an institution if there are users associated with it
      }),

    centerId: uuid("center_id").references(
      () => bloodCenters.id,
      {
        onDelete: "set null", // If the referenced blood center is deleted, set the centerId to null    
      },
    ),

    role: userRoleEnum("role").notNull(),

    email: varchar("email", {
      length: 255,
    }).notNull(),

    passwordHash: text("password_hash").notNull(),

    professionalLicenseNo: varchar(
      "professional_license_no",
      {
        length: 100,
      },
    ),

    status: userStatusEnum("status")
      .notNull()
      .default("active"),

    failedLogins: integer("failed_logins")
      .notNull()
      .default(0),

    lockedUntil: timestamp("locked_until", {
      withTimezone: true,
      mode: "date",
    }),

    lastLoginAt: timestamp("last_login_at", {
      withTimezone: true,
      mode: "date",
    }),

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
    emailUnique: uniqueIndex(
      "users_email_unique_idx",
    ).on(table.email), // Create a unique index on the email column to ensure no two users can have the same email

    institutionIndex: index(
      "users_institution_idx",
    ).on(table.institutionId), // Create an index on the institutionId column for faster lookups

    centerIndex: index("users_center_idx").on(
      table.centerId, //:)
    ),
  }),
);

export type User = typeof users.$inferSelect; // This type represents the shape of a user record when selected from the database
export type NewUser = typeof users.$inferInsert; // This type represents the shape of a new user record when inserting into the database