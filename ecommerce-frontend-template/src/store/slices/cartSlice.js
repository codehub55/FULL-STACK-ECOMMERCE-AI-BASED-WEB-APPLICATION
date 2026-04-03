// import { createSlice } from "@reduxjs/toolkit";

// const cartSlice = createSlice({
//   name: "cart",
//   initialState: {
//     cart: [],
//   },
//   reducers: {},
// });

// export const {} = cartSlice.actions;

// export default cartSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    // Each item is { product, quantity }.
    cart: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const payload = action.payload; // { product, quantity }
      if (!payload?.product?.id || !payload?.quantity) return;

      const existing = state.cart.find(
        (item) => item.product.id === payload.product.id
      );
      if (existing) {
        existing.quantity += payload.quantity;
      } else {
        state.cart.push({
          product: payload.product,
          quantity: payload.quantity,
        });
      }
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.cart = state.cart.filter((item) => item.product.id !== productId);
    },
    incrementQuantity: (state, action) => {
      const productId = action.payload;
      const item = state.cart.find((i) => i.product.id === productId);
      if (item) item.quantity += 1;
    },
    decrementQuantity: (state, action) => {
      const productId = action.payload;
      const item = state.cart.find((i) => i.product.id === productId);
      if (!item) return;
      item.quantity -= 1;
      if (item.quantity <= 0) {
        state.cart = state.cart.filter((i) => i.product.id !== productId);
      }
    },
    clearCart: (state) => {
      state.cart = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;