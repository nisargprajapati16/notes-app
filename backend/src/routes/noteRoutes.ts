import { Router } from "express";
import { noteController } from "../controllers/noteController";
import { authMiddleware } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import Joi from "joi";

const router = Router();

const noteSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
});

router.get("/", authMiddleware, noteController.getNotes);
router.post(
  "/",
  authMiddleware,
  validate(noteSchema),
  noteController.createNote
);
router.put(
  "/:id",
  authMiddleware,
  validate(noteSchema),
  noteController.updateNote
);
router.delete("/:id", authMiddleware, noteController.deleteNote);

export default router;
