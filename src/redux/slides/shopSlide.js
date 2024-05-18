import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as ShopService from "../../services/SearchService";

const initialState = {
  shops: [],
  name: "",
};

export const fetchShops = createAsyncThunk("shop/fetchShops", async () => {
  const response = await ShopService.getAllShop();
  return response.data;
});

export const addShop = createAsyncThunk("shop/addShop", async (name) => {
  const response = await ShopService.createShop(name);
  return response.data;
});

const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShops.fulfilled, (state, action) => {
        state.shops = action.payload;
      })
      .addCase(addShop.fulfilled, (state, action) => {
        state.shops.push(action.payload);
        state.name = action.payload.name;
      });
  },
});

export default shopSlice.reducer;
