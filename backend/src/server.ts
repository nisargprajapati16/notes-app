import app from "./app";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { setupSocket } from "./socket";

const PORT = process.env.PORT || 3000;
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://<username>:<password>@<db>/";

export const httpServer = createServer(app);
export const io = new SocketIOServer(httpServer, {
  cors: {
    origin: true,
    credentials: true,
  },
});
setupSocket(io);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
