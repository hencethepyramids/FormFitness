import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Dumbbell } from "lucide-react";
import { Link } from "wouter";
import type { Exercise } from "@shared/schema";

export default function ExerciseSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const { data: exercises, isLoading } = useQuery<Exercise[]>({
    queryKey: ["/api/exercises", { search: searchQuery }],
    enabled: searchQuery.length > 2,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "advanced": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search exercises..."
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="pl-10 bg-gray-50 dark:bg-muted border-gray-200 dark:border-border focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      {/* Search Results Dropdown */}
      {isFocused && searchQuery.length > 2 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-card border border-gray-200 dark:border-border rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="p-4">
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : exercises && exercises.length > 0 ? (
            <div className="py-2">
              {exercises.slice(0, 6).map((exercise) => (
                <Link key={exercise.id} href={`/exercise/${exercise.id}`}>
                  <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-muted cursor-pointer transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Dumbbell className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-800 dark:text-foreground">{exercise.name}</div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge 
                            variant="secondary" 
                            className={`${getDifficultyColor(exercise.difficulty)} text-xs`}
                          >
                            {exercise.difficulty}
                          </Badge>
                          <span className="text-xs text-gray-600 dark:text-muted-foreground capitalize">
                            {exercise.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              {exercises.length > 6 && (
                <div className="px-4 py-2 text-center">
                  <Link href={`/workouts?search=${searchQuery}`}>
                    <span className="text-sm text-primary hover:underline cursor-pointer">
                      View all {exercises.length} results
                    </span>
                  </Link>
                </div>
              )}
            </div>
          ) : searchQuery.length > 2 ? (
            <div className="p-4 text-center">
              <div className="text-gray-500 dark:text-muted-foreground">
                <Dumbbell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No exercises found for "{searchQuery}"</p>
                <p className="text-xs mt-1">Try a different search term</p>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Search Suggestions */}
      {isFocused && searchQuery.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-card border border-gray-200 dark:border-border rounded-xl shadow-lg z-50">
          <div className="p-3">
            <div className="text-xs text-gray-600 dark:text-muted-foreground mb-2 font-medium">Popular Searches</div>
            <div className="flex flex-wrap gap-2">
              {["push-ups", "squats", "bench press", "deadlift", "bicep curls"].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setSearchQuery(suggestion)}
                  className="px-3 py-1 text-xs bg-gray-100 dark:bg-muted text-gray-700 dark:text-muted-foreground rounded-full hover:bg-gray-200 dark:hover:bg-muted/80 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
