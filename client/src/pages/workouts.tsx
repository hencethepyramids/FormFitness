import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Plus, 
  Clock, 
  Target,
  Dumbbell,
  Filter,
  Play
} from "lucide-react";
import { Link } from "wouter";
import type { Exercise, WorkoutPlan } from "@shared/schema";

export default function Workouts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: exercises, isLoading: exercisesLoading } = useQuery<Exercise[]>({
    queryKey: ["/api/exercises", { search: searchQuery, category: selectedCategory === "all" ? undefined : selectedCategory }],
  });

  const { data: workoutPlans, isLoading: plansLoading } = useQuery<WorkoutPlan[]>({
    queryKey: ["/api/workout-plans"],
  });

  const categories = [
    { value: "all", label: "All" },
    { value: "chest", label: "Chest" },
    { value: "back", label: "Back" },
    { value: "legs", label: "Legs" },
    { value: "arms", label: "Arms" },
    { value: "shoulders", label: "Shoulders" },
    { value: "core", label: "Core" }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "advanced": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const filteredExercises = exercises?.filter(exercise => {
    const matchesSearch = !searchQuery || 
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.muscleGroups.some(mg => mg.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || exercise.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  return (
    <div className="min-h-screen bg-background bottom-nav-padding">
      {/* Header */}
      <header className="bg-white dark:bg-card border-b border-gray-100 dark:border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800 dark:text-foreground">Workouts</h1>
          <Button size="icon" variant="ghost" className="rounded-lg">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="p-6">
        <Tabs value="exercises" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="exercises">Exercises</TabsTrigger>
            <TabsTrigger value="plans">My Plans</TabsTrigger>
          </TabsList>
          
          <TabsContent value="exercises" className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search exercises..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Categories */}
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                  className="whitespace-nowrap"
                >
                  {category.label}
                </Button>
              ))}
            </div>

            {/* Exercise List */}
            {exercisesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredExercises.map((exercise) => (
                  <Link key={exercise.id} href={`/exercise/${exercise.id}`}>
                    <Card className="hover:border-primary transition-colors cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Dumbbell className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-800 dark:text-foreground">{exercise.name}</h3>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge 
                                  variant="secondary" 
                                  className={getDifficultyColor(exercise.difficulty)}
                                >
                                  {exercise.difficulty}
                                </Badge>
                                <span className="text-xs text-gray-600 dark:text-muted-foreground">
                                  {exercise.muscleGroups.join(", ")}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Target className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="plans" className="space-y-4">
            {/* Create New Plan Button */}
            <Card className="border-dashed border-2 border-primary/30 hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Plus className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium text-gray-800 dark:text-foreground mb-1">Create New Plan</h3>
                <p className="text-sm text-gray-600 dark:text-muted-foreground">
                  Build a custom workout routine
                </p>
              </CardContent>
            </Card>

            {/* Workout Plans */}
            {plansLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : workoutPlans && workoutPlans.length > 0 ? (
              <div className="space-y-3">
                {workoutPlans.map((plan) => (
                  <Card key={plan.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-medium text-gray-800 dark:text-foreground">{plan.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-muted-foreground">{plan.description}</p>
                        </div>
                        <Badge variant="outline">
                          {plan.exercises.length} exercises
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{plan.estimatedDuration || 45} min</span>
                          </div>
                        </div>
                        <Link href={`/workout-session?planId=${plan.id}`}>
                          <Button size="sm" className="flex items-center space-x-1">
                            <Play className="w-4 h-4" />
                            <span>Start</span>
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Dumbbell className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-gray-800 dark:text-foreground mb-2">No workout plans yet</h3>
                  <p className="text-sm text-gray-600 dark:text-muted-foreground">
                    Create your first workout plan to get started
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
