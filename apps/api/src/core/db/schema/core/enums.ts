import { pgEnum } from "drizzle-orm/pg-core";

export const institutionKindEnum = pgEnum("institution_kind", [
  "hospital",
  "university",
  "health_body",
]);

export const institutionStatusEnum = pgEnum("institution_status", [
  "active",
  "inactive",
]);

export const centerTypeEnum = pgEnum("center_type", [
  "collection",
  "storage",
]);

export const centerStatusEnum = pgEnum("center_status", [
  "active",
  "inactive",
]);

export const licenseActivityEnum = pgEnum("license_activity", [
  "collect",
  "test",
  "store",
  "issue",
]);

export const userRoleEnum = pgEnum("user_role", [
  "treating_doctor",
  "center_physician",
  "blood_bank_manager",
  "lab_tech",
  "reception_nurse",
  "facility_admin",
  "system_admin",
]);

export const userStatusEnum = pgEnum("user_status", [
  "active",
  "inactive",
  "suspended",
]);

export const auditOutcomeEnum = pgEnum("audit_outcome", [
  "success",
  "failed",
  "denied",
]);