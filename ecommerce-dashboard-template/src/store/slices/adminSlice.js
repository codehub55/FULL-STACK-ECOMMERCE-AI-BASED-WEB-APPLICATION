import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

export const fetchDashboardStats = createAsyncThunk(
  "admin/fetchDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseURL}/admin/fetch/dashboard-stats`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Unable to fetch dashboard stats"
      );
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseURL}/admin/getallusers`, {
        withCredentials: true,
      });
      return response.data.users || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Unable to fetch users"
      );
    }
  }
);

export const fetchAllProducts = createAsyncThunk(
  "admin/fetchAllProducts",
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseURL}/product?page=${page}`, {
        withCredentials: true,
      });
      return {
        products: response.data.products || [],
        totalProducts: response.data.totalProducts || response.data.total || 0,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Unable to fetch products"
      );
    }
  }
);

export const fetchAllOrders = createAsyncThunk(
  "admin/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseURL}/order/admin/getall`, {
        withCredentials: true,
      });
      return response.data.orders || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Unable to fetch orders"
      );
    }
  }
);

export const deleteUserAdmin = createAsyncThunk(
  "admin/deleteUserAdmin",
  async (userId, { rejectWithValue }) => {
    try {
      await axios.delete(`${baseURL}/admin/delete/${userId}`, {
        withCredentials: true,
      });
      return userId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Unable to delete user"
      );
    }
  }
);

export const updateUserRoleAdmin = createAsyncThunk(
  "admin/updateUserRoleAdmin",
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${baseURL}/admin/role/${userId}`,
        { role },
        { withCredentials: true }
      );
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Unable to update user role"
      );
    }
  }
);
export const createProductAdmin = createAsyncThunk(
  "admin/createProductAdmin",
  async ({ name, description, price, category, stock, images }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("stock", stock);
      if (images && images.length) {
        images.forEach((image) => formData.append("images", image));
      }

      const response = await axios.post(`${baseURL}/product/admin/create`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.product;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Unable to create product"
      );
    }
  }
);

export const updateProductAdmin = createAsyncThunk(
  "admin/updateProductAdmin",
  async ({ productId, name, description, price, category, stock, images }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("stock", stock);
      if (images && images.length) {
        images.forEach((image) => formData.append("images", image));
      }

      const response = await axios.put(`${baseURL}/product/admin/update/${productId}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.updatedProduct || response.data.product;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Unable to update product"
      );
    }
  }
);

export const deleteProductAdmin = createAsyncThunk(
  "admin/deleteProductAdmin",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${baseURL}/product/admin/delete/${productId}`, {
        withCredentials: true,
      });
      return { productId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Unable to delete product"
      );
    }
  }
);

export const adminSlice = createSlice({
  name: "admin",
  initialState: {
    loading: false,
    totalUsers: 0,
    users: [],
    products: [],
    totalProducts: 0,
    orders: [],
    totalRevenueAllTime: 0,
    todayRevenue: 0,
    yesterdayRevenue: 0,
    totalUsersCount: 0,
    monthlySales: [],
    orderStatusCounts: {},
    topSellingProducts: [],
    lowStockProducts: 0,
    revenueGrowth: "",
    newUsersThisMonth: 0,
    currentMonthSales: 0,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearAdminMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        state.totalRevenueAllTime = payload.totalRevenueAllTime || 0;
        state.todayRevenue = payload.todayRevenue || 0;
        state.yesterdayRevenue = payload.yesterdayRevenue || 0;
        state.totalUsersCount = payload.totalUsersCount || 0;
        state.monthlySales = payload.monthlySales || [];
        state.orderStatusCounts = payload.orderStatusCounts || {
          Processing: 0,
          Shipped: 0,
          Delivered: 0,
          Cancelled: 0,
        };
        state.topSellingProducts = payload.topSellingProducts || [];
        state.lowStockProducts = Array.isArray(payload.lowStockProducts)
          ? payload.lowStockProducts.length
          : payload.lowStockProducts || 0;
        state.revenueGrowth = payload.revenueGrowth || "0%";
        state.newUsersThisMonth = payload.newUsersThisMonth || 0;
        state.currentMonthSales = payload.currentMonthSales || 0;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load dashboard stats";
      })
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload || [];
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load users";
      })
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload?.products || [];
        state.totalProducts = action.payload?.totalProducts || 0;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load products";
      })
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload || [];
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load orders";
      })
      .addCase(createProductAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProductAdmin.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.products = [action.payload, ...(state.products || [])];
        }
      })
      .addCase(createProductAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create product";
      })
      .addCase(updateProductAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductAdmin.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        state.products = state.products.map((it) =>
          it.id === updated.id || it._id === updated._id ? updated : it
        );
        state.successMessage = "Product updated successfully";
      })
      .addCase(updateProductAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update product";
      })
      .addCase(deleteProductAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProductAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (it) => it.id !== action.payload.productId && it._id !== action.payload.productId
        );
        state.successMessage = action.payload.message || "Product deleted successfully";
      })
      .addCase(deleteProductAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete product";
      })
      .addCase(deleteUserAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((it) => it.id !== action.payload && it._id !== action.payload);
        state.successMessage = `User deleted`;
      })
      .addCase(deleteUserAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete user";
      })
      .addCase(updateUserRoleAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserRoleAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.map((user) =>
          user.id === action.payload.id || user._id === action.payload._id
            ? action.payload
            : user
        );
        state.successMessage = "User role updated successfully";
      })
      .addCase(updateUserRoleAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update user role";
      });
  },
});

export const { clearAdminMessages } = adminSlice.actions;
export default adminSlice.reducer;
