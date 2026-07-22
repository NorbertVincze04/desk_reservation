import type { Request, Response } from "express";
import { pool } from "../config/db.ts";

export class HealthController {
  static async testConnection(_req: Request, res: Response): Promise<void> {
    try {
      await pool.query("SELECT NOW()");
      res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(503).json({
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
