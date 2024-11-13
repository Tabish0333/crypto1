"use client";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Table,
  TableHead,
  TableRow,
  TableBody,
  Button,
  TextField,
  Box,
  Typography,
  TableContainer,
  Paper,
} from "@mui/material";
import TableCell from "@mui/material/TableCell";
import { RootState } from "@/redux/store/store";
import {
  removeFromCart,
  updateCartItem,
  clearCart,
} from "@/redux/slice/CartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const handleUpdateQuantity = (id: string, quantity: number) => {
    const updatedItem = cartItems.find(item => item.id === id);
    if (updatedItem) {
      dispatch(updateCartItem({ ...updatedItem, quantity }));
    }
  };

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <div>
      <Typography variant="h4" align="center" gutterBottom>
        Your Cart
      </Typography>
      {cartItems.length === 0 ? (
        <Typography align="center">Your cart is empty</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Symbol</TableCell>
                <TableCell>Price (USD)</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cartItems.map(item => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.symbol}</TableCell>
                  <TableCell>${parseFloat(item.priceUsd).toFixed(2)}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleUpdateQuantity(item.id, parseInt(e.target.value, 10))
                      }
                      inputProps={{ min: 1 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleRemove(item.id)}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {cartItems.length > 0 && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Button variant="contained" color="primary" onClick={handleClearCart}>
            Clear Cart
          </Button>
        </Box>
      )}
    </div>
  );
};

export default Cart;
