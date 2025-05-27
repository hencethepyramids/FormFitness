import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  User, 
  Settings, 
  Bell,
  Moon,
  Sun,
  Target,
  Activity,
  Award,
  ChevronRight,
  Mail,
  Calendar,
  Ruler,
  Weight,
  Flame
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const [theme, setTheme] = useState<"light" | "dark" | "athletic">("light");
  const [notifications, setNotifications] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  // Load current theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | "athletic" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const handleThemeChange = (newTheme: "light" | "dark" | "athletic") => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    
    // Remove all theme classes first
    document.documentElement.classList.remove("dark", "athletic");
    
    // Add the appropriate theme class
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (newTheme === "athletic") {
      document.documentElement.classList.add("athletic");
    }
    
    toast({
      title: "Theme Updated",
      description: `Switched to ${newTheme} theme`,
    });
  };

  const [userInfo, setUserInfo] = useState({
    name: "Alex",
    email: "alex@example.com",
    age: 28,
    height: "5'10\"",
    weight: "175 lbs",
    fitnessLevel: "Intermediate"
  });

  const stats = {
    totalWorkouts: 45,
    weekStreak: 5,
    personalRecords: 3,
    totalTime: "32.5h"
  };

  const achievements = [
    { title: "First Workout", earned: true },
    { title: "Week Warrior", earned: true },
    { title: "Personal Best", earned: true },
    { title: "Consistency King", earned: false }
  ];

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };



  return (
    <div className="min-h-screen bg-background bottom-nav-padding">
      {/* Header */}
      <header className="bg-white dark:bg-card border-b border-gray-100 dark:border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800 dark:text-foreground">Profile</h1>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsEditing(!isEditing)}
            className="rounded-lg"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Profile Info */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <Input
                    value={userInfo.name}
                    onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="text-lg font-semibold mb-1"
                  />
                ) : (
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-foreground">{userInfo.name}</h2>
                )}
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  {isEditing ? (
                    <Input
                      value={userInfo.email}
                      onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                      className="text-sm"
                    />
                  ) : (
                    <span className="text-sm text-gray-600 dark:text-muted-foreground">{userInfo.email}</span>
                  )}
                </div>
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {userInfo.fitnessLevel}
              </Badge>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 dark:bg-muted rounded-lg">
                <div className="text-xl font-bold text-primary">{stats.totalWorkouts}</div>
                <div className="text-xs text-gray-600 dark:text-muted-foreground">Total Workouts</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-muted rounded-lg">
                <div className="text-xl font-bold text-secondary">{stats.weekStreak}</div>
                <div className="text-xs text-gray-600 dark:text-muted-foreground">Week Streak</div>
              </div>
            </div>

            {isEditing && (
              <div className="mt-4 flex space-x-2">
                <Button onClick={handleSave} className="flex-1">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Body Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Body Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-muted-foreground">
                  <Ruler className="w-4 h-4" />
                  <span>Height</span>
                </div>
                {isEditing ? (
                  <Input
                    value={userInfo.height}
                    onChange={(e) => setUserInfo(prev => ({ ...prev, height: e.target.value }))}
                  />
                ) : (
                  <div className="text-lg font-semibold text-gray-800 dark:text-foreground">{userInfo.height}</div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-muted-foreground">
                  <Weight className="w-4 h-4" />
                  <span>Weight</span>
                </div>
                {isEditing ? (
                  <Input
                    value={userInfo.weight}
                    onChange={(e) => setUserInfo(prev => ({ ...prev, weight: e.target.value }))}
                  />
                ) : (
                  <div className="text-lg font-semibold text-gray-800 dark:text-foreground">{userInfo.weight}</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>Achievements</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg text-center ${
                    achievement.earned
                      ? "bg-primary/10 border border-primary/20"
                      : "bg-gray-50 dark:bg-muted border border-gray-200 dark:border-border"
                  }`}
                >
                  <Award className={`w-6 h-6 mx-auto mb-1 ${
                    achievement.earned ? "text-primary" : "text-gray-400"
                  }`} />
                  <div className={`text-sm font-medium ${
                    achievement.earned ? "text-primary" : "text-gray-600 dark:text-muted-foreground"
                  }`}>
                    {achievement.title}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 dark:bg-muted athletic:bg-muted rounded-lg flex items-center justify-center">
                  {theme === "light" && <Sun className="w-4 h-4" />}
                  {theme === "dark" && <Moon className="w-4 h-4" />}
                  {theme === "athletic" && <Flame className="w-4 h-4 text-orange-500" />}
                </div>
                <div>
                  <div className="font-medium text-gray-800 dark:text-foreground athletic:text-foreground">App Theme</div>
                  <div className="text-sm text-gray-600 dark:text-muted-foreground athletic:text-muted-foreground">Choose your preferred theme</div>
                </div>
              </div>
              <Select value={theme} onValueChange={handleThemeChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center space-x-2">
                      <Sun className="w-4 h-4" />
                      <span>Light</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center space-x-2">
                      <Moon className="w-4 h-4" />
                      <span>Dark</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="athletic">
                    <div className="flex items-center space-x-2">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span>Athletic</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 dark:bg-muted rounded-lg flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium text-gray-800 dark:text-foreground">Notifications</div>
                  <div className="text-sm text-gray-600 dark:text-muted-foreground">Workout reminders</div>
                </div>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 dark:bg-muted rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium text-gray-800 dark:text-foreground">Fitness Goals</div>
                  <div className="text-sm text-gray-600 dark:text-muted-foreground">Set your targets</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 dark:bg-muted rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium text-gray-800 dark:text-foreground">Workout Schedule</div>
                  <div className="text-sm text-gray-600 dark:text-muted-foreground">Plan your sessions</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-sm text-gray-600 dark:text-muted-foreground space-y-1">
              <div>FitTracker v1.0.0</div>
              <div>Your personal fitness companion</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
