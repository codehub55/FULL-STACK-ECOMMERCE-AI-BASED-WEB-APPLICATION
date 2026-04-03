import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const placeOrder = createAsyncThunk(
  "order/placeOrder",
  async (
    {
      full_name,
      state,
      city,
      country,
      address,
      pincode,
      phone,
      orderedItems,
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.post("/order/new", {
        full_name,
        state,
        city,
        country,
        address,
        pincode,
        phone,
        orderedItems,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  "order/fetchMyOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/order/orders/me");
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    myOrders: [],
    fetchingOrders: false,
    placingOrder: false,
    finalPrice: null,
    orderStep: 1,
    paymentIntent: "",
  },
  reducers: {
    resetOrder: (state) => {
      state.placingOrder = false;
      state.finalPrice = null;
      state.orderStep = 1;
      state.paymentIntent = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.placingOrder = true;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.placingOrder = false;
        state.finalPrice = action.payload?.total_price ?? null;
        state.paymentIntent = action.payload?.paymentIntent ?? "";
        state.orderStep = 2;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.placingOrder = false;
        toast.error(action.payload?.message || "Order placement failed.");
      });

    builder
      .addCase(fetchMyOrders.pending, (state) => {
        state.fetchingOrders = true;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.fetchingOrders = false;
        state.myOrders = action.payload?.myOrders || [];
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.fetchingOrders = false;
        toast.error(action.payload?.message || "Failed to fetch orders.");
      });
  },
});

export default orderSlice.reducer;
export const { resetOrder } = orderSlice.actions;
