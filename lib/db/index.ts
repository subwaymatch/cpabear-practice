import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"
import * as schema from "./schema"

const connectionString =
  process.env.NEON_DATABASE_URL ?? process.env.DATABASE_URL ?? ""

if (!connectionString) {
  throw new Error(
    "Missing database connection string. Set NEON_DATABASE_URL or DATABASE_URL.",
  )
}

const sql = neon(connectionString)

export const db = drizzle(sql, { schema })
