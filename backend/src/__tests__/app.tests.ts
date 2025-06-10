import request from "supertest";
import app from "../app";
import mongoose from "mongoose";
import { httpServer } from "../server";

describe("Express App", () => {
  it("should return 404 for unknown routes", async () => {
    const res = await request(app).get("/api/unknown");
    expect(res.statusCode).toBe(404);
  });

  it("should mount /api/auth routes", async () => {
    const res = await request(app).post("/api/auth/login").send({ email: "a", password: "b" });
    expect(res.statusCode).not.toBe(404);
  });

  it("should mount /api/notes routes", async () => {
    const res = await request(app).get("/api/notes");
    expect(res.statusCode).not.toBe(404);
  });

  // Add this block:
  afterAll(async () => {
    await mongoose.connection.close();
    httpServer.close();
  });
});