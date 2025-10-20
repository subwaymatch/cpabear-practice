import { pgTable, text, timestamp, uuid, boolean, jsonb, integer } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// Users table - BetterAuth will manage this
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  username: text("username").notNull().unique(),
  email: text("email"),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

// Sessions table - BetterAuth will manage this
export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
})

// Account table - BetterAuth will manage this for credentials
export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

// Verification table - BetterAuth will manage this
export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
})

// Roles enum
export type Role = "admin" | "editor" | "premium" | "free"

// User roles table (many-to-many)
export const userRole = pgTable("user_role", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  role: text("role").notNull().$type<Role>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

// MCQs table
export const mcq = pgTable("mcq", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  content: text("content").notNull(), // Markdown content
  explanation: text("explanation"), // Markdown explanation
  correctAnswer: text("correct_answer").notNull(),
  options: jsonb("options").notNull().$type<string[]>(),
  difficulty: text("difficulty").$type<"easy" | "medium" | "hard">(),
  topic: text("topic"),
  tags: jsonb("tags").$type<string[]>().default([]),
  createdBy: text("created_by")
    .notNull()
    .references(() => user.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

// Task-based Simulations table
export const simulation = pgTable("simulation", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  content: text("content").notNull(), // Markdown content
  solution: text("solution"), // Markdown solution
  difficulty: text("difficulty").$type<"easy" | "medium" | "hard">(),
  topic: text("topic"),
  tags: jsonb("tags").$type<string[]>().default([]),
  estimatedTime: integer("estimated_time"), // in minutes
  createdBy: text("created_by")
    .notNull()
    .references(() => user.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

// User progress for MCQs
export const mcqProgress = pgTable("mcq_progress", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  mcqId: uuid("mcq_id")
    .notNull()
    .references(() => mcq.id, { onDelete: "cascade" }),
  selectedAnswer: text("selected_answer"),
  isCorrect: boolean("is_correct"),
  attemptedAt: timestamp("attempted_at").notNull().defaultNow(),
})

// User progress for Simulations
export const simulationProgress = pgTable("simulation_progress", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  simulationId: uuid("simulation_id")
    .notNull()
    .references(() => simulation.id, { onDelete: "cascade" }),
  completed: boolean("completed").default(false),
  timeSpent: integer("time_spent"), // in minutes
  attemptedAt: timestamp("attempted_at").notNull().defaultNow(),
})

// Relations
export const userRelations = relations(user, ({ many }) => ({
  roles: many(userRole),
  mcqs: many(mcq),
  simulations: many(simulation),
  mcqProgress: many(mcqProgress),
  simulationProgress: many(simulationProgress),
}))

export const userRoleRelations = relations(userRole, ({ one }) => ({
  user: one(user, {
    fields: [userRole.userId],
    references: [user.id],
  }),
}))

export const mcqRelations = relations(mcq, ({ one, many }) => ({
  creator: one(user, {
    fields: [mcq.createdBy],
    references: [user.id],
  }),
  progress: many(mcqProgress),
}))

export const simulationRelations = relations(simulation, ({ one, many }) => ({
  creator: one(user, {
    fields: [simulation.createdBy],
    references: [user.id],
  }),
  progress: many(simulationProgress),
}))

export const mcqProgressRelations = relations(mcqProgress, ({ one }) => ({
  user: one(user, {
    fields: [mcqProgress.userId],
    references: [user.id],
  }),
  mcq: one(mcq, {
    fields: [mcqProgress.mcqId],
    references: [mcq.id],
  }),
}))

export const simulationProgressRelations = relations(simulationProgress, ({ one }) => ({
  user: one(user, {
    fields: [simulationProgress.userId],
    references: [user.id],
  }),
  simulation: one(simulation, {
    fields: [simulationProgress.simulationId],
    references: [simulation.id],
  }),
}))
