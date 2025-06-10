import { Suspense, lazy } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "./store";

const Login = lazy(() =>
  import("./pages/Login").then((module) => ({ default: module.default }))
);
const Signup = lazy(() =>
  import("./pages/Signup").then((module) => ({ default: module.default }))
);
const NotesDashboard = lazy(() =>
  import("./pages/NotesDashboard").then((module) => ({
    default: module.default,
  }))
);

function PrivateRoute() {
  const user = useSelector((state: RootState) => state.auth.user);
  return user ? <Outlet /> : <Navigate to="/login" />;
}

function PublicRoute() {
  const user = useSelector((state: RootState) => state.auth.user);
  return user ? <Navigate to="/" /> : <Outlet />;
}

export default function AppRoutes() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          Loading...
        </div>
      }
    >
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<NotesDashboard />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
}
