// Exercise categories with icons and metadata
export const exerciseCategories = [
  {
    id: "chest",
    name: "Chest",
    description: "Build upper body strength and definition",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    exerciseCount: 12,
  },
  {
    id: "back",
    name: "Back",
    description: "Strengthen your posterior chain",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    exerciseCount: 15,
  },
  {
    id: "legs",
    name: "Legs",
    description: "Lower body power and stability",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    exerciseCount: 18,
  },
  {
    id: "arms",
    name: "Arms",
    description: "Biceps, triceps, and forearms",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    exerciseCount: 14,
  },
  {
    id: "shoulders",
    name: "Shoulders",
    description: "Deltoid strength and mobility",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    exerciseCount: 10,
  },
  {
    id: "core",
    name: "Core",
    description: "Abdominal and stabilizing muscles",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    exerciseCount: 8,
  },
];

// Muscle group mappings
export const muscleGroups = [
  "chest",
  "shoulders", 
  "triceps",
  "biceps",
  "forearms",
  "lats",
  "rhomboids",
  "traps",
  "lower back",
  "quadriceps",
  "hamstrings",
  "glutes",
  "calves",
  "abs",
  "obliques",
] as const;

// Equipment types
export const equipmentTypes = [
  "Bodyweight",
  "Barbell",
  "Dumbbells", 
  "Cable Machine",
  "Pull-up Bar",
  "Bench",
  "Resistance Bands",
  "Kettlebell",
  "Medicine Ball",
  "Stability Ball",
] as const;

// Difficulty levels
export const difficultyLevels = [
  { value: "beginner", label: "Beginner", color: "green" },
  { value: "intermediate", label: "Intermediate", color: "yellow" },
  { value: "advanced", label: "Advanced", color: "red" },
] as const;

// Common workout types
export const workoutTypes = [
  {
    id: "push",
    name: "Push Day",
    description: "Chest, shoulders, and triceps",
    duration: "45-60 min",
    exercises: ["Bench Press", "Shoulder Press", "Tricep Dips"],
  },
  {
    id: "pull",
    name: "Pull Day", 
    description: "Back and biceps",
    duration: "45-60 min",
    exercises: ["Pull-ups", "Rows", "Bicep Curls"],
  },
  {
    id: "legs",
    name: "Leg Day",
    description: "Quads, hamstrings, and glutes",
    duration: "60-75 min", 
    exercises: ["Squats", "Deadlifts", "Lunges"],
  },
  {
    id: "upper",
    name: "Upper Body",
    description: "Complete upper body workout",
    duration: "60-75 min",
    exercises: ["Push & Pull movements"],
  },
  {
    id: "full",
    name: "Full Body",
    description: "Total body conditioning",
    duration: "45-90 min",
    exercises: ["Compound movements"],
  },
] as const;

// Helper functions
export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "beginner":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case "intermediate":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    case "advanced":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

export const getCategoryInfo = (categoryId: string) => {
  return exerciseCategories.find(cat => cat.id === categoryId);
};

export const formatExerciseName = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const formatMuscleGroup = (muscleGroup: string) => {
  return muscleGroup
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Workout planning helpers
export const calculateWorkoutDuration = (exercises: number, setsPerExercise: number = 3) => {
  // Rough estimate: 2-3 minutes per set including rest
  const totalSets = exercises * setsPerExercise;
  const estimatedMinutes = totalSets * 2.5;
  return Math.round(estimatedMinutes);
};

export const generateWorkoutName = (category: string, date: Date = new Date()) => {
  const categoryInfo = getCategoryInfo(category);
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  return categoryInfo ? `${dayName} ${categoryInfo.name} Workout` : `${dayName} Workout`;
};
