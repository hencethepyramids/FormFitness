import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Play, 
  Pause,
  Check,
  Plus,
  Minus,
  Timer,
  Target,
  RotateCcw,
  Save
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { WorkoutSession, Exercise, Set } from "@shared/schema";

interface WorkoutExercise {
  exercise: Exercise;
  sets: Set[];
  targetSets: number;
  targetReps: string;
  restTime: number;
}

export default function WorkoutSessionPage() {
  const { id } = useParams();
  const { toast } = useToast();
  
  const [isActive, setIsActive] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);

  const { data: session, isLoading } = useQuery<WorkoutSession>({
    queryKey: [`/api/workout-sessions/${id}`],
    enabled: !!id,
  });

  const { data: sessionSets } = useQuery<Set[]>({
    queryKey: [`/api/workout-sessions/${id}/sets`],
    enabled: !!id,
  });

  // Mock workout exercises for demo - in real app would come from workout plan
  const workoutExercises: WorkoutExercise[] = [
    {
      exercise: {
        id: 1,
        name: "Bench Press",
        category: "chest",
        muscleGroups: ["chest", "shoulders", "triceps"],
        instructions: ["Setup on bench", "Lower bar to chest", "Press up"],
        equipment: "Barbell",
        difficulty: "intermediate",
        imageUrl: ""
      },
      sets: [],
      targetSets: 3,
      targetReps: "8-10",
      restTime: 90
    },
    {
      exercise: {
        id: 2,
        name: "Incline Dumbbell Press",
        category: "chest",
        muscleGroups: ["chest", "shoulders"],
        instructions: ["Set bench to incline", "Press dumbbells up"],
        equipment: "Dumbbells",
        difficulty: "intermediate",
        imageUrl: ""
      },
      sets: [],
      targetSets: 3,
      targetReps: "10-12",
      restTime: 75
    }
  ];

  const updateSessionMutation = useMutation({
    mutationFn: async (updates: Partial<WorkoutSession>) => {
      const response = await apiRequest("PUT", `/api/workout-sessions/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/workout-sessions/${id}`] });
    },
  });

  const createSetMutation = useMutation({
    mutationFn: async (setData: Partial<Set>) => {
      const response = await apiRequest("POST", "/api/sets", {
        ...setData,
        workoutSessionId: parseInt(id!),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/workout-sessions/${id}/sets`] });
      toast({
        title: "Set Logged",
        description: "Your set has been recorded successfully",
      });
    },
  });

  // Timer effects
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            setIsResting(false);
            toast({
              title: "Rest Complete",
              description: "Time for your next set!",
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isResting, restTimer, toast]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const startSession = () => {
    setIsActive(true);
    updateSessionMutation.mutate({ startTime: new Date() });
  };

  const endSession = () => {
    setIsActive(false);
    updateSessionMutation.mutate({ 
      endTime: new Date(),
      notes: `Completed workout session - Duration: ${formatTime(sessionTime)}`
    });
    toast({
      title: "Workout Complete!",
      description: `Great job! You worked out for ${formatTime(sessionTime)}`,
    });
  };

  const logSet = (exerciseIndex: number, reps: number, weight: number) => {
    const exercise = workoutExercises[exerciseIndex];
    const setNumber = exercise.sets.length + 1;
    
    createSetMutation.mutate({
      exerciseId: exercise.exercise.id,
      setNumber,
      reps,
      weight,
      completed: true,
    });

    // Start rest timer
    setRestTimer(exercise.restTime);
    setIsResting(true);
    
    // Update local state
    workoutExercises[exerciseIndex].sets.push({
      id: Date.now(),
      workoutSessionId: parseInt(id!),
      exerciseId: exercise.exercise.id,
      setNumber,
      reps,
      weight,
      completed: true,
    } as Set);
  };

  const currentExercise = workoutExercises[currentExerciseIndex];
  const totalSets = workoutExercises.reduce((total, ex) => total + ex.targetSets, 0);
  const completedSets = workoutExercises.reduce((total, ex) => total + ex.sets.length, 0);
  const progressPercentage = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="animate-pulse p-6 space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
          <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white dark:bg-card border-b border-gray-100 dark:border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/workouts">
              <Button variant="ghost" size="icon" className="rounded-lg">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-foreground">
                {session?.name || "Workout Session"}
              </h1>
              <p className="text-sm text-gray-600 dark:text-muted-foreground">
                {formatTime(sessionTime)}
              </p>
            </div>
          </div>
          {!isActive ? (
            <Button onClick={startSession} className="flex items-center space-x-2">
              <Play className="w-4 h-4" />
              <span>Start</span>
            </Button>
          ) : (
            <Button onClick={endSession} variant="destructive" className="flex items-center space-x-2">
              <Save className="w-4 h-4" />
              <span>Finish</span>
            </Button>
          )}
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Progress Overview */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600 dark:text-muted-foreground">Overall Progress</span>
              <span className="text-sm font-medium">{completedSets}/{totalSets} sets</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </CardContent>
        </Card>

        {/* Rest Timer */}
        {isResting && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 text-center">
              <Timer className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary mb-1">
                {formatTime(restTimer)}
              </div>
              <div className="text-sm text-gray-600 dark:text-muted-foreground">Rest Time Remaining</div>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => {
                  setIsResting(false);
                  setRestTimer(0);
                }}
              >
                Skip Rest
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Current Exercise */}
        {currentExercise && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{currentExercise.exercise.name}</CardTitle>
                <Badge variant="outline">
                  {currentExerciseIndex + 1} of {workoutExercises.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Target Info */}
                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 dark:bg-muted rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-800 dark:text-foreground">
                      {currentExercise.targetSets}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-muted-foreground">Target Sets</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-800 dark:text-foreground">
                      {currentExercise.targetReps}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-muted-foreground">Target Reps</div>
                  </div>
                </div>

                {/* Completed Sets */}
                {currentExercise.sets.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-foreground mb-2">Completed Sets</h4>
                    <div className="space-y-2">
                      {currentExercise.sets.map((set, index) => (
                        <div key={set.id} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                          <div className="flex items-center space-x-2">
                            <Check className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium">Set {index + 1}</span>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-muted-foreground">
                            {set.reps} reps @ {set.weight} lbs
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Log New Set */}
                {currentExercise.sets.length < currentExercise.targetSets && (
                  <SetLogger 
                    setNumber={currentExercise.sets.length + 1}
                    onLogSet={(reps, weight) => logSet(currentExerciseIndex, reps, weight)}
                  />
                )}

                {/* Exercise Navigation */}
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    disabled={currentExerciseIndex === 0}
                    onClick={() => setCurrentExerciseIndex(prev => Math.max(0, prev - 1))}
                  >
                    Previous Exercise
                  </Button>
                  <Button
                    variant="outline"
                    disabled={currentExerciseIndex === workoutExercises.length - 1}
                    onClick={() => setCurrentExerciseIndex(prev => Math.min(workoutExercises.length - 1, prev + 1))}
                  >
                    Next Exercise
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Exercise List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Exercise List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {workoutExercises.map((workoutEx, index) => (
                <div
                  key={workoutEx.exercise.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    index === currentExerciseIndex
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 dark:border-border hover:bg-gray-50 dark:hover:bg-muted"
                  }`}
                  onClick={() => setCurrentExerciseIndex(index)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-800 dark:text-foreground">
                        {workoutEx.exercise.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-muted-foreground">
                        {workoutEx.sets.length}/{workoutEx.targetSets} sets • {workoutEx.targetReps} reps
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {workoutEx.sets.length === workoutEx.targetSets && (
                        <Check className="w-5 h-5 text-green-500" />
                      )}
                      <Target className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Set Logger Component
interface SetLoggerProps {
  setNumber: number;
  onLogSet: (reps: number, weight: number) => void;
}

function SetLogger({ setNumber, onLogSet }: SetLoggerProps) {
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState(135);

  const handleSubmit = () => {
    onLogSet(reps, weight);
  };

  return (
    <div className="p-4 border border-primary/20 rounded-lg bg-primary/5">
      <h4 className="font-medium text-gray-800 dark:text-foreground mb-3">Log Set {setNumber}</h4>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm text-gray-600 dark:text-muted-foreground mb-1 block">Reps</label>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setReps(prev => Math.max(1, prev - 1))}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Input
              type="number"
              value={reps}
              onChange={(e) => setReps(parseInt(e.target.value) || 0)}
              className="text-center"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setReps(prev => prev + 1)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div>
          <label className="text-sm text-gray-600 dark:text-muted-foreground mb-1 block">Weight (lbs)</label>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setWeight(prev => Math.max(0, prev - 5))}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Input
              type="number"
              value={weight}
              onChange={(e) => setWeight(parseInt(e.target.value) || 0)}
              className="text-center"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setWeight(prev => prev + 5)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <Button onClick={handleSubmit} className="w-full">
        <Check className="w-4 h-4 mr-2" />
        Log Set
      </Button>
    </div>
  );
}
