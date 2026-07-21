import express from "express";
import cors from "cors";
import morgan from "morgan";
import { CORS_ORIGIN } from "./config/config.ts";
import { authRouter } from "./routes/auth.routes.ts";
import { bookingRouter } from "./routes/booking.routes.ts";
import { healthRouter } from "./routes/health.routes.ts";
import { errorHandler } from "./middleware/auth.middleware.ts";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: CORS_ORIGIN,
    }),
  );

  app.use(express.json());
  app.use(morgan("dev"));

  app.use("/api", healthRouter);
  app.use("/api/auth", authRouter);
  app.use("/api", bookingRouter);
  app.use(errorHandler);

  return app;
}
