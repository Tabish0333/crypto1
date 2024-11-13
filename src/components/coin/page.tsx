"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableHead,
  TableRow,
  TableBody,
  Button,
  Modal,
  Box,
  TextField,
  TableContainer,
  Paper,
  styled,
  Typography,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { updateCoin } from "@/redux/slice/CoinSlice";
import { addToCart } from "@/redux/slice/CartSlice";
import { RootState } from "@/redux/store/store";
import { fetchCoins, resetCoins } from "@/redux/slice/CoinSlice";
import axios from "axios";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useRouter } from "next/navigation";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Coin = () => {
  const dispatch = useDispatch();
  const { coins, loading } = useSelector((state: RootState) => state.coins);

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCoin, setSelectedCoin] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [editedCoin, setEditedCoin] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchCoins());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(resetCoins());
    dispatch(fetchCoins());
  };

  const handleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleOpen = async (coin: any) => {
    const response = await axios.get(
      `https://api.coincap.io/v2/assets/${coin.id}`
    );
    setSelectedCoin(response.data.data);
    setEditedCoin(response.data.data); 
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditedCoin(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedCoin({ ...editedCoin, [name]: value });
  };

  // const handleSave = () => {
  //   setSelectedCoin(editedCoin);
  //   setOpen(false);
  // };
  const handleSave = () => {
    if (editedCoin) {
      setSelectedCoin(editedCoin);
      dispatch(updateCoin(editedCoin));
      setOpen(false);
    }
  };

  const handleAddToCart = (coin: any) => {
    const coinToCart = {
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      priceUsd: coin.priceUsd,
      quantity: 1,
    };
    dispatch(addToCart(coinToCart));
  };

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(searchTerm)
  );

  const sortedCoins = [...filteredCoins].sort((a, b) =>
    sortOrder === "asc" ? a.rank - b.rank : b.rank - a.rank
  );

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <Typography
        sx={{ display: "flex", justifyContent: "center" }}
        variant="h3"
        gutterBottom
      >
        Crypto Website
      </Typography>
      <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
        <TextField
          sx={{ margin: "20px 5px", border: "1px solid", borderRadius: "5px" }}
          placeholder="Search your coin here..."
          onChange={handleSearch}
        />
        <Button variant="contained" onClick={handleSort}>
           ↑ ↓
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleRefresh}
          sx={{ marginLeft: "10px" }}
        >
          Refresh
        </Button>
        <Box>
          <ShoppingCartIcon
            fontSize="large"
            sx={{ paddingLeft: "20px", cursor: "pointer" }}
            onClick={() => router.push("/cart")}
          />
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Rank</StyledTableCell>
              <StyledTableCell align="right">Name</StyledTableCell>
              <StyledTableCell align="right">Symbol</StyledTableCell>
              <StyledTableCell align="right">Details</StyledTableCell>
              <StyledTableCell align="right">Cart</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedCoins.map((coin) => (
              <StyledTableRow key={coin.id}>
                <StyledTableCell>{coin.rank}</StyledTableCell>
                <StyledTableCell align="right">{coin.name}</StyledTableCell>
                <StyledTableCell align="right">{coin.symbol}</StyledTableCell>
                <StyledTableCell align="right">
                  <Button
                    sx={{ backgroundColor: "gray" }}
                    variant="contained"
                    onClick={() => handleOpen(coin)}
                  >
                    Details
                  </Button>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <Button
                    sx={{ backgroundColor: "gainsboro", color: "black" }}
                    variant="contained"
                    onClick={() => handleAddToCart(coin)}
                  >
                    Add to Cart
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          {editedCoin ? (
            <div>
              <Typography variant="h6">
                {editedCoin.name} ({editedCoin.symbol})
              </Typography>
              <TextField
                fullWidth
                label="Rank"
                name="rank"
                value={editedCoin.rank}
                onChange={handleChange}
                sx={{ my: 1 }}
              />
              <TextField
                fullWidth
                label="Price (USD)"
                name="priceUsd"
                value={editedCoin.priceUsd}
                onChange={handleChange}
                sx={{ my: 1 }}
              />
              <TextField
                fullWidth
                label="Market Cap (USD)"
                name="marketCapUsd"
                value={editedCoin.marketCapUsd}
                onChange={handleChange}
                sx={{ my: 1 }}
              />
              <TextField
                fullWidth
                label="Supply"
                name="supply"
                value={editedCoin.supply}
                onChange={handleChange}
                sx={{ my: 1 }}
              />
              <TextField
                fullWidth
                label="Max Supply"
                name="maxSupply"
                value={editedCoin.maxSupply}
                onChange={handleChange}
                sx={{ my: 1 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                sx={{ mt: 2 }}
              >
                Save
              </Button>
            </div>
          ) : (
            <Typography>Loading...</Typography>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default Coin;
