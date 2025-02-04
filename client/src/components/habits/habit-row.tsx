import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Habit } from "@shared/schema";

interface HabitRowProps {
  habit: Habit;
  weekDays: Array<{ date: string }>;
}

export default function HabitRow({ habit, weekDays }: HabitRowProps) {
  const [showDelete, setShowDelete] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/habits/${habit.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/habits"] });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async (date: string) => {
      await apiRequest("POST", `/api/habits/${habit.id}/toggle/${date}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/habits"] });
    },
  });

  return (
    <>
      <div className="grid grid-cols-[200px,repeat(7,1fr)] group">
        <div className="p-3 flex items-center justify-between">
          <span>
            {habit.emoji} {habit.name}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => setShowDelete(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {weekDays.map(({ date }) => (
          <div key={date} className="border-l p-3 text-center">
            <button
              className={`w-8 h-8 rounded-full transition-colors flex items-center justify-center ${
                habit.completedDays.includes(date)
                  ? "bg-primary/10"
                  : "hover:bg-primary/5"
              }`}
              onClick={() => toggleMutation.mutate(date)}
            >
              {habit.completedDays.includes(date) && habit.emoji}
            </button>
          </div>
        ))}
      </div>

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete habit</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{habit.name}"? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowDelete(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                deleteMutation.mutate();
                setShowDelete(false);
              }}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
