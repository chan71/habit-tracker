import { habits, type Habit, type InsertHabit } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getHabits(): Promise<Habit[]>;
  createHabit(habit: InsertHabit): Promise<Habit>;
  deleteHabit(id: number): Promise<void>;
  toggleHabitCompletion(id: number, date: string): Promise<Habit>;
}

export class DatabaseStorage implements IStorage {
  async getHabits(): Promise<Habit[]> {
    return await db.select().from(habits);
  }

  async createHabit(insertHabit: InsertHabit): Promise<Habit> {
    const [habit] = await db
      .insert(habits)
      .values({ ...insertHabit, completedDays: [] })
      .returning();
    return habit;
  }

  async deleteHabit(id: number): Promise<void> {
    await db.delete(habits).where(eq(habits.id, id));
  }

  async toggleHabitCompletion(id: number, date: string): Promise<Habit> {
    const [habit] = await db.select().from(habits).where(eq(habits.id, id));
    if (!habit) throw new Error("Habit not found");

    const completedDays = [...habit.completedDays];
    const index = completedDays.indexOf(date);

    if (index === -1) {
      completedDays.push(date);
    } else {
      completedDays.splice(index, 1);
    }

    const [updated] = await db
      .update(habits)
      .set({ completedDays })
      .where(eq(habits.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();