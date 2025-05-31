import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertExerciseSchema, 
  insertWorkoutPlanSchema, 
  insertWorkoutSessionSchema,
  insertSetSchema,
  insertPersonalRecordSchema,
  insertNutritionEntrySchema,
  insertUserStatsSchema
} from "@shared/schema";
import passport from 'passport';
import express from 'express';
import { hashPassword, generateToken } from './auth';

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Exercises
  app.get("/api/exercises", async (req, res) => {
    try {
      const { category, search } = req.query;
      
      let exercises;
      if (search) {
        exercises = await storage.searchExercises(search as string);
      } else if (category) {
        exercises = await storage.getExercisesByCategory(category as string);
      } else {
        exercises = await storage.getExercises();
      }
      
      res.json(exercises);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch exercises" });
    }
  });

  app.get("/api/exercises/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const exercise = await storage.getExercise(id);
      
      if (!exercise) {
        return res.status(404).json({ message: "Exercise not found" });
      }
      
      res.json(exercise);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch exercise" });
    }
  });

  app.post("/api/exercises", async (req, res) => {
    try {
      const exerciseData = insertExerciseSchema.parse(req.body);
      const exercise = await storage.createExercise(exerciseData);
      res.status(201).json(exercise);
    } catch (error) {
      res.status(400).json({ message: "Invalid exercise data" });
    }
  });

  // Workout Plans
  app.get("/api/workout-plans", async (req, res) => {
    try {
      const userId = 1; // Using default user for demo
      const plans = await storage.getWorkoutPlans(userId);
      res.json(plans);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch workout plans" });
    }
  });

  app.get("/api/workout-plans/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const plan = await storage.getWorkoutPlan(id);
      
      if (!plan) {
        return res.status(404).json({ message: "Workout plan not found" });
      }
      
      res.json(plan);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch workout plan" });
    }
  });

  app.post("/api/workout-plans", async (req, res) => {
    try {
      const planData = insertWorkoutPlanSchema.parse({
        ...req.body,
        userId: 1, // Using default user for demo
      });
      const plan = await storage.createWorkoutPlan(planData);
      res.status(201).json(plan);
    } catch (error) {
      res.status(400).json({ message: "Invalid workout plan data" });
    }
  });

  app.put("/api/workout-plans/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertWorkoutPlanSchema.partial().parse(req.body);
      const plan = await storage.updateWorkoutPlan(id, updates);
      
      if (!plan) {
        return res.status(404).json({ message: "Workout plan not found" });
      }
      
      res.json(plan);
    } catch (error) {
      res.status(400).json({ message: "Invalid workout plan data" });
    }
  });

  app.delete("/api/workout-plans/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteWorkoutPlan(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Workout plan not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete workout plan" });
    }
  });

  // Workout Sessions
  app.get("/api/workout-sessions", async (req, res) => {
    try {
      const userId = 1; // Using default user for demo
      const sessions = await storage.getWorkoutSessions(userId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch workout sessions" });
    }
  });

  app.get("/api/workout-sessions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const session = await storage.getWorkoutSession(id);
      
      if (!session) {
        return res.status(404).json({ message: "Workout session not found" });
      }
      
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch workout session" });
    }
  });

  app.post("/api/workout-sessions", async (req, res) => {
    try {
      const sessionData = insertWorkoutSessionSchema.parse({
        ...req.body,
        userId: 1, // Using default user for demo
      });
      const session = await storage.createWorkoutSession(sessionData);
      res.status(201).json(session);
    } catch (error) {
      res.status(400).json({ message: "Invalid workout session data" });
    }
  });

  app.put("/api/workout-sessions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertWorkoutSessionSchema.partial().parse(req.body);
      const session = await storage.updateWorkoutSession(id, updates);
      
      if (!session) {
        return res.status(404).json({ message: "Workout session not found" });
      }
      
      res.json(session);
    } catch (error) {
      res.status(400).json({ message: "Invalid workout session data" });
    }
  });

  // Sets
  app.get("/api/workout-sessions/:sessionId/sets", async (req, res) => {
    try {
      const sessionId = parseInt(req.params.sessionId);
      const sets = await storage.getSetsBySession(sessionId);
      res.json(sets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sets" });
    }
  });

  app.post("/api/sets", async (req, res) => {
    try {
      const setData = insertSetSchema.parse(req.body);
      const set = await storage.createSet(setData);
      res.status(201).json(set);
    } catch (error) {
      res.status(400).json({ message: "Invalid set data" });
    }
  });

  app.put("/api/sets/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertSetSchema.partial().parse(req.body);
      const set = await storage.updateSet(id, updates);
      
      if (!set) {
        return res.status(404).json({ message: "Set not found" });
      }
      
      res.json(set);
    } catch (error) {
      res.status(400).json({ message: "Invalid set data" });
    }
  });

  // Personal Records
  app.get("/api/personal-records", async (req, res) => {
    try {
      const userId = 1; // Using default user for demo
      const { exerciseId } = req.query;
      
      let records;
      if (exerciseId) {
        records = await storage.getPersonalRecordsByExercise(userId, parseInt(exerciseId as string));
      } else {
        records = await storage.getPersonalRecords(userId);
      }
      
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch personal records" });
    }
  });

  app.post("/api/personal-records", async (req, res) => {
    try {
      const recordData = insertPersonalRecordSchema.parse({
        ...req.body,
        userId: 1, // Using default user for demo
      });
      const record = await storage.createPersonalRecord(recordData);
      res.status(201).json(record);
    } catch (error) {
      res.status(400).json({ message: "Invalid personal record data" });
    }
  });

  // Nutrition
  app.get("/api/nutrition", async (req, res) => {
    try {
      const userId = 1; // Using default user for demo
      const { date } = req.query;
      
      let entries;
      if (date) {
        entries = await storage.getNutritionEntries(userId, new Date(date as string));
      } else {
        entries = await storage.getNutritionEntries(userId);
      }
      
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch nutrition entries" });
    }
  });

  app.post("/api/nutrition", async (req, res) => {
    try {
      const entryData = insertNutritionEntrySchema.parse({
        ...req.body,
        userId: 1, // Using default user for demo
      });
      const entry = await storage.createNutritionEntry(entryData);
      res.status(201).json(entry);
    } catch (error) {
      res.status(400).json({ message: "Invalid nutrition entry data" });
    }
  });

  // User Stats
  app.get("/api/user-stats", async (req, res) => {
    try {
      const userId = 1; // Using default user for demo
      const { startDate, endDate } = req.query;
      
      let stats;
      if (startDate && endDate) {
        stats = await storage.getUserStats(userId, {
          start: new Date(startDate as string),
          end: new Date(endDate as string),
        });
      } else {
        stats = await storage.getUserStats(userId);
      }
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  app.post("/api/user-stats", async (req, res) => {
    try {
      const statsData = insertUserStatsSchema.parse({
        ...req.body,
        userId: 1, // Using default user for demo
      });
      const stats = await storage.createUserStats(statsData);
      res.status(201).json(stats);
    } catch (error) {
      res.status(400).json({ message: "Invalid user stats data" });
    }
  });

  // Dashboard Stats
  app.get("/api/dashboard-stats", async (req, res) => {
    try {
      const userId = 1;
      const now = new Date();
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const workoutSessions = await storage.getWorkoutSessions(userId);
      const recentSessions = workoutSessions.filter(session => 
        session.startTime && new Date(session.startTime) >= weekStart
      );
      
      const totalWorkouts = recentSessions.length;
      const currentStreak = 5; // Mock data for demo
      const totalTimeThisWeek = recentSessions.reduce((total, session) => {
        if (session.startTime && session.endTime) {
          const duration = new Date(session.endTime).getTime() - new Date(session.startTime).getTime();
          return total + duration;
        }
        return total;
      }, 0);
      
      const hours = Math.round(totalTimeThisWeek / (1000 * 60 * 60) * 10) / 10;
      
      res.json({
        workoutsThisWeek: totalWorkouts,
        currentStreak,
        totalTime: `${hours}h`,
        recentWorkouts: recentSessions.slice(0, 5)
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Google Auth Routes
  app.get('/api/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  app.get('/api/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
      res.redirect('/');
    }
  );

  app.get('/api/auth/logout', (req, res) => {
    req.logout(() => {
      res.redirect('/');
    });
  });

  app.get('/api/auth/current-user', (req, res) => {
    res.json(req.user || null);
  });

  // Email/Password Sign Up
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const { email, password, displayName } = req.body;
      const hashedPassword = await hashPassword(password);
      // TODO: Save user to database
      // const user = await db.createUser({ email, password: hashedPassword, displayName });
      const user = { id: '1', email, displayName };
      const token = generateToken(user);
      res.status(201).json({ user, token });
    } catch (error) {
      res.status(400).json({ message: 'Invalid signup data' });
    }
  });

  // Email/Password Sign In
  app.post('/api/auth/signin', passport.authenticate('local', { session: false }), (req, res) => {
    const token = generateToken(req.user);
    res.json({ user: req.user, token });
  });

  const httpServer = createServer(app);
  return httpServer;
}
