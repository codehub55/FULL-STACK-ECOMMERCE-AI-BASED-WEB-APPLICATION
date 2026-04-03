import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import ThemeToggle from "../components/ThemeToggle";

const Register = () => {
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth || {});

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post(
        `${baseURL}/auth/register-admin`,
        { name, email, password },
        { withCredentials: true }
      );
      setSuccess(res.data.message || "Admin registration initiated. Please check your email for OTP.");
      setShowOTPInput(true);
      setRegisteredEmail(email);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post(
        `${baseURL}/auth/verify-otp`,
        { email: registeredEmail, otp },
        { withCredentials: true }
      );
      setSuccess("Admin verified successfully! You can now login.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Allow admin registration without authentication
  // if (!user || user.role !== "Admin") {
  //   navigate("/login");
  //   return null;
  // }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md bg-card rounded-xl shadow p-6">
        {!showOTPInput ? (
          <>
            <h1 className="text-2xl font-bold text-card-foreground mb-1">Register Admin</h1>
            <p className="text-sm text-muted-foreground mb-4">
              Create a new admin account for the dashboard.
            </p>

            {error && <div className="mb-4 text-red-600">{error}</div>}
            {success && <div className="mb-4 text-green-600">{success}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 w-full px-4 py-3 border border-input rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 w-full px-4 py-3 border border-input rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 w-full px-4 py-3 border border-input rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="mt-1 w-full px-4 py-3 border border-input rounded-lg"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 disabled:opacity-60"
              >
                {isSubmitting ? "Creating..." : "Create Admin"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-card-foreground mb-1">Verify Admin Email</h1>
            <p className="text-sm text-muted-foreground mb-4">
              We've sent a 6-digit OTP to {registeredEmail}. Please enter it below to complete admin registration.
            </p>

            {error && <div className="mb-4 text-red-600">{error}</div>}
            {success && <div className="mb-4 text-green-600">{success}</div>}

            <form onSubmit={handleOTPSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength="6"
                  required
                  className="mt-1 w-full px-4 py-3 border border-input rounded-lg text-center text-2xl font-mono tracking-widest"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 disabled:opacity-60"
              >
                {isSubmitting ? "Verifying..." : "Verify & Complete"}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setShowOTPInput(false);
                  setOtp("");
                  setError("");
                  setSuccess("");
                }}
                className="text-sm text-primary hover:underline"
              >
                Didn't receive OTP? Try registering again
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
