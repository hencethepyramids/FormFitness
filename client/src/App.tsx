import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";

import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Workouts from "@/pages/workouts";
import ProgressPage from "@/pages/progress";
import Nutrition from "@/pages/nutrition";
import Profile from "@/pages/profile";
import ExerciseDetail from "@/pages/exercise-detail";
import WorkoutSession from "@/pages/workout-session";
import { Login } from "@/pages/Login";

import BottomNavigation from "@/components/bottom-navigation";

// Theme Provider
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark" | "athletic">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | "athletic" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    // Remove all theme classes first
    document.documentElement.classList.remove("dark", "athletic");
    
    // Add the appropriate theme class
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme === "athletic") {
      document.documentElement.classList.add("athletic");
    }
  }, [theme]);

  return (
    <div className="theme-provider">
      {children}
    </div>
  );
}

function Router() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [location] = useLocation();

  useEffect(() => {
    // Check if user is logged in
    fetch('/api/auth/current-user')
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // If user is not logged in and not on login page, redirect to login
  if (!user && location !== '/login') {
    return <Login />;
  }

  return (
    <div className="mobile-container">
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/" component={Home} />
        <Route path="/workouts" component={Workouts} />
        <Route path="/progress" component={ProgressPage} />
        <Route path="/nutrition" component={Nutrition} />
        <Route path="/profile" component={Profile} />
        <Route path="/exercise/:id" component={ExerciseDetail} />
        <Route path="/workout-session/:id?" component={WorkoutSession} />
        <Route component={NotFound} />
      </Switch>
      {user && <BottomNavigation />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
