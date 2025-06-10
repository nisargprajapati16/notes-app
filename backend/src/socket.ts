import { Server as SocketIOServer, Socket } from "socket.io";

interface EditingUser {
  userId: string;
  userName: string;
}
const noteEditors: Record<string, Record<string, EditingUser>> = {};

export function setupSocket(io: SocketIOServer) {
  io.on("connection", (socket: Socket) => {
    // Join a note room
    socket.on("joinNote", ({ noteId, userId, userName }) => {
      socket.join(noteId);
      if (!noteEditors[noteId]) noteEditors[noteId] = {};
      noteEditors[noteId][socket.id] = { userId, userName };
      socket.to(noteId).emit(
        "editingIndicator",
        Object.values(noteEditors[noteId])
      );
    });

    // Leave a note room
    socket.on("leaveNote", ({ noteId }) => {
      socket.leave(noteId);
      if (noteEditors[noteId]) {
        delete noteEditors[noteId][socket.id];
        socket.to(noteId).emit(
          "editingIndicator",
          Object.values(noteEditors[noteId])
        );
      }
    });

    // User is editing a note (content change)
    socket.on("editNote", ({ noteId, note }) => {
      socket.emit("note:updated", note);
    });

    socket.on("editingIndicator", ({ noteId, userId, userName, editing }) => {
      if (!noteEditors[noteId]) noteEditors[noteId] = {};
      if (editing) {
        noteEditors[noteId][socket.id] = { userId, userName };
      } else {
        delete noteEditors[noteId][socket.id];
        if (Object.keys(noteEditors[noteId]).length === 0) {
          delete noteEditors[noteId];
        }
      }
      socket.to(noteId).emit(
        "editingIndicator",
        Object.values(noteEditors[noteId] || {})
      );
    });

    socket.on("note:liveUpdate", ({ noteId, title, content }) => {
      // Broadcast to others in the same note room except sender
      socket.to(noteId).emit("note:liveUpdate", { noteId, title, content });
    });

    socket.on("disconnect", () => {
      for (const noteId in noteEditors) {
        if (noteEditors[noteId][socket.id]) {
          delete noteEditors[noteId][socket.id];
          if (Object.keys(noteEditors[noteId]).length === 0) {
            delete noteEditors[noteId];
          }
          socket.to(noteId).emit(
            "editingIndicator",
            Object.values(noteEditors[noteId] || {})
          );
        }
      }
    });
  });
}
