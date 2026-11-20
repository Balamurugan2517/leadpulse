CREATE TABLE IF NOT EXISTS "business_digital_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"asset_type" varchar(50) NOT NULL,
	"url" text NOT NULL,
	"status" varchar(50) DEFAULT 'ACTIVE' NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "businesses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"category" varchar(100) NOT NULL,
	"industry" varchar(100),
	"description" text,
	"phone" varchar(50),
	"email" varchar(255),
	"whatsapp_number" varchar(50),
	"address_line1" text,
	"city" varchar(100) DEFAULT 'Chennai' NOT NULL,
	"state" varchar(100) DEFAULT 'Tamil Nadu' NOT NULL,
	"country" varchar(100) DEFAULT 'India' NOT NULL,
	"postal_code" varchar(20),
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"google_place_id" varchar(255),
	"source_type" varchar(50) NOT NULL,
	"source_url" text,
	"source_retrieved_at" timestamp with time zone DEFAULT now() NOT NULL,
	"verification_status" varchar(50) DEFAULT 'UNVERIFIED' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "communication_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"channel" varchar(50) NOT NULL,
	"interaction_type" varchar(50) NOT NULL,
	"outcome_summary" text,
	"follow_up_scheduled_for" timestamp with time zone,
	"recorded_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "jobs_queue" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"task_type" varchar(100) NOT NULL,
	"payload" jsonb NOT NULL,
	"status" varchar(50) DEFAULT 'PENDING' NOT NULL,
	"retry_count" integer DEFAULT 0 NOT NULL,
	"max_retries" integer DEFAULT 3 NOT NULL,
	"last_error" text,
	"locked_at" timestamp with time zone,
	"locked_by" varchar(100),
	"scheduled_for" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lead_scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"need_fit_score" numeric(5, 2) DEFAULT '0' NOT NULL,
	"intent_score" numeric(5, 2) DEFAULT '0' NOT NULL,
	"business_fit_score" numeric(5, 2) DEFAULT '0' NOT NULL,
	"reachability_score" numeric(5, 2) DEFAULT '0' NOT NULL,
	"evidence_confidence" numeric(5, 2) DEFAULT '0' NOT NULL,
	"priority_score" numeric(5, 2) DEFAULT '0' NOT NULL,
	"demand_tier" varchar(50) DEFAULT 'LOW_DEMAND' NOT NULL,
	"recommended_services" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"score_reasons" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"calculated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "lead_scores_business_id_unique" UNIQUE("business_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "leads_pipeline" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"workspace_id" uuid NOT NULL,
	"stage" varchar(50) DEFAULT 'DISCOVERED' NOT NULL,
	"deal_value_estimate" numeric(12, 2),
	"lost_reason" text,
	"next_follow_up_date" date,
	"assigned_to" uuid,
	"last_contacted_at" timestamp with time zone,
	"notes_summary" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "leads_pipeline_business_id_unique" UNIQUE("business_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "outreach_drafts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"channel" varchar(50) NOT NULL,
	"recipient_target" varchar(255) NOT NULL,
	"subject" varchar(255),
	"body_text" text NOT NULL,
	"status" varchar(50) DEFAULT 'DRAFT' NOT NULL,
	"evidence_referenced" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"ip_address" varchar(45),
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "website_audits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"target_url" text NOT NULL,
	"final_url" text,
	"http_status" integer,
	"dns_resolves" boolean DEFAULT false NOT NULL,
	"ssl_valid" boolean DEFAULT false NOT NULL,
	"ssl_expires_at" timestamp with time zone,
	"redirect_count" integer DEFAULT 0 NOT NULL,
	"is_mobile_responsive" boolean,
	"lighthouse_performance" numeric(4, 1),
	"lighthouse_accessibility" numeric(4, 1),
	"lighthouse_seo" numeric(4, 1),
	"has_contact_form" boolean,
	"has_booking_engine" boolean,
	"has_whatsapp_button" boolean,
	"raw_findings" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"audit_completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workspaces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "workspaces_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "business_digital_assets" ADD CONSTRAINT "business_digital_assets_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "businesses" ADD CONSTRAINT "businesses_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "communication_logs" ADD CONSTRAINT "communication_logs_lead_id_leads_pipeline_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads_pipeline"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "jobs_queue" ADD CONSTRAINT "jobs_queue_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lead_scores" ADD CONSTRAINT "lead_scores_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "leads_pipeline" ADD CONSTRAINT "leads_pipeline_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "leads_pipeline" ADD CONSTRAINT "leads_pipeline_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "outreach_drafts" ADD CONSTRAINT "outreach_drafts_lead_id_leads_pipeline_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads_pipeline"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "website_audits" ADD CONSTRAINT "website_audits_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_assets_business" ON "business_digital_assets" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_businesses_workspace" ON "businesses" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_businesses_category" ON "businesses" USING btree ("category");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_businesses_city" ON "businesses" USING btree ("city");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_jobs_status_scheduled" ON "jobs_queue" USING btree ("status","scheduled_for");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_jobs_workspace" ON "jobs_queue" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_pipeline_workspace_stage" ON "leads_pipeline" USING btree ("workspace_id","stage");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_pipeline_business" ON "leads_pipeline" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_audits_business" ON "website_audits" USING btree ("business_id");