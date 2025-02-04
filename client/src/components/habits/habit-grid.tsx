import { format, addDays } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import HabitRow from "./habit-row";
import { Skeleton } from "@/components/ui/skeleton";

export default function HabitGrid({ weekStart }: { weekStart: Date }) {
  const { data: habits, isLoading } = useQuery({
    queryKey: ["/api/habits"],
  });

  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const date = addDays(weekStart, i);
    return {
      short: format(date, "EEE"),
      full: format(date, "EEEE"),
      date: format(date, "yyyy-MM-dd"),
    };
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border">
      <div className="grid grid-cols-[200px,repeat(7,1fr)] border-b">
        <div className="p-3 font-medium">Habit</div>
        {weekDays.map((day) => (
          <div
            key={day.date}
            className="p-3 text-center font-medium border-l"
            title={day.full}
          >
            {day.short}
          </div>
        ))}
      </div>

      <div className="divide-y">
        {habits?.map((habit) => (
          <HabitRow
            key={habit.id}
            habit={habit}
            weekDays={weekDays}
          />
        ))}
      </div>
    </div>
  );
}
