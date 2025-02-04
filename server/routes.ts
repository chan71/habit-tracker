import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertHabitSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  app.get("/api/habits", async (_req, res) => {
    const habits = await storage.getHabits();
    res.json(habits);
  });

  app.post("/api/habits", async (req, res) => {
    const parsed = insertHabitSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid habit data" });
    }
    const habit = await storage.createHabit(parsed.data);
    res.json(habit);
  });

  app.delete("/api/habits/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteHabit(id);
    res.status(204).end();
  });

  app.post("/api/habits/:id/toggle/:date", async (req, res) => {
    const id = parseInt(req.params.id);
    const date = req.params.date;
    const habit = await storage.toggleHabitCompletion(id, date);
    res.json(habit);
  });

  return createServer(app);
}
