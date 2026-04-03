import { createSlice } from "@reduxjs/toolkit";

const extraSlice = createSlice({
  name: "extra",
  initialState: {
    openedComponent: "Dashboard",
    isNavbarOpened: false,
    isViewProductModalOpened: false,
    isCreateProductModalOpened: false,
    isUpdateProductModalOpened: false,
  },
  reducers: {
    setOpenedComponent: (state, action) => {
      state.openedComponent = action.payload;
    },
  },
});

export const { setOpenedComponent } = extraSlice.actions;

export default extraSlice.reducer;
