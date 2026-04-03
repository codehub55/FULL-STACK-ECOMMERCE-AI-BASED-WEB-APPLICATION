import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { setAuthUser, setLoading } from "../store/slices/authSlice";
import ThemeToggle from "../components/ThemeToggle";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth || {});

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const baseURL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        `${baseURL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      const user = res.data?.user || null;
      dispatch(setAuthUser(user));
      dispatch(setLoading(false));
      navigate("/");
    } catch (err) {
      dispatch(setLoading(false));
      setError(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md bg-card rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold text-card-foreground mb-1">Login</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Admin login required to view the dashboard.
        </p>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-foreground">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              className="mt-1 w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              className="mt-1 w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-sm text-muted-foreground">
          <Link to="/password/forgot" className="text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          <Link to="/register" className="text-primary hover:underline">
            Register new admin account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
