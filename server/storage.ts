import {
  users, exercises, workoutPlans, workoutSessions, sets, personalRecords, nutritionEntries, userStats,
  type User, type InsertUser,
  type Exercise, type InsertExercise,
  type WorkoutPlan, type InsertWorkoutPlan,
  type WorkoutSession, type InsertWorkoutSession,
  type Set, type InsertSet,
  type PersonalRecord, type InsertPersonalRecord,
  type NutritionEntry, type InsertNutritionEntry,
  type UserStats, type InsertUserStats
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Exercises
  getExercises(): Promise<Exercise[]>;
  getExercisesByCategory(category: string): Promise<Exercise[]>;
  searchExercises(query: string): Promise<Exercise[]>;
  getExercise(id: number): Promise<Exercise | undefined>;
  createExercise(exercise: InsertExercise): Promise<Exercise>;

  // Workout Plans
  getWorkoutPlans(userId: number): Promise<WorkoutPlan[]>;
  getWorkoutPlan(id: number): Promise<WorkoutPlan | undefined>;
  createWorkoutPlan(plan: InsertWorkoutPlan): Promise<WorkoutPlan>;
  updateWorkoutPlan(id: number, plan: Partial<InsertWorkoutPlan>): Promise<WorkoutPlan | undefined>;
  deleteWorkoutPlan(id: number): Promise<boolean>;

  // Workout Sessions
  getWorkoutSessions(userId: number): Promise<WorkoutSession[]>;
  getWorkoutSession(id: number): Promise<WorkoutSession | undefined>;
  createWorkoutSession(session: InsertWorkoutSession): Promise<WorkoutSession>;
  updateWorkoutSession(id: number, session: Partial<InsertWorkoutSession>): Promise<WorkoutSession | undefined>;

  // Sets
  getSetsBySession(workoutSessionId: number): Promise<Set[]>;
  createSet(set: InsertSet): Promise<Set>;
  updateSet(id: number, set: Partial<InsertSet>): Promise<Set | undefined>;

  // Personal Records
  getPersonalRecords(userId: number): Promise<PersonalRecord[]>;
  getPersonalRecordsByExercise(userId: number, exerciseId: number): Promise<PersonalRecord[]>;
  createPersonalRecord(record: InsertPersonalRecord): Promise<PersonalRecord>;

  // Nutrition
  getNutritionEntries(userId: number, date?: Date): Promise<NutritionEntry[]>;
  createNutritionEntry(entry: InsertNutritionEntry): Promise<NutritionEntry>;

  // User Stats
  getUserStats(userId: number, dateRange?: { start: Date; end: Date }): Promise<UserStats[]>;
  createUserStats(stats: InsertUserStats): Promise<UserStats>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private exercises: Map<number, Exercise> = new Map();
  private workoutPlans: Map<number, WorkoutPlan> = new Map();
  private workoutSessions: Map<number, WorkoutSession> = new Map();
  private sets: Map<number, Set> = new Map();
  private personalRecords: Map<number, PersonalRecord> = new Map();
  private nutritionEntries: Map<number, NutritionEntry> = new Map();
  private userStats: Map<number, UserStats> = new Map();

  private currentUserId = 1;
  private currentExerciseId = 1;
  private currentWorkoutPlanId = 1;
  private currentWorkoutSessionId = 1;
  private currentSetId = 1;
  private currentPersonalRecordId = 1;
  private currentNutritionEntryId = 1;
  private currentUserStatsId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Create default user
    const defaultUser: User = {
      id: 1,
      username: "demo",
      password: "password",
      name: "Alex",
      email: "alex@example.com",
      createdAt: new Date(),
    };
    this.users.set(1, defaultUser);
    this.currentUserId = 2;

    // Seed exercises
    this.seedExercises();
  }

  private seedExercises() {
    const exerciseData: Omit<Exercise, 'id'>[] = [
      // Chest
      {
        name: "Bench Press",
        category: "chest",
        muscleGroups: ["chest", "shoulders", "triceps"],
        instructions: [
          "Lie flat on the bench with your eyes under the bar",
          "Grip the bar with hands slightly wider than shoulder-width",
          "Lower the bar to your chest with control",
          "Press the bar back up to starting position"
        ],
        equipment: "Barbell, Bench",
        difficulty: "intermediate",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"
      },
      {
        name: "Push-ups",
        category: "chest",
        muscleGroups: ["chest", "shoulders", "triceps"],
        instructions: [
          "Start in plank position with hands under shoulders",
          "Lower body until chest nearly touches floor",
          "Push back up to starting position",
          "Keep core tight throughout movement"
        ],
        equipment: "Bodyweight",
        difficulty: "beginner",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"
      },
      {
        name: "Incline Dumbbell Press",
        category: "chest",
        muscleGroups: ["chest", "shoulders", "triceps"],
        instructions: [
          "Set bench to 30-45 degree incline",
          "Hold dumbbells at chest level",
          "Press weights up and slightly together",
          "Lower with control to chest level"
        ],
        equipment: "Dumbbells, Incline Bench",
        difficulty: "intermediate",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"
      },
      // Back
      {
        name: "Pull-ups",
        category: "back",
        muscleGroups: ["lats", "rhomboids", "biceps"],
        instructions: [
          "Hang from bar with hands wider than shoulders",
          "Pull body up until chin clears bar",
          "Lower with control to full hang",
          "Keep core engaged throughout"
        ],
        equipment: "Pull-up Bar",
        difficulty: "intermediate",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"
      },
      {
        name: "Deadlift",
        category: "back",
        muscleGroups: ["lats", "traps", "glutes", "hamstrings"],
        instructions: [
          "Stand with feet hip-width apart, bar over mid-foot",
          "Hinge at hips and knees to grip bar",
          "Lift bar by extending hips and knees",
          "Lower bar with control back to floor"
        ],
        equipment: "Barbell",
        difficulty: "advanced",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"
      },
      // Legs
      {
        name: "Squats",
        category: "legs",
        muscleGroups: ["quadriceps", "glutes", "hamstrings"],
        instructions: [
          "Stand with feet shoulder-width apart",
          "Lower body by bending knees and hips",
          "Keep chest up and knees tracking over toes",
          "Return to starting position"
        ],
        equipment: "Bodyweight or Barbell",
        difficulty: "beginner",
        imageUrl: "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c"
      },
      {
        name: "Lunges",
        category: "legs",
        muscleGroups: ["quadriceps", "glutes", "hamstrings"],
        instructions: [
          "Step forward with one leg",
          "Lower hips until both knees are at 90 degrees",
          "Push back to starting position",
          "Alternate legs or complete sets on each side"
        ],
        equipment: "Bodyweight or Dumbbells",
        difficulty: "beginner",
        imageUrl: "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c"
      },
      // Arms
      {
        name: "Bicep Curls",
        category: "arms",
        muscleGroups: ["biceps"],
        instructions: [
          "Stand with dumbbells at sides",
          "Curl weights up by flexing biceps",
          "Keep elbows stationary at sides",
          "Lower weights with control"
        ],
        equipment: "Dumbbells",
        difficulty: "beginner",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"
      },
      {
        name: "Tricep Dips",
        category: "arms",
        muscleGroups: ["triceps"],
        instructions: [
          "Sit on edge of bench or chair",
          "Place hands beside hips, fingers forward",
          "Lower body by bending elbows",
          "Push back up to starting position"
        ],
        equipment: "Bench or Chair",
        difficulty: "beginner",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"
      }
    ];

    exerciseData.forEach((exercise, index) => {
      const fullExercise: Exercise = {
        id: index + 1,
        ...exercise
      };
      this.exercises.set(index + 1, fullExercise);
    });
    this.currentExerciseId = exerciseData.length + 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      id: this.currentUserId++,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  // Exercise methods
  async getExercises(): Promise<Exercise[]> {
    return Array.from(this.exercises.values());
  }

  async getExercisesByCategory(category: string): Promise<Exercise[]> {
    return Array.from(this.exercises.values()).filter(ex => ex.category === category);
  }

  async searchExercises(query: string): Promise<Exercise[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.exercises.values()).filter(ex =>
      ex.name.toLowerCase().includes(lowercaseQuery) ||
      ex.category.toLowerCase().includes(lowercaseQuery) ||
      ex.muscleGroups.some(mg => mg.toLowerCase().includes(lowercaseQuery))
    );
  }

  async getExercise(id: number): Promise<Exercise | undefined> {
    return this.exercises.get(id);
  }

  async createExercise(insertExercise: InsertExercise): Promise<Exercise> {
    const exercise: Exercise = {
      ...insertExercise,
      id: this.currentExerciseId++,
    };
    this.exercises.set(exercise.id, exercise);
    return exercise;
  }

  // Workout Plan methods
  async getWorkoutPlans(userId: number): Promise<WorkoutPlan[]> {
    return Array.from(this.workoutPlans.values()).filter(plan => plan.userId === userId);
  }

  async getWorkoutPlan(id: number): Promise<WorkoutPlan | undefined> {
    return this.workoutPlans.get(id);
  }

  async createWorkoutPlan(insertPlan: InsertWorkoutPlan): Promise<WorkoutPlan> {
    const plan: WorkoutPlan = {
      ...insertPlan,
      id: this.currentWorkoutPlanId++,
      createdAt: new Date(),
    };
    this.workoutPlans.set(plan.id, plan);
    return plan;
  }

  async updateWorkoutPlan(id: number, updates: Partial<InsertWorkoutPlan>): Promise<WorkoutPlan | undefined> {
    const plan = this.workoutPlans.get(id);
    if (!plan) return undefined;
    
    const updatedPlan = { ...plan, ...updates };
    this.workoutPlans.set(id, updatedPlan);
    return updatedPlan;
  }

  async deleteWorkoutPlan(id: number): Promise<boolean> {
    return this.workoutPlans.delete(id);
  }

  // Workout Session methods
  async getWorkoutSessions(userId: number): Promise<WorkoutSession[]> {
    return Array.from(this.workoutSessions.values()).filter(session => session.userId === userId);
  }

  async getWorkoutSession(id: number): Promise<WorkoutSession | undefined> {
    return this.workoutSessions.get(id);
  }

  async createWorkoutSession(insertSession: InsertWorkoutSession): Promise<WorkoutSession> {
    const session: WorkoutSession = {
      ...insertSession,
      id: this.currentWorkoutSessionId++,
      startTime: new Date(),
    };
    this.workoutSessions.set(session.id, session);
    return session;
  }

  async updateWorkoutSession(id: number, updates: Partial<InsertWorkoutSession>): Promise<WorkoutSession | undefined> {
    const session = this.workoutSessions.get(id);
    if (!session) return undefined;
    
    const updatedSession = { ...session, ...updates };
    this.workoutSessions.set(id, updatedSession);
    return updatedSession;
  }

  // Set methods
  async getSetsBySession(workoutSessionId: number): Promise<Set[]> {
    return Array.from(this.sets.values()).filter(set => set.workoutSessionId === workoutSessionId);
  }

  async createSet(insertSet: InsertSet): Promise<Set> {
    const set: Set = {
      ...insertSet,
      id: this.currentSetId++,
    };
    this.sets.set(set.id, set);
    return set;
  }

  async updateSet(id: number, updates: Partial<InsertSet>): Promise<Set | undefined> {
    const set = this.sets.get(id);
    if (!set) return undefined;
    
    const updatedSet = { ...set, ...updates };
    this.sets.set(id, updatedSet);
    return updatedSet;
  }

  // Personal Record methods
  async getPersonalRecords(userId: number): Promise<PersonalRecord[]> {
    return Array.from(this.personalRecords.values()).filter(pr => pr.userId === userId);
  }

  async getPersonalRecordsByExercise(userId: number, exerciseId: number): Promise<PersonalRecord[]> {
    return Array.from(this.personalRecords.values()).filter(pr => pr.userId === userId && pr.exerciseId === exerciseId);
  }

  async createPersonalRecord(insertRecord: InsertPersonalRecord): Promise<PersonalRecord> {
    const record: PersonalRecord = {
      ...insertRecord,
      id: this.currentPersonalRecordId++,
      achievedAt: new Date(),
    };
    this.personalRecords.set(record.id, record);
    return record;
  }

  // Nutrition methods
  async getNutritionEntries(userId: number, date?: Date): Promise<NutritionEntry[]> {
    const entries = Array.from(this.nutritionEntries.values()).filter(entry => entry.userId === userId);
    
    if (date) {
      const targetDate = new Date(date);
      return entries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.toDateString() === targetDate.toDateString();
      });
    }
    
    return entries;
  }

  async createNutritionEntry(insertEntry: InsertNutritionEntry): Promise<NutritionEntry> {
    const entry: NutritionEntry = {
      ...insertEntry,
      id: this.currentNutritionEntryId++,
      date: new Date(),
    };
    this.nutritionEntries.set(entry.id, entry);
    return entry;
  }

  // User Stats methods
  async getUserStats(userId: number, dateRange?: { start: Date; end: Date }): Promise<UserStats[]> {
    const stats = Array.from(this.userStats.values()).filter(stat => stat.userId === userId);
    
    if (dateRange) {
      return stats.filter(stat => {
        const statDate = new Date(stat.date);
        return statDate >= dateRange.start && statDate <= dateRange.end;
      });
    }
    
    return stats;
  }

  async createUserStats(insertStats: InsertUserStats): Promise<UserStats> {
    const stats: UserStats = {
      ...insertStats,
      id: this.currentUserStatsId++,
      date: new Date(),
    };
    this.userStats.set(stats.id, stats);
    return stats;
  }
}

export const storage = new MemStorage();
