import { Request, Response, NextFunction } from "express";
import { authService } from "../services/authService";

const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
) => {
  res.cookie("token", accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 1000, // 60 min
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const authController = {
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const user = await authService.signup(email, password);
      const accessToken = authService.generateAccessToken(user);
      const refreshToken = authService.generateRefreshToken(user);
      authService.storeRefreshToken((user as any)._id.toString(), refreshToken);
      setAuthCookies(res, accessToken, refreshToken);
      const userObj = user as any;
      res
        .status(201)
        .json({ user: { email: userObj.email, id: userObj._id.toString() } });
    } catch (err) {
      next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const user = await authService.login(email, password);
      const accessToken = authService.generateAccessToken(user);
      const refreshToken = authService.generateRefreshToken(user);
      authService.storeRefreshToken((user as any)._id.toString(), refreshToken);
      setAuthCookies(res, accessToken, refreshToken);
      const userObj = user as any;
      res
        .status(200)
        .json({ user: { email: userObj.email, id: userObj._id.toString() } });
    } catch (err) {
      next(err);
    }
  },

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshTokenCookie = req.cookies?.refreshToken;
      if (!refreshTokenCookie) {
        return res.status(401).json({ message: "No refresh token provided" });
      }
      let payload;
      try {
        payload = authService.verifyRefreshToken(refreshTokenCookie);
      } catch (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }
      if (!authService.isRefreshTokenValid(payload.id, refreshTokenCookie)) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }
      // Rotate refresh token
      const user = await authService.getUserById(payload.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const newAccessToken = authService.generateAccessToken(user);
      const newRefreshToken = authService.generateRefreshToken(user);
      authService.rotateRefreshToken(payload.id, newRefreshToken);
      setAuthCookies(res, newAccessToken, newRefreshToken);
      const userObj = user as any;
      res
        .status(200)
        .json({ user: { email: userObj.email, id: userObj._id.toString() } });
    } catch (err) {
      next(err);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (refreshToken) {
        try {
          const payload = authService.verifyRefreshToken(refreshToken);
          authService.removeRefreshToken(payload.id);
        } catch {}
      }
      res.clearCookie("token");
      res.clearCookie("refreshToken");
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
