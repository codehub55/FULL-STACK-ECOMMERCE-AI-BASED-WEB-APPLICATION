import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, verifyOTP } from "../store/slices/authSlice";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSigningUp, isVerifyingOTP } = useSelector((state) => state.auth || {});

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

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

    try {
      const result = await dispatch(registerUser({ name, email, password })).unwrap();
      setSuccess(result.message || "Registration initiated. Please check your email for OTP.");
      setShowOTPInput(true);
      setRegisteredEmail(email);
    } catch (err) {
      setError(err?.message || "Registration failed.");
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      await dispatch(verifyOTP({ email: registeredEmail, otp })).unwrap();
      navigate("/");
    } catch (err) {
      setError(err?.message || "OTP verification failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md bg-card shadow rounded-lg p-6">
        {!showOTPInput ? (
          <>
            <h1 className="text-2xl font-bold mb-2 text-foreground">Create account</h1>
            <p className="text-sm text-muted-foreground mb-4">
              Register as a customer to shop products.
            </p>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-sm font-medium">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="mt-1 w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>

              <button
                type="submit"
                disabled={isSigningUp}
                className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 disabled:opacity-60"
              >
                {isSigningUp ? "Signing up..." : "Create account"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-2 text-foreground">Verify Email</h1>
            <p className="text-sm text-muted-foreground mb-4">
              We've sent a 6-digit OTP to {registeredEmail}. Please enter it below to complete your registration.
            </p>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}

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
                  className="mt-1 w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary text-center text-2xl font-mono tracking-widest"
                />
              </div>

              <button
                type="submit"
                disabled={isVerifyingOTP}
                className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 disabled:opacity-60"
              >
                {isVerifyingOTP ? "Verifying..." : "Verify & Login"}
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

        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/" className="text-primary hover:underline font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
