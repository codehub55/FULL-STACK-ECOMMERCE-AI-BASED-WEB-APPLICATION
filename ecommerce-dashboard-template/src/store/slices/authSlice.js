import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const fetchAuthUser = createAsyncThunk(
  "auth/fetchAuthUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/auth/me");
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put("/auth/profile/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put("/auth/password/update", {
        currentPassword,
        newPassword,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    authUser: null,
    isAuthenticated: false,
    isUpdatingProfile: false,
    isUpdatingPassword: false,
    isCheckingAuth: true,
    loading: false,
  },
  reducers: {
    setAuthUser: (state, action) => {
      const user = action.payload || null;
      state.authUser = user;
      state.isAuthenticated = !!user;
    },
    setLoading: (state, action) => {
      state.loading = !!action.payload;
    },
    logout: (state) => {
      state.authUser = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthUser.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(fetchAuthUser.fulfilled, (state, action) => {
        state.isCheckingAuth = false;
        state.authUser = action.payload?.user || null;
        state.isAuthenticated = !!state.authUser;
      })
      .addCase(fetchAuthUser.rejected, (state) => {
        state.isCheckingAuth = false;
        state.authUser = null;
        state.isAuthenticated = false;
      });

    builder
      .addCase(updateProfile.pending, (state) => {
        state.isUpdatingProfile = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isUpdatingProfile = false;
        state.authUser = action.payload?.user || state.authUser;
        toast.success(action.payload?.message || "Profile updated successfully.");
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isUpdatingProfile = false;
        toast.error(action.payload?.message || "Profile update failed.");
      });

    builder
      .addCase(updatePassword.pending, (state) => {
        state.isUpdatingPassword = true;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.isUpdatingPassword = false;
        toast.success(action.payload?.message || "Password updated successfully.");
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.isUpdatingPassword = false;
        toast.error(action.payload?.message || "Password update failed.");
      });
  },
});

export const { setAuthUser, setLoading, logout } = authSlice.actions;
export default authSlice.reducer;
