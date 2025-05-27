import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Dumbbell, 
  Heart, 
  ArrowUp, 
  Activity, 
  Zap,
  TrendingUp,
  Clock,
  Target,
  Apple,
  Plus
} from "lucide-react";
import { Link } from "wouter";
import ExerciseSearch from "@/components/exercise-search";
import WorkoutModal from "@/components/workout-modal";
import { useState } from "react";

interface DashboardStats {
  workoutsThisWeek: number;
  currentStreak: number;
  totalTime: string;
  recentWorkouts: any[];
}

export default function Home() {
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);

  const { data: dashboardStats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard-stats"],
  });

  const { data: exercises } = useQuery({
    queryKey: ["/api/exercises"],
  });

  if (statsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-background">
        <div className="animate-pulse p-6 space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded"></div>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
            ))}
          </div>
          <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  const todayWorkout = {
    name: "Upper Body Strength",
    exercises: "6 exercises",
    duration: "45 min"
  };

  const exerciseCategories = [
    { name: "Chest", icon: Heart, count: 12, color: "bg-red-500/10 text-red-500" },
    { name: "Back", icon: ArrowUp, count: 15, color: "bg-green-500/10 text-green-500" },
    { name: "Legs", icon: Activity, count: 18, color: "bg-blue-500/10 text-blue-500" },
    { name: "Arms", icon: Zap, count: 14, color: "bg-orange-500/10 text-orange-500" }
  ];

  const weeklyProgress = [
    { day: "Mon", progress: 100, time: "45m" },
    { day: "Tue", progress: 80, time: "38m" },
    { day: "Wed", progress: 0, time: "Rest" },
    { day: "Thu", progress: 100, time: "52m" },
    { day: "Fri", progress: 75, time: "42m" },
    { day: "Sat", progress: 50, time: "30m" },
    { day: "Sun", progress: 0, time: "Today" }
  ];

  const personalRecords = [
    { exercise: "Bench Press", weight: "185 lbs", color: "text-primary" },
    { exercise: "Squat", weight: "225 lbs", color: "text-secondary" },
    { exercise: "Deadlift", weight: "275 lbs", color: "text-accent" }
  ];

  return (
    <div className="min-h-screen bg-background bottom-nav-padding">
      {/* Header */}
      <header className="bg-white dark:bg-card border-b border-gray-100 dark:border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-foreground">Good morning!</h1>
            <p className="text-sm text-gray-600 dark:text-muted-foreground">Alex</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="rounded-lg bg-gray-50 dark:bg-muted">
              <Target className="h-4 w-4 text-gray-600 dark:text-muted-foreground" />
            </Button>
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="rounded-lg bg-gray-50 dark:bg-muted">
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-primary">A</span>
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Quick Stats */}
      <section className="px-6 py-4">
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-[hsl(var(--muted))] border-primary/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {dashboardStats?.workoutsThisWeek || 0}
              </div>
              <div className="text-xs text-[hsl(var(--muted-foreground))] dark:text-muted-foreground mt-1">Workouts</div>
            </CardContent>
          </Card>
          <Card className="bg-[hsl(var(--muted))] border-secondary/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {dashboardStats?.currentStreak || 0}
              </div>
              <div className="text-xs text-[hsl(var(--muted-foreground))] dark:text-muted-foreground mt-1">Day Streak</div>
            </CardContent>
          </Card>
          <Card className="bg-[hsl(var(--muted))] border-accent/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {dashboardStats?.totalTime || "0h"}
              </div>
              <div className="text-xs text-[hsl(var(--muted-foreground))] dark:text-muted-foreground mt-1">This Week</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Today's Workout */}
      <section className="px-6 py-2">
        <Card className="gradient-primary text-white relative overflow-hidden">
          <CardContent className="p-6">
            <div className="absolute right-4 top-4 w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
              <Dumbbell className="text-2xl text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Today's Workout</h3>
            <p className="text-primary-100 mb-4">{todayWorkout.name}</p>
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span>{todayWorkout.exercises}</span> • 
                <span className="ml-1">{todayWorkout.duration}</span>
              </div>
              <Button 
                className="bg-white text-primary hover:bg-white/90"
                onClick={() => setShowWorkoutModal(true)}
              >
                Start Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Exercise Search */}
      <section className="px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-foreground mb-3">Find Exercises</h3>
        <ExerciseSearch />
        
        {/* Exercise Categories */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          {exerciseCategories.map((category) => (
            <Link key={category.name} href={`/workouts?category=${category.name.toLowerCase()}`}>
              <Card className="hover:border-primary transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className={`exercise-category-icon ${category.color}`}>
                      <category.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800 dark:text-foreground">{category.name}</div>
                      <div className="text-xs text-gray-600 dark:text-muted-foreground">{category.count} exercises</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Workouts */}
      <section className="px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-foreground">Recent Workouts</h3>
          <Link href="/workouts">
            <Button variant="ghost" className="text-primary text-sm font-medium">
              View All
            </Button>
          </Link>
        </div>
        
        <div className="space-y-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Dumbbell className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800 dark:text-foreground">Push Day</div>
                    <div className="text-sm text-[hsl(var(--muted-foreground))] dark:text-muted-foreground">Yesterday • 52 min</div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-primary">
                  <TrendingUp className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800 dark:text-foreground">Leg Day</div>
                    <div className="text-sm text-[hsl(var(--muted-foreground))] dark:text-muted-foreground">2 days ago • 48 min</div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-primary">
                  <TrendingUp className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Progress Section */}
      <section className="px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-foreground mb-3">Your Progress</h3>
        
        {/* Weekly Progress Chart */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-800 dark:text-foreground">This Week</h4>
              <span className="text-sm text-gray-600 dark:text-muted-foreground">5/7 days</span>
            </div>
            
            <div className="space-y-3">
              {weeklyProgress.map((day) => (
                <div key={day.day} className="flex items-center space-x-3">
                  <span className="text-xs text-gray-600 dark:text-muted-foreground w-8">{day.day}</span>
                  <div className="flex-1">
                    <Progress 
                      value={day.progress} 
                      className="h-2"
                    />
                  </div>
                  <span className={`text-xs ${day.progress === 0 ? 'text-gray-400 dark:text-muted-foreground' : 'text-gray-600 dark:text-muted-foreground'}`}>
                    {day.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Personal Records */}
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium text-gray-800 dark:text-foreground mb-3">Personal Records</h4>
            <div className="space-y-2">
              {personalRecords.map((record) => (
                <div key={record.exercise} className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-muted-foreground">{record.exercise}</span>
                  <Badge variant="outline" className="text-primary border-current">
                    {record.weight}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Nutrition Section */}
      <section className="px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-foreground">Nutrition</h3>
          <Link href="/nutrition">
            <Button variant="ghost" size="icon" className="text-primary">
              <Plus className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        
        <Card>
          <CardContent className="p-4">
            <div className="w-full h-24 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg mb-3 flex items-center justify-center">
              <Apple className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-gray-800 dark:text-foreground">1,850</div>
                <div className="text-xs text-gray-600 dark:text-muted-foreground">Calories</div>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-800 dark:text-foreground">95g</div>
                <div className="text-xs text-gray-600 dark:text-muted-foreground">Protein</div>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-800 dark:text-foreground">2.1L</div>
                <div className="text-xs text-gray-600 dark:text-muted-foreground">Water</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Workout Modal */}
      <WorkoutModal 
        open={showWorkoutModal} 
        onOpenChange={setShowWorkoutModal}
        workout={todayWorkout}
      />
    </div>
  );
}
