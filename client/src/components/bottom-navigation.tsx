import { Link, useLocation } from "wouter";
import { 
  Home, 
  Dumbbell, 
  TrendingUp, 
  Apple, 
  User 
} from "lucide-react";

const navigationItems = [
  { path: "/workouts", icon: Dumbbell, label: "Workouts" },
  { path: "/progress", icon: TrendingUp, label: "Progress" },
  { path: "/", icon: Home, label: "Home" },
  { path: "/nutrition", icon: Apple, label: "Nutrition" },
  { path: "/profile", icon: User, label: "Profile" },
];

export default function BottomNavigation() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === "/") {
      return location === "/";
    }
    return location.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-card border-t border-gray-200 dark:border-border px-6 py-2 z-50">
      <div className="max-w-sm mx-auto">
        <div className="flex items-center justify-around">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link key={item.path} href={item.path}>
                <button className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                  active 
                    ? "text-primary bg-primary/10" 
                    : "text-gray-400 dark:text-muted-foreground hover:text-gray-600 dark:hover:text-foreground"
                }`}>
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
