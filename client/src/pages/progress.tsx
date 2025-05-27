import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Calendar, 
  Target,
  Award,
  BarChart3,
  Clock,
  Flame,
  Trophy
} from "lucide-react";
import ProgressChart from "@/components/progress-chart";
import type { PersonalRecord, WorkoutSession } from "@shared/schema";

export default function ProgressPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "year">("week");

  const { data: personalRecords, isLoading: recordsLoading } = useQuery<PersonalRecord[]>({
    queryKey: ["/api/personal-records"],
  });

  const { data: workoutSessions, isLoading: sessionsLoading } = useQuery<WorkoutSession[]>({
    queryKey: ["/api/workout-sessions"],
  });

  const { data: dashboardStats } = useQuery({
    queryKey: ["/api/dashboard-stats"],
  });

  // Mock data for charts and progress
  const weeklyProgress = [
    { day: "Mon", duration: 45, completed: true },
    { day: "Tue", duration: 38, completed: true },
    { day: "Wed", duration: 0, completed: false },
    { day: "Thu", duration: 52, completed: true },
    { day: "Fri", duration: 42, completed: true },
    { day: "Sat", duration: 30, completed: true },
    { day: "Sun", duration: 0, completed: false }
  ];

  const monthlyStats = {
    totalWorkouts: 18,
    totalTime: "12.5h",
    avgDuration: "42min",
    consistency: 75
  };

  const achievements = [
    { title: "First Workout", description: "Complete your first workout", earned: true, date: "2 weeks ago" },
    { title: "Week Warrior", description: "Work out 5 days in a week", earned: true, date: "1 week ago" },
    { title: "Personal Best", description: "Set a new personal record", earned: true, date: "3 days ago" },
    { title: "Consistency King", description: "Work out 30 days straight", earned: false, progress: 75 },
  ];

  const getProgressValue = (day: typeof weeklyProgress[0]) => {
    if (!day.completed) return 0;
    return Math.min((day.duration / 60) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-background bottom-nav-padding">
      {/* Header */}
      <header className="bg-white dark:bg-card border-b border-gray-100 dark:border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800 dark:text-foreground">Progress</h1>
          <Button size="icon" variant="ghost" className="rounded-lg">
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="p-6">
        <Tabs value="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="records">Records</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            {/* Period Selector */}
            <div className="flex space-x-2">
              {(["week", "month", "year"] as const).map((period) => (
                <Button
                  key={period}
                  variant={selectedPeriod === period ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPeriod(period)}
                  className="capitalize"
                >
                  {period}
                </Button>
              ))}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-[hsl(var(--muted))] border-primary/20">
                <CardContent className="p-4 text-center">
                  <Flame className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary">{dashboardStats?.currentStreak || 5}</div>
                  <div className="text-xs text-[hsl(var(--muted-foreground))] dark:text-muted-foreground">Day Streak</div>
                </CardContent>
              </Card>
              <Card className="bg-[hsl(var(--muted))] border-secondary/20">
                <CardContent className="p-4 text-center">
                  <BarChart3 className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary">{monthlyStats.totalWorkouts}</div>
                  <div className="text-xs text-[hsl(var(--muted-foreground))] dark:text-muted-foreground">This Month</div>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {weeklyProgress.map((day) => (
                    <div key={day.day} className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600 dark:text-muted-foreground w-8 font-medium">
                        {day.day}
                      </span>
                      <div className="flex-1">
                        <ProgressBar 
                          value={getProgressValue(day)} 
                          className="h-3"
                        />
                      </div>
                      <span className={`text-sm w-12 text-right ${
                        day.completed 
                          ? 'text-gray-600 dark:text-muted-foreground' 
                          : 'text-gray-400 dark:text-muted-foreground/60'
                      }`}>
                        {day.completed ? `${day.duration}m` : day.day === 'Sun' ? 'Today' : 'Rest'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Monthly Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800 dark:text-foreground">{monthlyStats.totalTime}</div>
                    <div className="text-sm text-gray-600 dark:text-muted-foreground">Total Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800 dark:text-foreground">{monthlyStats.avgDuration}</div>
                    <div className="text-sm text-gray-600 dark:text-muted-foreground">Avg Duration</div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-muted-foreground">Consistency</span>
                    <span className="text-sm font-medium text-gray-800 dark:text-foreground">{monthlyStats.consistency}%</span>
                  </div>
                  <ProgressBar value={monthlyStats.consistency} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Progress Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Workout Frequency</CardTitle>
              </CardHeader>
              <CardContent>
                <ProgressChart period={selectedPeriod} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="records" className="space-y-4">
            {/* Personal Records */}
            {recordsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map(i => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-16"></div>
                        </div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-16"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                          <Trophy className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800 dark:text-foreground">Bench Press</div>
                          <div className="text-sm text-gray-600 dark:text-muted-foreground">Personal Best</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary">185 lbs</div>
                        <div className="text-xs text-gray-600 dark:text-muted-foreground">3 days ago</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                          <Target className="w-5 h-5 text-secondary" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800 dark:text-foreground">Squat</div>
                          <div className="text-sm text-gray-600 dark:text-muted-foreground">8 reps</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-secondary">225 lbs</div>
                        <div className="text-xs text-gray-600 dark:text-muted-foreground">1 week ago</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800 dark:text-foreground">Deadlift</div>
                          <div className="text-sm text-gray-600 dark:text-muted-foreground">5 reps</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-accent">275 lbs</div>
                        <div className="text-xs text-gray-600 dark:text-muted-foreground">2 weeks ago</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            {/* Achievements */}
            <div className="space-y-3">
              {achievements.map((achievement, index) => (
                <Card key={index} className={achievement.earned ? "border-primary/20 bg-primary/5" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        achievement.earned 
                          ? "bg-primary text-white" 
                          : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                      }`}>
                        <Award className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-800 dark:text-foreground">{achievement.title}</h3>
                          {achievement.earned && (
                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                              Earned
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-muted-foreground">{achievement.description}</p>
                        {achievement.earned ? (
                          <p className="text-xs text-gray-500 dark:text-muted-foreground mt-1">{achievement.date}</p>
                        ) : achievement.progress && (
                          <div className="mt-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-600 dark:text-muted-foreground">Progress</span>
                              <span className="text-xs text-gray-600 dark:text-muted-foreground">{achievement.progress}%</span>
                            </div>
                            <ProgressBar value={achievement.progress} className="h-1" />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
