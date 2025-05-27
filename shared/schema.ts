import { pgTable, text, serial, integer, boolean, timestamp, real, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // chest, back, legs, arms, shoulders, core, cardio
  muscleGroups: text("muscle_groups").array().notNull(),
  instructions: text("instructions").array().notNull(),
  equipment: text("equipment"),
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced
  imageUrl: text("image_url"),
});

export const workoutPlans = pgTable("workout_plans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  exercises: json("exercises").$type<Array<{
    exerciseId: number;
    sets: number;
    reps: string; // e.g., "8-10", "12-15", "AMRAP"
    restTime: number; // seconds
    weight?: number;
  }>>().notNull(),
  estimatedDuration: integer("estimated_duration"), // minutes
  createdAt: timestamp("created_at").defaultNow(),
});

export const workoutSessions = pgTable("workout_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  workoutPlanId: integer("workout_plan_id").references(() => workoutPlans.id),
  name: text("name").notNull(),
  startTime: timestamp("start_time").defaultNow(),
  endTime: timestamp("end_time"),
  notes: text("notes"),
});

export const sets = pgTable("sets", {
  id: serial("id").primaryKey(),
  workoutSessionId: integer("workout_session_id").references(() => workoutSessions.id).notNull(),
  exerciseId: integer("exercise_id").references(() => exercises.id).notNull(),
  setNumber: integer("set_number").notNull(),
  reps: integer("reps"),
  weight: real("weight"),
  duration: integer("duration"), // seconds for timed exercises
  distance: real("distance"), // for cardio
  restTime: integer("rest_time"), // seconds
  completed: boolean("completed").default(false),
});

export const personalRecords = pgTable("personal_records", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  exerciseId: integer("exercise_id").references(() => exercises.id).notNull(),
  weight: real("weight"),
  reps: integer("reps"),
  distance: real("distance"),
  duration: integer("duration"),
  achievedAt: timestamp("achieved_at").defaultNow(),
});

export const nutritionEntries = pgTable("nutrition_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  date: timestamp("date").defaultNow(),
  mealType: text("meal_type"), // breakfast, lunch, dinner, snack
  foodName: text("food_name").notNull(),
  calories: integer("calories"),
  protein: real("protein"), // grams
  carbs: real("carbs"), // grams
  fat: real("fat"), // grams
  quantity: real("quantity"),
  unit: text("unit"), // grams, oz, cup, etc.
});

export const userStats = pgTable("user_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  date: timestamp("date").defaultNow(),
  weight: real("weight"),
  bodyFat: real("body_fat"),
  waterIntake: real("water_intake"), // liters
  sleepHours: real("sleep_hours"),
  stepsCount: integer("steps_count"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertExerciseSchema = createInsertSchema(exercises).omit({
  id: true,
});

export const insertWorkoutPlanSchema = createInsertSchema(workoutPlans).omit({
  id: true,
  createdAt: true,
});

export const insertWorkoutSessionSchema = createInsertSchema(workoutSessions).omit({
  id: true,
  startTime: true,
});

export const insertSetSchema = createInsertSchema(sets).omit({
  id: true,
});

export const insertPersonalRecordSchema = createInsertSchema(personalRecords).omit({
  id: true,
  achievedAt: true,
});

export const insertNutritionEntrySchema = createInsertSchema(nutritionEntries).omit({
  id: true,
  date: true,
});

export const insertUserStatsSchema = createInsertSchema(userStats).omit({
  id: true,
  date: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Exercise = typeof exercises.$inferSelect;
export type InsertExercise = z.infer<typeof insertExerciseSchema>;

export type WorkoutPlan = typeof workoutPlans.$inferSelect;
export type InsertWorkoutPlan = z.infer<typeof insertWorkoutPlanSchema>;

export type WorkoutSession = typeof workoutSessions.$inferSelect;
export type InsertWorkoutSession = z.infer<typeof insertWorkoutSessionSchema>;

export type Set = typeof sets.$inferSelect;
export type InsertSet = z.infer<typeof insertSetSchema>;

export type PersonalRecord = typeof personalRecords.$inferSelect;
export type InsertPersonalRecord = z.infer<typeof insertPersonalRecordSchema>;

export type NutritionEntry = typeof nutritionEntries.$inferSelect;
export type InsertNutritionEntry = z.infer<typeof insertNutritionEntrySchema>;

export type UserStats = typeof userStats.$inferSelect;
export type InsertUserStats = z.infer<typeof insertUserStatsSchema>;
