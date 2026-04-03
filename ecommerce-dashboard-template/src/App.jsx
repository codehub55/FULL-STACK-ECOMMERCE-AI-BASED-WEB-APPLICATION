import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SideBar from "./components/SideBar";
import Dashboard from "./components/Dashboard";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Register from "./pages/Register";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuthUser, setLoading } from "./store/slices/authSlice";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";

const AppContent = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, authUser } = useSelector(
    (state) => state.auth || { isAuthenticated: false, authUser: null }
  );
  const { theme } = useTheme();

  useEffect(() => {
    const baseURL =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

    // If backend cookie is present, hydrate auth state so "/" doesn't stay blank.
    dispatch(setLoading(true));
    axios
      .get(`${baseURL}/auth/me`, { withCredentials: true })
      .then((res) => {
        dispatch(setAuthUser(res.data?.user || res.data?.data?.user || null));
      })
      .catch(() => {
        dispatch(setAuthUser(null));
      })
      .finally(() => dispatch(setLoading(false)));
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />

        {/* Protected Admin Route */}
        <Route
          path="/"
          element={
            isAuthenticated && authUser?.role === "Admin" ? (
              <div className="flex min-h-screen">
                <SideBar />
                <Dashboard />
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
      <ToastContainer theme={theme === 'dark' ? 'dark' : 'light'} />
    </Router>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
