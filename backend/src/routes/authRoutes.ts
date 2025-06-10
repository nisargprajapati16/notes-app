import { Router } from "express";
import { authController } from "../controllers/authController";
import { validate } from "../middlewares/validate";
import Joi from "joi";

const router = Router();

const authSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

router.post("/signup", validate(authSchema), authController.signup);
router.post("/login", validate(authSchema), authController.login);
router.post("/refresh-token", authController.refreshToken as any);
router.post("/logout", authController.logout);

export default router;
