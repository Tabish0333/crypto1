
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCoins = createAsyncThunk("coins/fetchCoins", async () => {
  const response = await axios.get("https://api.coincap.io/v2/assets");
  return response.data.data;
});

interface Coin {
  id: string;
  rank: number;
  name: string;
  symbol: string;
  priceUsd: string;
  marketCapUsd: string;
  supply: string;
  maxSupply: string;
}

interface CoinState {
  coins: Coin[];
  loading: boolean;
  error: string | null;
}

const initialState: CoinState = {
  coins: [],
  loading: false,
  error: null,
};

const coinSlice = createSlice({
  name: "coins",
  initialState,
  reducers: {
    resetCoins: (state) => {
      state.coins = [];
    },
    updateCoin: (state, action: PayloadAction<Coin>) => {
      const updatedCoin = action.payload;
      const index = state.coins.findIndex((coin) => coin.id === updatedCoin.id);
      if (index !== -1) {
        state.coins[index] = updatedCoin;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoins.fulfilled, (state, action) => {
        state.coins = action.payload;
        state.loading = false;
      })
      .addCase(fetchCoins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch coins";
      });
  },
});

export const { resetCoins, updateCoin } = coinSlice.actions;

export default coinSlice.reducer;
