import { useEffect } from "react";
import { X, LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthUser, logoutUser } from "../../store/slices/authSlice";
import { toggleAuthPopup } from "../../store/slices/popupSlice";

const ProfilePanel = () => {
  const dispatch = useDispatch();
  const { isAuthPopupOpen } = useSelector((state) => state.popup);
  const { authUser, isCheckingAuth } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthPopupOpen && !authUser && isCheckingAuth) {
      dispatch(fetchAuthUser());
    }
  }, [dispatch, isAuthPopupOpen, authUser, isCheckingAuth]);

  useEffect(() => {
    if (!authUser && isAuthPopupOpen) {
      dispatch(toggleAuthPopup());
    }
  }, [authUser, isAuthPopupOpen, dispatch]);

  if (!isAuthPopupOpen) return null;
  if (!authUser) return null;

  return (
    <div className="fixed inset-0 z-[58]">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={() => dispatch(toggleAuthPopup())}
      />
      <div className="relative h-full flex items-start justify-center pt-24 px-4">
        <div className="w-full max-w-md glass-panel">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-foreground">Profile</h3>
            <button
              type="button"
              className="p-2 glass-card rounded-lg"
              onClick={() => dispatch(toggleAuthPopup())}
              aria-label="Close profile"
            >
              <X className="w-5 h-5 text-primary" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <img
              src={authUser.avatar || "https://placehold.co/96x96"}
              alt={authUser.name || "User"}
              className="w-20 h-20 rounded-xl object-cover bg-secondary"
            />
            <div className="min-w-0">
              <div className="font-bold text-foreground text-lg truncate">
                {authUser.name}
              </div>
              <div className="text-sm text-muted-foreground break-all">
                {authUser.email}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Role: <span className="text-foreground">{authUser.role}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <Link
              to="/profile"
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              onClick={() => dispatch(toggleAuthPopup())}
            >
              <User className="w-5 h-5" />
              View Profile
            </Link>
            <button
              type="button"
              className="w-full px-6 py-3 bg-secondary border border-border rounded-lg text-foreground font-semibold hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
              onClick={() => dispatch(logoutUser())}
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>

          {isCheckingAuth && (
            <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePanel;
