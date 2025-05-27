import { useParams, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Play, 
  Plus, 
  Target,
  Clock,
  Zap,
  CheckCircle,
  Info
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Exercise, PersonalRecord } from "@shared/schema";

export default function ExerciseDetail() {
  const { id } = useParams();
  const { toast } = useToast();

  const { data: exercise, isLoading } = useQuery<Exercise>({
    queryKey: [`/api/exercises/${id}`],
    enabled: !!id,
  });

  const { data: personalRecords } = useQuery<PersonalRecord[]>({
    queryKey: ["/api/personal-records", { exerciseId: id }],
    enabled: !!id,
  });

  const createWorkoutMutation = useMutation({
    mutationFn: async () => {
      if (!exercise) return;
      
      const workoutData = {
        name: `${exercise.name} Session`,
        workoutPlanId: null,
        notes: `Quick workout session for ${exercise.name}`,
      };

      const response = await apiRequest("POST", "/api/workout-sessions", workoutData);
      return response.json();
    },
    onSuccess: (session) => {
      queryClient.invalidateQueries({ queryKey: ["/api/workout-sessions"] });
      toast({
        title: "Workout Started",
        description: `Started a new workout session for ${exercise?.name}`,
      });
      // Navigate to workout session
      window.location.href = `/workout-session/${session.id}`;
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start workout session",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="animate-pulse p-6 space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded"></div>
          <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <Info className="h-8 w-8 text-gray-400 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-foreground">Exercise Not Found</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-muted-foreground">
              The exercise you're looking for doesn't exist.
            </p>
            <Link href="/workouts">
              <Button className="mt-4">
                Back to Exercises
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "advanced": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const bestRecord = personalRecords && personalRecords.length > 0 
    ? personalRecords.reduce((best, record) => {
        if (!best) return record;
        if (record.weight && best.weight && record.weight > best.weight) return record;
        if (record.reps && best.reps && record.reps > best.reps) return record;
        return best;
      }, personalRecords[0])
    : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white dark:bg-card border-b border-gray-100 dark:border-border px-6 py-4">
        <div className="flex items-center space-x-4">
          <Link href="/workouts">
            <Button variant="ghost" size="icon" className="rounded-lg">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-800 dark:text-foreground">{exercise.name}</h1>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Exercise Image */}
        <Card className="overflow-hidden">
          <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <Target className="w-16 h-16 text-primary/60" />
          </div>
        </Card>

        {/* Exercise Info */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-foreground">{exercise.name}</h2>
              <Badge className={getDifficultyColor(exercise.difficulty)}>
                {exercise.difficulty}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 dark:bg-muted rounded-lg">
                <div className="text-sm text-gray-600 dark:text-muted-foreground mb-1">Category</div>
                <div className="font-semibold text-gray-800 dark:text-foreground capitalize">{exercise.category}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-muted rounded-lg">
                <div className="text-sm text-gray-600 dark:text-muted-foreground mb-1">Equipment</div>
                <div className="font-semibold text-gray-800 dark:text-foreground">{exercise.equipment}</div>
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600 dark:text-muted-foreground mb-2">Target Muscles</div>
              <div className="flex flex-wrap gap-2">
                {exercise.muscleGroups.map((muscle) => (
                  <Badge key={muscle} variant="outline" className="capitalize">
                    {muscle}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Record */}
        {bestRecord && (
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Zap className="w-5 h-5 text-primary" />
                <span>Your Personal Best</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {bestRecord.weight && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{bestRecord.weight} lbs</div>
                    <div className="text-sm text-gray-600 dark:text-muted-foreground">Max Weight</div>
                  </div>
                )}
                {bestRecord.reps && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">{bestRecord.reps}</div>
                    <div className="text-sm text-gray-600 dark:text-muted-foreground">Max Reps</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">How to Perform</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {exercise.instructions.map((instruction, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 dark:text-muted-foreground">{instruction}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            className="flex items-center space-x-2 h-12"
            onClick={() => createWorkoutMutation.mutate()}
            disabled={createWorkoutMutation.isPending}
          >
            <Play className="w-4 h-4" />
            <span>Start Workout</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2 h-12">
            <Plus className="w-4 h-4" />
            <span>Add to Plan</span>
          </Button>
        </div>

        {/* Tips */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink0" />
              <div>
                <h3 className="font-medium text-gray-800 dark:text-foreground mb-1">Pro Tip</h3>
                <p className="text-sm text-gray-600 dark:text-muted-foreground">
                  Focus on proper form over heavy weight, especially when starting out. 
                  Quality movements lead to better results and fewer injuries.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
