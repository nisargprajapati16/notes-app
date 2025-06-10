import { useEffect, useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Note } from "../api/notes";
import { fetchNotes, createNote, updateNote, deleteNote } from "../api/notes";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store";
import { setUser } from "../store/authSlice";
import { Box, Typography, Button } from "@mui/material";
import Grid from "@mui/material/Grid";
import AddIcon from "@mui/icons-material/Add";
import { logout as logoutApi } from "../api/auth";
import { useNavigate } from "react-router-dom";
import socket from "../api/socket";
import { showSnackbar } from "../store/uiSlice";
import NoteCard from "../components/NoteCard";
import NoteDialog from "../components/NoteDialog";

function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timer: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export default function NotesDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    data: notes,
    isLoading,
    isError,
  } = useQuery<Note[]>({
    queryKey: ["notes"],
    queryFn: fetchNotes,
  });
  const user = useSelector((state: RootState) => state.auth.user);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editNote, setEditNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingUsers, setEditingUsers] = useState<string[]>([]);
  const editingTimeout = useRef<NodeJS.Timeout | null>(null);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  // Mutations
  const createMutation = useMutation({
    mutationFn: () => createNote(title, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setModalOpen(false);
      setTitle("");
      setContent("");
    },
  });
  const updateMutation = useMutation({
    mutationFn: () => {
      if (editNote) return updateNote(editNote._id, title, content);
      return Promise.reject(new Error("No note to update"));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setModalOpen(false);
      setEditNote(null);
      setTitle("");
      setContent("");
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const debouncedLiveUpdate = useRef(
    debounce((noteId: string, title: string, content: string) => {
      socket.emit("note:liveUpdate", { noteId, title, content });
    }, 400)
  ).current;

  // Placeholder for real-time updates (Socket.IO integration)
  useEffect(() => {
    if (!user) return;
    socket.connect();
    socket.on("editingIndicator", (users: any[]) => {
      setEditingUsers(
        users.map((u) => u.userName).filter((name) => name !== user.email)
      );
    });
    socket.on("note:liveUpdate", ({ title: newTitle, content: newContent }) => {
      setTitle(newTitle);
      setContent(newContent);
    });

    socket.on("note:updated", () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    });
    socket.on("note:created", () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    });
    socket.on("note:deleted", () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    });
    return () => {
      socket.off("note:updated");
      socket.off("editingIndicator");
      socket.off("note:created");
      socket.off("note:deleted");
      socket.off("note:liveUpdate");
      socket.disconnect();
    };
  }, [user, queryClient]);

  // Auto-save every 10 seconds when editing a note
  useEffect(() => {
    if (!modalOpen || !editNote) {
      if (autoSaveTimer) clearInterval(autoSaveTimer);
      return;
    }
    const timer = setInterval(() => {
      if (
        editNote &&
        (title !== editNote.title || content !== editNote.content)
      ) {
        updateMutation.mutate(undefined, {
          onSuccess: () => {
            console.log("Auto-saving note...");
            socket.emit("editNote", {
              noteId: editNote._id,
              note: { title, content },
            });
            dispatch(
              showSnackbar({ message: "Note auto-saved", severity: "success" })
            );
          },
        });
      }
    }, 10000);
    setAutoSaveTimer(timer);
    return () => {
      clearInterval(timer);
      setAutoSaveTimer(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalOpen, editNote, title, content]);

  const handleLogout = async () => {
    await logoutApi();
    dispatch(setUser(null));
    navigate("/login");
  };

  const openCreateModal = () => {
    setEditNote(null);
    setTitle("");
    setContent("");
    setModalOpen(true);
  };

  const openEditModal = (note: Note) => {
    setEditNote(note);
    setTitle(note.title);
    setContent(note.content);
    setModalOpen(true);

    socket.emit("joinNote", {
      noteId: note._id,
      userId: user?.id,
      userName: user?.email,
    });
    socket.emit("editingIndicator", {
      noteId: note._id,
      userId: user?.id,
      userName: user?.email,
      editing: true,
    });
  };

  const handleModalClose = () => {
    setModalOpen(false);
    if (editNote) {
      socket.emit("editingIndicator", {
        noteId: editNote._id,
        userId: user?.id,
        userName: user?.email,
        editing: false,
      });
      socket.emit("leaveNote", { noteId: editNote._id });
    }
    setEditNote(null);
    setTitle("");
    setContent("");
    setEditingUsers([]);
  };

  const handleEditorChange = (field: "title" | "content", value: string) => {
    if (field === "title") setTitle(value);
    else setContent(value);
    if (editNote) {
      socket.emit("editingIndicator", {
        noteId: editNote._id,
        userId: user?.id,
        userName: user?.email,
        editing: true,
      });
      if (editingTimeout.current) clearTimeout(editingTimeout.current);
      editingTimeout.current = setTimeout(() => {
        socket.emit("editingIndicator", {
          noteId: editNote._id,
          userId: user?.id,
          userName: user?.email,
          editing: false,
        });
      }, 2000);
      debouncedLiveUpdate(
        editNote._id,
        field === "title" ? value : title,
        field === "content" ? value : content
      );
    }
  };

  const handleModalSave = () => {
    if (editNote) {
      updateMutation.mutate(undefined, {
        onSuccess: () => {
          socket.emit("editNote", {
            noteId: editNote._id,
            note: { title, content },
          });
        },
      });
    } else {
      createMutation.mutate(undefined, {
        onSuccess: (data) => {
          socket.emit("editNote", {
            noteId: data._id,
            note: { title, content },
          });
        },
      });
    }
  };

  return (
    <Box className="min-h-screen" sx={{ background: "#f6f8fa", p: 4 }}>
      <Box className="md:flex! items-center text-center justify-between mb-4 block">
        <Typography
          variant="h5"
          fontWeight={800}
          sx={{ letterSpacing: 1 }}
          className="mb-4! sm:mb-0"
        >
          Welcome, {user?.email || "Guest"}!
        </Typography>

        <Box
          className="md:flex-row! flex! items-center justify-between flex-col"
          sx={{ gap: 2 }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={openCreateModal}
            sx={{ fontWeight: 600, px: 4, py: 1 }}
          >
            Add Note
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleLogout}
            sx={{ fontWeight: 600, px: 4, py: 1 }}
          >
            Logout
          </Button>
        </Box>
      </Box>
      {isLoading && <Typography align="center">Loading notes...</Typography>}
      {isError && (
        <Typography color="error" align="center">
          Failed to load notes.
        </Typography>
      )}
      {notes && notes.length === 0 && (
        <Typography
          align="center"
          color="textSecondary"
          sx={{ mt: 10, fontSize: 22, fontWeight: 500 }}
        >
          No notes found. Click <b>Add Note</b> to create your first note!
        </Typography>
      )}
      {notes && notes.length > 0 && (
        <Grid
          container
          spacing={4}
          justifyContent="center"
          alignItems="stretch"
          sx={{ mt: 6 }}
        >
          {notes.map((note) => (
            <NoteCard
              note={note}
              user={user}
              openEditModal={openEditModal}
              deleteMutation={deleteMutation}
            />
          ))}
        </Grid>
      )}
      <NoteDialog
        modalOpen={modalOpen}
        handleModalClose={handleModalClose}
        handleModalSave={handleModalSave}
        createMutation={createMutation}
        updateMutation={updateMutation}
        editNote={editNote}
        title={title}
        content={content}
        handleEditorChange={handleEditorChange}
        editingUsers={editingUsers as any}
      />
    </Box>
  );
}
