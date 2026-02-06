import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./component/ProtectedRoute";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/chat"
        element={
          <PrivateRoute>
            <Chat />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
