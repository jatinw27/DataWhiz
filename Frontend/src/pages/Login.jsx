import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await loginUser(form);
      login(res.data.token, res.data.user);
      navigate("/chat");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 border border-gray-800 p-8 rounded-xl w-96"
      >
        <h2 className="text-2xl font-bold mb-6">Login</h2>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-3 py-2 bg-black border border-gray-700 rounded"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 px-3 py-2 bg-black border border-gray-700 rounded"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <button className="w-full bg-green-600 hover:bg-green-700 py-2 rounded">
          Login
        </button>

        <p className="text-sm text-gray-400 mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-green-400">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}