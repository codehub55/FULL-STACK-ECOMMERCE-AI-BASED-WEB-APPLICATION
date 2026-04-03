import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const fetchAllProducts = createAsyncThunk(
  "product/fetchAllProducts",
  async (params, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/product", { params });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchSingleProduct = createAsyncThunk(
  "product/fetchSingleProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/product/singleProduct/${productId}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const postProductReview = createAsyncThunk(
  "product/postProductReview",
  async ({ productId, rating, comment }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(
        `/product/post-new/review/${productId}`,
        { rating, comment }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteReview = createAsyncThunk(
  "product/deleteReview",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/product/delete/review/${productId}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchAIFilteredProducts = createAsyncThunk(
  "product/fetchAIFilteredProducts",
  async (userPrompt, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/product/ai-search", { userPrompt });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    loading: false,
    products: [],
    productDetails: {},
    totalProducts: 0,
    topRatedProducts: [],
    newProducts: [],
    aiSearching: false,
    isReviewDeleting: false,
    isPostingReview: false,
    productReviews: [],
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload;
        state.products = data?.products || [];
        state.totalProducts = data?.totalProducts || 0;
        state.newProducts = data?.newProducts || [];
        state.topRatedProducts = data?.topRatedProducts || [];
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        toast.error(
          action.payload?.message || "Failed to fetch products."
        );
      });

    builder
      .addCase(fetchSingleProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSingleProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetails = action.payload?.product || {};
        state.productReviews = action.payload?.product?.reviews || [];
      })
      .addCase(fetchSingleProduct.rejected, (state, action) => {
        state.loading = false;
        toast.error(
          action.payload?.message || "Failed to fetch product details."
        );
      });

    builder
      .addCase(postProductReview.pending, (state) => {
        state.isPostingReview = true;
      })
      .addCase(postProductReview.fulfilled, (state, action) => {
        state.isPostingReview = false;
        const data = action.payload;
        state.productDetails = data?.product || state.productDetails;
        state.productReviews = data?.product?.reviews || state.productReviews;
      })
      .addCase(postProductReview.rejected, (state, action) => {
        state.isPostingReview = false;
        toast.error(action.payload?.message || "Failed to post review.");
      });

    builder
      .addCase(deleteReview.pending, (state) => {
        state.isReviewDeleting = true;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.isReviewDeleting = false;
        const data = action.payload;
        state.productDetails = data?.product || state.productDetails;
        state.productReviews = data?.product?.reviews || state.productReviews;
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.isReviewDeleting = false;
        toast.error(action.payload?.message || "Failed to delete review.");
      });

    builder
      .addCase(fetchAIFilteredProducts.pending, (state) => {
        state.aiSearching = true;
      })
      .addCase(fetchAIFilteredProducts.fulfilled, (state, action) => {
        state.aiSearching = false;
        const data = action.payload;
        state.products = data?.products || [];
      })
      .addCase(fetchAIFilteredProducts.rejected, (state, action) => {
        state.aiSearching = false;
        toast.error(action.payload?.message || "AI search failed.");
      });
  },
});

export default productSlice.reducer;
