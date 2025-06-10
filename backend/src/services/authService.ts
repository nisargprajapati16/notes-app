import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/userRepository";
import { AppError } from "../utils/AppError";
import { IUser } from "../models/User";
import { refreshTokenStore } from "../utils/refreshTokenStore";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "default_refresh_secret";
const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "7d";

export const authService = {
  async signup(email: string, password: string) {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) throw new AppError("Email already in use", 400);
    const user = await userRepository.create({ email, password });
    return user;
  },

  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new AppError("Invalid credentials", 401);
    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new AppError("Invalid credentials", 401);
    return user;
  },

  generateAccessToken(user: IUser) {
    return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
  },

  generateRefreshToken(user: IUser) {
    return jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });
  },

  storeRefreshToken(userId: string, token: string) {
    refreshTokenStore.add(userId, token);
  },

  verifyRefreshToken(token: string) {
    try {
      return jwt.verify(token, JWT_REFRESH_SECRET) as { id: string };
    } catch {
      throw new AppError("Invalid refresh token", 401);
    }
  },

  isRefreshTokenValid(userId: string, token: string) {
    return refreshTokenStore.verify(userId, token);
  },

  rotateRefreshToken(userId: string, newToken: string) {
    refreshTokenStore.rotate(userId, newToken);
  },

  removeRefreshToken(userId: string) {
    refreshTokenStore.remove(userId);
  },

  async getUserById(userId: string) {
    return userRepository.findById(userId);
  },
};
