CREATE TYPE "public"."audit_outcome" AS ENUM('success', 'failed', 'denied');--> statement-breakpoint
CREATE TYPE "public"."center_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."center_type" AS ENUM('collection', 'storage');--> statement-breakpoint
CREATE TYPE "public"."institution_kind" AS ENUM('hospital', 'university', 'health_body');--> statement-breakpoint
CREATE TYPE "public"."institution_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."license_activity" AS ENUM('collect', 'test', 'store', 'issue');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('treating_doctor', 'center_physician', 'blood_bank_manager', 'lab_tech', 'reception_nurse', 'facility_admin', 'system_admin');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('active', 'inactive', 'suspended');--> statement-breakpoint
CREATE TABLE "institutions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"kind" "institution_kind" NOT NULL,
	"governorate" varchar(100),
	"status" "institution_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blood_centers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" "center_type" NOT NULL,
	"institution_id" uuid,
	"latitude" varchar(30),
	"longitude" varchar(30),
	"status" "center_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "center_licenses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"center_id" uuid NOT NULL,
	"activity" "license_activity" NOT NULL,
	"license_no" varchar(100) NOT NULL,
	"valid_from" timestamp with time zone NOT NULL,
	"valid_to" timestamp with time zone NOT NULL,
	"verified_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"institution_id" uuid NOT NULL,
	"center_id" uuid,
	"role" "user_role" NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"professional_license_no" varchar(100),
	"status" "user_status" DEFAULT 'active' NOT NULL,
	"failed_logins" integer DEFAULT 0 NOT NULL,
	"locked_until" timestamp with time zone,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" varchar(128) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"ip" varchar(64),
	"user_agent_hash" varchar(128),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recorded_at" timestamp with time zone DEFAULT now() NOT NULL,
	"event_at" timestamp with time zone DEFAULT now() NOT NULL,
	"actor_id" uuid,
	"actor_role" varchar(50),
	"institution_id" uuid,
	"center_id" uuid,
	"action" varchar(100) NOT NULL,
	"entity_type" varchar(100) NOT NULL,
	"entity_id" varchar(100),
	"outcome" "audit_outcome" NOT NULL,
	"request_id" varchar(100),
	"meta" jsonb
);
--> statement-breakpoint
ALTER TABLE "blood_centers" ADD CONSTRAINT "blood_centers_institution_id_institutions_id_fk" FOREIGN KEY ("institution_id") REFERENCES "public"."institutions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "center_licenses" ADD CONSTRAINT "center_licenses_center_id_blood_centers_id_fk" FOREIGN KEY ("center_id") REFERENCES "public"."blood_centers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_institution_id_institutions_id_fk" FOREIGN KEY ("institution_id") REFERENCES "public"."institutions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_center_id_blood_centers_id_fk" FOREIGN KEY ("center_id") REFERENCES "public"."blood_centers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "blood_centers_institution_idx" ON "blood_centers" USING btree ("institution_id");--> statement-breakpoint
CREATE INDEX "center_licenses_center_idx" ON "center_licenses" USING btree ("center_id");--> statement-breakpoint
CREATE UNIQUE INDEX "center_license_unique_idx" ON "center_licenses" USING btree ("center_id","activity","license_no");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_unique_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_institution_idx" ON "users" USING btree ("institution_id");--> statement-breakpoint
CREATE INDEX "users_center_idx" ON "users" USING btree ("center_id");--> statement-breakpoint
CREATE UNIQUE INDEX "sessions_token_hash_unique_idx" ON "sessions" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "sessions_user_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_expiry_idx" ON "sessions" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "audit_events_action_idx" ON "audit_events" USING btree ("action");--> statement-breakpoint
CREATE INDEX "audit_events_actor_idx" ON "audit_events" USING btree ("actor_id");--> statement-breakpoint
CREATE INDEX "audit_events_recorded_at_idx" ON "audit_events" USING btree ("recorded_at");