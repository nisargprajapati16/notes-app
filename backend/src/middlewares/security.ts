import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Express } from "express";

export function applySecurityMiddleware(app: Express) {
  app.use(helmet());
  app.use(
    cors({
      origin: true, // You can restrict this to your frontend URL
      credentials: true,
    })
  );
  app.use(cookieParser());
}
