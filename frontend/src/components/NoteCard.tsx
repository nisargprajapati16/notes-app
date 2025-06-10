import { Box, Typography, IconButton } from "@mui/material";
import Grid from "@mui/material/Grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";

const NoteCard = ({ note, openEditModal, deleteMutation, user }) => (
  <Grid
    size={{
      xs: 12,
      sm: 8,
      md: 5,
      lg: 4,
    }}
    key={note._id}
    display="flex"
    justifyContent="center"
  >
    <Card
      elevation={6}
      sx={{
        width: "100%",
        maxWidth: 400,
        borderRadius: 4,
        boxShadow: 6,
        transition: "box-shadow 0.2s",
        "&:hover": { boxShadow: 12 },
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        minHeight: 220,
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{
            mb: 1,
            wordBreak: "break-word",
            fontSize: 22,
            color: "primary.main",
          }}
        >
          {note.title}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mb: 2,
            wordBreak: "break-word",
            minHeight: 40,
            fontSize: 16,
          }}
        >
          {note.content}
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Box
          sx={{
            background: "#f5f7fa",
            borderRadius: 2,
            p: 1.2,
            mb: 1,
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mb: 0.5, fontWeight: 500 }}
          >
            Created by: <b>{note.user?.email}</b>
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mb: 0.5, fontWeight: 500 }}
          >
            {note.updatedBy && (
              <>
                Last updated by: <b>{note.updatedBy.email}</b>
              </>
            )}
          </Typography>
          <Tooltip title="Last updated time and date" arrow>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", fontWeight: 400 }}
            >
              Updated: {new Date(note.updatedAt).toLocaleString()}
            </Typography>
          </Tooltip>
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end", pt: 0 }}>
        <IconButton
          size="small"
          color="primary"
          onClick={() => openEditModal(note)}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        {user?.id === note.user?._id && (
          <IconButton
            size="small"
            color="error"
            onClick={() => deleteMutation.mutate(note._id)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
      </CardActions>
    </Card>
  </Grid>
);

export default NoteCard;
