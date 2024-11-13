import { configureStore } from "@reduxjs/toolkit";
import coinReducer from "../slice/CoinSlice";
import cartReducer from '../slice/CartSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      coins: coinReducer,
      cart: cartReducer,
    },
  });
};

export type store = ReturnType<typeof makeStore>;
export type RootState = ReturnType<store["getState"]>;
export type AppDispatch = store["dispatch"];


