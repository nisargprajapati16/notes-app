import { Note, INote } from "../models/Note";

export const noteRepository = {
  findAll: () =>
    Note.find({}).populate("user", "email").populate("updatedBy", "email"),
  findByUser: (userId: string) => Note.find({ user: userId }),
  findById: (id: string) =>
    Note.findById(id).populate("user", "email").populate("updatedBy", "email"),
  create: (noteData: Partial<INote>) => Note.create(noteData),
  update: (id: string, noteData: Partial<INote>) =>
    Note.findByIdAndUpdate(id, noteData, { new: true }),
  delete: (id: string) => Note.findByIdAndDelete(id),
};
