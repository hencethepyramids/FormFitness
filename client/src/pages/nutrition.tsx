import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Apple, 
  Droplets,
  Utensils,
  Target,
  Calendar,
  TrendingUp
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { NutritionEntry } from "@shared/schema";

export default function Nutrition() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [waterIntake, setWaterIntake] = useState(0);
  const { toast } = useToast();

  const { data: nutritionEntries, isLoading } = useQuery<NutritionEntry[]>({
    queryKey: ["/api/nutrition", { date: selectedDate }],
  });

  const addNutritionMutation = useMutation({
    mutationFn: async (data: Partial<NutritionEntry>) => {
      const response = await apiRequest("POST", "/api/nutrition", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/nutrition"] });
      toast({
        title: "Success",
        description: "Nutrition entry added successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add nutrition entry",
        variant: "destructive",
      });
    },
  });

  // Calculate daily totals
  const dailyTotals = nutritionEntries?.reduce(
    (totals, entry) => ({
      calories: totals.calories + (entry.calories || 0),
      protein: totals.protein + (entry.protein || 0),
      carbs: totals.carbs + (entry.carbs || 0),
      fat: totals.fat + (entry.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  ) || { calories: 0, protein: 0, carbs: 0, fat: 0 };

  // Daily goals
  const goals = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 67,
    water: 2.5 // liters
  };

  const quickAddItems = [
    { name: "Protein Shake", calories: 150, protein: 25, carbs: 5, fat: 2 },
    { name: "Banana", calories: 105, protein: 1, carbs: 27, fat: 0 },
    { name: "Oatmeal", calories: 150, protein: 5, carbs: 27, fat: 3 },
    { name: "Chicken Breast (100g)", calories: 165, protein: 31, carbs: 0, fat: 4 },
    { name: "Greek Yogurt", calories: 100, protein: 17, carbs: 6, fat: 0 },
    { name: "Almonds (28g)", calories: 164, protein: 6, carbs: 6, fat: 14 },
  ];

  const addQuickItem = (item: typeof quickAddItems[0]) => {
    addNutritionMutation.mutate({
      foodName: item.name,
      calories: item.calories,
      protein: item.protein,
      carbs: item.carbs,
      fat: item.fat,
      mealType: "snack",
      quantity: 1,
      unit: "serving"
    });
  };

  const addWater = (amount: number) => {
    setWaterIntake(prev => Math.min(prev + amount, goals.water));
  };

  const getProgressColor = (current: number, goal: number) => {
    const percentage = (current / goal) * 100;
    if (percentage >= 100) return "bg-green-500";
    if (percentage >= 75) return "bg-yellow-500";
    return "bg-primary";
  };

  return (
    <div className="min-h-screen bg-background bottom-nav-padding">
      {/* Header */}
      <header className="bg-white dark:bg-card border-b border-gray-100 dark:border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800 dark:text-foreground">Nutrition</h1>
          <Button size="icon" variant="ghost" className="rounded-lg">
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="p-6">
        <Tabs value="today" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="log">Log Food</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>
          
          <TabsContent value="today" className="space-y-4">
            {/* Date Selector */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-foreground">
                {new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h2>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto"
              />
            </div>

            {/* Macro Overview */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-gray-800 dark:text-foreground mb-1">
                    {dailyTotals.calories}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-muted-foreground">
                    of {goals.calories} calories
                  </div>
                  <Progress 
                    value={(dailyTotals.calories / goals.calories) * 100} 
                    className="mt-2 h-2"
                  />
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-secondary/10 to-accent/10">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-gray-800 dark:text-foreground mb-1">
                    {waterIntake.toFixed(1)}L
                  </div>
                  <div className="text-sm text-gray-600 dark:text-muted-foreground">
                    of {goals.water}L water
                  </div>
                  <Progress 
                    value={(waterIntake / goals.water) * 100} 
                    className="mt-2 h-2"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Macronutrients */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Macronutrients</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-muted-foreground">Protein</span>
                      <span className="text-sm font-medium">
                        {dailyTotals.protein.toFixed(1)}g / {goals.protein}g
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className={`progress-bar-fill ${getProgressColor(dailyTotals.protein, goals.protein)}`}
                        style={{ width: `${Math.min((dailyTotals.protein / goals.protein) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-muted-foreground">Carbs</span>
                      <span className="text-sm font-medium">
                        {dailyTotals.carbs.toFixed(1)}g / {goals.carbs}g
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className={`progress-bar-fill ${getProgressColor(dailyTotals.carbs, goals.carbs)}`}
                        style={{ width: `${Math.min((dailyTotals.carbs / goals.carbs) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-muted-foreground">Fat</span>
                      <span className="text-sm font-medium">
                        {dailyTotals.fat.toFixed(1)}g / {goals.fat}g
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className={`progress-bar-fill ${getProgressColor(dailyTotals.fat, goals.fat)}`}
                        style={{ width: `${Math.min((dailyTotals.fat / goals.fat) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Water Intake */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <span>Water Intake</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-blue-500">
                    {waterIntake.toFixed(1)}L
                  </span>
                  <div className="space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => addWater(0.25)}
                      disabled={waterIntake >= goals.water}
                    >
                      +250ml
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => addWater(0.5)}
                      disabled={waterIntake >= goals.water}
                    >
                      +500ml
                    </Button>
                  </div>
                </div>
                <Progress value={(waterIntake / goals.water) * 100} className="h-3" />
              </CardContent>
            </Card>

            {/* Today's Meals */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Today's Meals</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : nutritionEntries && nutritionEntries.length > 0 ? (
                  <div className="space-y-3">
                    {nutritionEntries.map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-muted rounded-lg">
                        <div>
                          <div className="font-medium text-gray-800 dark:text-foreground">{entry.foodName}</div>
                          <div className="text-sm text-gray-600 dark:text-muted-foreground">
                            {entry.calories} cal • {entry.protein}g protein
                          </div>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {entry.mealType}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Apple className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-muted-foreground">No meals logged today</p>
                    <p className="text-sm text-gray-500 dark:text-muted-foreground">Add your first meal to start tracking</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="log" className="space-y-4">
            {/* Quick Add */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Add</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2">
                  {quickAddItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-muted">
                      <div>
                        <div className="font-medium text-gray-800 dark:text-foreground">{item.name}</div>
                        <div className="text-sm text-gray-600 dark:text-muted-foreground">
                          {item.calories} cal • {item.protein}g protein
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => addQuickItem(item)}
                        disabled={addNutritionMutation.isPending}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Custom Entry */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Add Custom Food</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input placeholder="Food name" />
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="Calories" type="number" />
                    <Input placeholder="Protein (g)" type="number" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="Carbs (g)" type="number" />
                    <Input placeholder="Fat (g)" type="number" />
                  </div>
                  <Button className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Food
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Weekly Average</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-800 dark:text-foreground">1,850</div>
                    <div className="text-sm text-gray-600 dark:text-muted-foreground">Avg Calories</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-secondary">95g</div>
                    <div className="text-sm text-gray-600 dark:text-muted-foreground">Avg Protein</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-medium text-gray-800 dark:text-foreground mb-2">Nutrition trends coming soon</h3>
                <p className="text-sm text-gray-600 dark:text-muted-foreground">
                  Track your nutrition over time with detailed charts and insights
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
