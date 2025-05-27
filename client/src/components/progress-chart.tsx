import { Card, CardContent } from "@/components/ui/card";

interface ProgressChartProps {
  period: "week" | "month" | "year";
}

export default function ProgressChart({ period }: ProgressChartProps) {
  // Mock data for different periods
  const getChartData = () => {
    switch (period) {
      case "week":
        return [
          { label: "Mon", value: 45, max: 60 },
          { label: "Tue", value: 38, max: 60 },
          { label: "Wed", value: 0, max: 60 },
          { label: "Thu", value: 52, max: 60 },
          { label: "Fri", value: 42, max: 60 },
          { label: "Sat", value: 30, max: 60 },
          { label: "Sun", value: 0, max: 60 },
        ];
      case "month":
        return [
          { label: "Week 1", value: 4, max: 7 },
          { label: "Week 2", value: 5, max: 7 },
          { label: "Week 3", value: 3, max: 7 },
          { label: "Week 4", value: 6, max: 7 },
        ];
      case "year":
        return [
          { label: "Jan", value: 12, max: 20 },
          { label: "Feb", value: 15, max: 20 },
          { label: "Mar", value: 18, max: 20 },
          { label: "Apr", value: 16, max: 20 },
          { label: "May", value: 19, max: 20 },
          { label: "Jun", value: 17, max: 20 },
        ];
      default:
        return [];
    }
  };

  const data = getChartData();
  const maxValue = Math.max(...data.map(d => d.max));

  const getBarColor = (value: number, max: number) => {
    if (value === 0) return "bg-gray-200 dark:bg-gray-700";
    const percentage = (value / max) * 100;
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-primary";
    if (percentage >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getLabel = () => {
    switch (period) {
      case "week":
        return "Workout Duration (minutes)";
      case "month":
        return "Workouts per Week";
      case "year":
        return "Monthly Workouts";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 dark:text-muted-foreground text-center">
        {getLabel()}
      </div>
      
      <div className="flex items-end justify-between space-x-2" style={{ height: "120px" }}>
        {data.map((item, index) => {
          const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full flex flex-col justify-end"
                style={{ height: "80px" }}
              >
                <div
                  className={`w-full rounded-t transition-all duration-300 ${getBarColor(item.value, item.max)}`}
                  style={{ 
                    height: `${percentage}%`,
                    minHeight: item.value > 0 ? "8px" : "0px"
                  }}
                />
                <div 
                  className="w-full bg-gray-100 dark:bg-gray-800 rounded-b"
                  style={{ 
                    height: `${100 - percentage}%`,
                    minHeight: "4px"
                  }}
                />
              </div>
              
              <div className="mt-2 text-center">
                <div className="text-xs font-medium text-gray-800 dark:text-foreground">
                  {item.label}
                </div>
                <div className="text-xs text-gray-600 dark:text-muted-foreground">
                  {period === "week" ? (item.value > 0 ? `${item.value}m` : "Rest") : item.value}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-4 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-gray-600 dark:text-muted-foreground">Excellent</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-primary rounded"></div>
          <span className="text-gray-600 dark:text-muted-foreground">Good</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <span className="text-gray-600 dark:text-muted-foreground">Fair</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <span className="text-gray-600 dark:text-muted-foreground">Rest</span>
        </div>
      </div>
    </div>
  );
}
