import { useState } from "react";
import { TextField, Button, Typography, Paper } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { login } from "../api/auth";
import { useDispatch } from "react-redux";
import { setUser, setError } from "../store/authSlice";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: () => login(email, password),
    onSuccess: (data) => {
      dispatch(setUser(data.user));
      navigate("/");
    },
    onError: (err: any) => {
      dispatch(setError(err.message));
    },
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50 h-screen w-screen">
      <Paper
        elevation={4}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 400,
          borderRadius: 3,
          boxShadow: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" className="mb-6! text-center! font-bold!">
          Sign In
        </Typography>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
          className="flex! flex-col! w-full!"
        >
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="mt-2"
            disabled={mutation.status === "pending"}
          >
            {mutation.status === "pending" ? "Signing in..." : "Sign In"}
          </Button>
        </form>
        <Typography className="mt-4! text-center!" variant="body2">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-blue-600">
            Sign Up
          </Link>
        </Typography>
      </Paper>
    </div>
  );
}
