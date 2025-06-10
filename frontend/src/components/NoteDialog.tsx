import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from "@mui/material";

const NoteDialog = ({
  modalOpen,
  handleModalClose,
  handleModalSave,
  createMutation,
  updateMutation,
  editNote,
  title,
  content,
  handleEditorChange,
  editingUsers = [],
}) => {
  return (
    <Dialog
      open={modalOpen}
      onClose={handleModalClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 4, background: "#f9fafb" } }}
    >
      <DialogTitle sx={{ fontWeight: 700, fontSize: 26 }}>
        {editNote ? "Edit Note" : "Add Note"}
      </DialogTitle>
      <DialogContent className="flex flex-col gap-4 p-6! pt-2! pb-0!">
        {editNote && editingUsers.length > 0 && (
          <Alert
            severity="warning"
            sx={{ mb: 2, fontWeight: 600, fontSize: 16 }}
          >
            Warning: {editingUsers.join(", ")}{" "}
            {editingUsers.length === 1 ? "is" : "are"} editing this note at the
            same time!
          </Alert>
        )}
        <TextField
          label="Title"
          value={title}
          onChange={(e) => handleEditorChange("title", e.target.value)}
          fullWidth
          sx={{ mb: 2, background: "#fff", borderRadius: 2 }}
          InputProps={{ style: { fontSize: 18, fontWeight: 600 } }}
        />
        <TextField
          label="Content"
          value={content}
          onChange={(e) => handleEditorChange("content", e.target.value)}
          fullWidth
          multiline
          minRows={4}
          sx={{ mb: 2, background: "#fff", borderRadius: 2 }}
          InputProps={{ style: { fontSize: 16 } }}
        />
      </DialogContent>
      <DialogActions sx={{ pb: 2, pr: 3 }}>
        <Button onClick={handleModalClose} sx={{ fontWeight: 600 }}>
          Cancel
        </Button>
        <Button
          onClick={handleModalSave}
          variant="contained"
          color="primary"
          disabled={createMutation.isPending || updateMutation.isPending}
          sx={{ fontWeight: 700, px: 4 }}
        >
          {editNote
            ? updateMutation.isPending
              ? "Saving..."
              : "Save"
            : createMutation.isPending
            ? "Adding..."
            : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NoteDialog;
