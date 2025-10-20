import { defineConfig } from "drizzle-kit"

const connectionString =
  process.env.NEON_DATABASE_URL ?? process.env.DATABASE_URL ?? ""

if (!connectionString) {
  throw new Error(
    "Missing database connection string. Set NEON_DATABASE_URL or DATABASE_URL.",
  )
}

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
  },
})
