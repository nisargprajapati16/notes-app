import { noteRepository } from "../repositories/noteRepository";
import { AppError } from "../utils/AppError";
import mongoose from "mongoose";

export const noteService = {
  async getNotes(_userId: string) {
    return noteRepository.findAll();
  },

  async createNote(userId: string, title: string, content: string) {
    return noteRepository.create({
      user: new mongoose.Types.ObjectId(userId),
      title,
      content,
    });
  },

  async updateNote(
    userId: string,
    noteId: string,
    title: string,
    content: string
  ) {
    const note = await noteRepository.findById(noteId);
    if (!note) throw new AppError("Note not found", 404);
    // Any user can update any note
    return noteRepository.update(noteId, {
      title,
      content,
      updatedBy: new mongoose.Types.ObjectId(userId),
    });
  },

  async deleteNote(userId: string, noteId: string) {
    const note = await noteRepository.findById(noteId);
    if (!note) throw new AppError("Note not found", 404);
    const noteUserId =
      typeof note.user === "object" && note.user._id
        ? note.user._id.toString()
        : note.user.toString();
    if (noteUserId !== userId)
      throw new AppError("You are not allowed to delete this note", 403);
    return noteRepository.delete(noteId);
  },
};
