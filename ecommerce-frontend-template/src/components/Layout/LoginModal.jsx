// import { useState, useEffect } from "react";
// import { X, Mail, Lock, User } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { useLocation } from "react-router-dom";

// const LoginModal = () => {
//   return <></>;
// };

// export default LoginModal;

import { useEffect, useState } from "react";
import { X, Mail, Lock } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/slices/authSlice";
import { toggleAuthPopup } from "../../store/slices/popupSlice";
import { Link } from "react-router-dom";

const LoginModal = () => {
  const dispatch = useDispatch();
  const { isAuthPopupOpen } = useSelector((state) => state.popup);
  const { authUser, isLoggingIn } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isAuthPopupOpen) return null;
  if (authUser) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="fixed inset-0 z-[57]">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={() => dispatch(toggleAuthPopup())}
      />
      <div className="relative h-full flex items-start justify-center pt-24 px-4">
        <div className="w-full max-w-md glass-panel">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-bold text-foreground">Login</h3>
            </div>
            <button
              type="button"
              className="p-2 glass-card rounded-lg"
              onClick={() => dispatch(toggleAuthPopup())}
              aria-label="Close login"
            >
              <X className="w-5 h-5 text-primary" />
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-muted-foreground">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-muted-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 gradient-primary text-primary-foreground rounded-lg font-semibold hover:glow-on-hover transition-all"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-4 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              <Link
                to="/password/forgot"
                className="text-primary hover:underline"
                onClick={() => dispatch(toggleAuthPopup())}
              >
                Forgot Password?
              </Link>
            </p>
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-primary hover:underline font-semibold"
                onClick={() => dispatch(toggleAuthPopup())}
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;