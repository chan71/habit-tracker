import { habits, type Habit, type InsertHabit } from "@shared/schema";

export interface IStorage {
  getHabits(): Promise<Habit[]>;
  createHabit(habit: InsertHabit): Promise<Habit>;
  deleteHabit(id: number): Promise<void>;
  toggleHabitCompletion(id: number, date: string): Promise<Habit>;
}

export class MemStorage implements IStorage {
  private habits: Map<number, Habit>;
  currentId: number;

  constructor() {
    this.habits = new Map();
    this.currentId = 1;
    
    // Add example habits
    const examples = [
      { name: "Journal", emoji: "📓" },
      { name: "Lift", emoji: "🏋️" },
      { name: "Yoga", emoji: "🧘" },
      { name: "Drink water", emoji: "💧" },
      { name: "Walk the dog", emoji: "🐕" },
      { name: "Plant care", emoji: "🪴" },
      { name: "Skin care", emoji: "🧴" },
      { name: "Read", emoji: "📚" },
      { name: "8hrs of sleep", emoji: "💤" }
    ];

    examples.forEach(h => {
      this.createHabit(h);
    });
  }

  async getHabits(): Promise<Habit[]> {
    return Array.from(this.habits.values());
  }

  async createHabit(insertHabit: InsertHabit): Promise<Habit> {
    const id = this.currentId++;
    const habit: Habit = { ...insertHabit, id, completedDays: [] };
    this.habits.set(id, habit);
    return habit;
  }

  async deleteHabit(id: number): Promise<void> {
    this.habits.delete(id);
  }

  async toggleHabitCompletion(id: number, date: string): Promise<Habit> {
    const habit = this.habits.get(id);
    if (!habit) throw new Error("Habit not found");
    
    const completedDays = [...habit.completedDays];
    const index = completedDays.indexOf(date);
    
    if (index === -1) {
      completedDays.push(date);
    } else {
      completedDays.splice(index, 1);
    }

    const updated = { ...habit, completedDays };
    this.habits.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
