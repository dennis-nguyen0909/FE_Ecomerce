import { combineReducers, configureStore } from "@reduxjs/toolkit";
import productReducer from "./slides/productSlide";
import userReducer from "./slides/userSlide";
import orderReducer from "./slides/orderSlide";
import shopReducer from "./slides/shopSlide";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // mặc định là localStorage cho web
import { getDefaultMiddleware } from "@reduxjs/toolkit";

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["product", "user"], // các thằng kh lưu vào storage
};

const rootReducer = combineReducers({
  product: productReducer,
  user: userReducer,
  order: orderReducer,
  shop: shopReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: false, // Bỏ qua kiểm tra dữ liệu không thể serializable
  }),
});

export const persistor = persistStore(store);
