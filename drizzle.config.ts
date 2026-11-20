
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  // Existing PostgreSQL schema
  schema: "./packages/infrastructure/src/db/schema.ts",

  // Generated migration files
  out: "./drizzle",

  // Database dialect
  dialect: "postgresql",

  // Use Neon direct (unpooled) connection for migrations
  dbCredentials: {
    url: process.env.DATABASE_URL_UNPOOLED!,
  },

  // Migration safety and logging
  strict: true,
  verbose: true,
});
