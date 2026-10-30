import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./apps/api/src/core/db/schema/index.ts", // path to your schema file
  out: "./db/migrations", // path to your migrations folder
  dialect: "postgresql", //:)
  dbCredentials: {
    url: process.env.DATABASE_URL!, // your database connection string
  },
});