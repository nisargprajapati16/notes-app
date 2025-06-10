import express from "express";
import dotenv from "dotenv";
import { applySecurityMiddleware } from "./middlewares/security";
import { errorHandler } from "./middlewares/errorHandler";
import authRoutes from "./routes/authRoutes";
import noteRoutes from "./routes/noteRoutes";

dotenv.config();

const app = express();

app.use(express.json());
applySecurityMiddleware(app);

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    errorHandler(err, req, res, next);
  }
);

export default app;
