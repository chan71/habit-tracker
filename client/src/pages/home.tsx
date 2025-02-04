import { useEffect, useState } from "react";
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import HabitGrid from "@/components/habits/habit-grid";
import AddHabitDialog from "@/components/habits/add-habit-dialog";

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddHabit, setShowAddHabit] = useState(false);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-background p-6 font-serif">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-semibold text-foreground">
            {greeting()}, Victoria ⛅
          </h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentDate(subWeeks(currentDate, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <span className="min-w-[150px] text-center">
              {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d")}
            </span>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentDate(addWeeks(currentDate, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </Button>
          </div>
        </header>

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium">Weekly Habits</h2>
          <Button onClick={() => setShowAddHabit(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add habit
          </Button>
        </div>

        <HabitGrid weekStart={weekStart} />
      </div>

      <AddHabitDialog 
        open={showAddHabit} 
        onOpenChange={setShowAddHabit} 
      />
    </div>
  );
}
