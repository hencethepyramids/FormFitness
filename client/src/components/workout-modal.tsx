import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Clock, 
  Target,
  Dumbbell,
  X
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface WorkoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workout: {
    name: string;
    exercises: string;
    duration: string;
  };
}

export default function WorkoutModal({ open, onOpenChange, workout }: WorkoutModalProps) {
  const { toast } = useToast();

  const createWorkoutMutation = useMutation({
    mutationFn: async () => {
      const workoutData = {
        name: workout.name,
        workoutPlanId: null,
        notes: `Quick workout session for ${workout.name}`,
      };

      const response = await apiRequest("POST", "/api/workout-sessions", workoutData);
      return response.json();
    },
    onSuccess: (session) => {
      queryClient.invalidateQueries({ queryKey: ["/api/workout-sessions"] });
      onOpenChange(false);
      toast({
        title: "Workout Started!",
        description: `Started your ${workout.name} session`,
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

  const exercises = [
    { name: "Bench Press", sets: "3 sets", reps: "8-10 reps" },
    { name: "Incline Dumbbell Press", sets: "3 sets", reps: "8-12 reps" },
    { name: "Shoulder Press", sets: "3 sets", reps: "10-12 reps" },
    { name: "Pull-ups", sets: "3 sets", reps: "6-8 reps" },
    { name: "Tricep Dips", sets: "3 sets", reps: "10-15 reps" },
    { name: "Bicep Curls", sets: "3 sets", reps: "12-15 reps" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Start Workout</DialogTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onOpenChange(false)}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            Get ready to crush your {workout.name.toLowerCase()} session!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Workout Overview */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4">
            <h3 className="font-semibold text-gray-800 dark:text-foreground mb-2">{workout.name}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Target className="w-4 h-4" />
                <span>{workout.exercises}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{workout.duration}</span>
              </div>
            </div>
          </div>

          {/* Exercise List */}
          <div className="bg-gray-50 dark:bg-muted rounded-xl p-4">
            <h4 className="font-medium text-gray-800 dark:text-foreground mb-3">Today's Exercises</h4>
            <div className="space-y-2">
              {exercises.map((exercise, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-gray-700 dark:text-muted-foreground">{exercise.name}</span>
                  </div>
                  <div className="text-gray-600 dark:text-muted-foreground">
                    {exercise.sets} × {exercise.reps}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <div className="flex items-start space-x-2">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">i</span>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">Pro Tip</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Warm up with 5-10 minutes of light cardio before starting your workout.
                  Focus on proper form over heavy weights.
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button 
            className="w-full h-12 text-lg"
            onClick={() => createWorkoutMutation.mutate()}
            disabled={createWorkoutMutation.isPending}
          >
            <Play className="w-5 h-5 mr-2" />
            {createWorkoutMutation.isPending ? "Starting..." : "Begin Workout"}
          </Button>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2">
              <div className="text-lg font-bold text-primary">6</div>
              <div className="text-xs text-gray-600 dark:text-muted-foreground">Exercises</div>
            </div>
            <div className="p-2">
              <div className="text-lg font-bold text-secondary">18</div>
              <div className="text-xs text-gray-600 dark:text-muted-foreground">Total Sets</div>
            </div>
            <div className="p-2">
              <div className="text-lg font-bold text-accent">45</div>
              <div className="text-xs text-gray-600 dark:text-muted-foreground">Minutes</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
