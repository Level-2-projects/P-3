import {
  index,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { licenseActivityEnum } from "./enums.js";
import { bloodCenters } from "./blood-centers.js";

export const centerLicenses = pgTable(
  "center_licenses",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    centerId: uuid("center_id")
      .notNull()
      .references(() => bloodCenters.id, {
        onDelete: "cascade", //if blood center is deleted , delete the license record as well
      }),

    activity: licenseActivityEnum("activity").notNull(),

    licenseNo: varchar("license_no", {
      length: 100,
    }).notNull(),

    validFrom: timestamp("valid_from", {
      withTimezone: true,
      mode: "date",
    }).notNull(),

    validTo: timestamp("valid_to", {
      withTimezone: true,
      mode: "date",
    }).notNull(),

    verifiedBy: uuid("verified_by"), // This field can be null if the license hasn't been verified yet

    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    centerIndex: index(
      "center_licenses_center_idx",
    ).on(table.centerId), // Create an index on the centerId column for faster lookups

    licenseUnique: uniqueIndex(
      "center_license_unique_idx",
    ).on(
      table.centerId,
      table.activity,
      table.licenseNo,
    ), // Create a unique index on the centerId, activity, and licenseNo columns
  }),
);

export type CenterLicense = typeof centerLicenses.$inferSelect;

export type NewCenterLicense = typeof centerLicenses.$inferInsert;