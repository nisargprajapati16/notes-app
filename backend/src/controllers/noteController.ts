import { Request, Response, NextFunction } from "express";
import { noteService } from "../services/noteService";
import { AuthRequest } from "../middlewares/auth";
import { io } from "../server";

export const noteController = {
  async getNotes(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const notes = await noteService.getNotes(req.user.id);
      res.json(notes);
    } catch (err) {
      next(err);
    }
  },
  async createNote(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { title, content } = req.body;
      const note = await noteService.createNote(req.user.id, title, content);
      io.emit("note:created", note);
      res.status(201).json(note);
    } catch (err) {
      next(err);
    }
  },
  async updateNote(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { title, content } = req.body;
      const note = await noteService.updateNote(
        req.user.id,
        req.params.id,
        title,
        content
      );
      io.emit("note:updated", note);
      res.json(note);
    } catch (err) {
      next(err);
    }
  },
  async deleteNote(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await noteService.deleteNote(req.user.id, req.params.id);
      io.emit("note:deleted", req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
