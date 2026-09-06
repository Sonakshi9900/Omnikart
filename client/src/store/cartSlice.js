import { createSlice } from '@reduxjs/toolkit';

const initialCart = JSON.parse(localStorage.getItem('omnikart_cart')) || [];

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: initialCart,
    isCartOpen: false,
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find((item) => item.product._id === product._id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ product, quantity });
      }

      localStorage.setItem('omnikart_cart', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.product._id !== action.payload);
      localStorage.setItem('omnikart_cart', JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((i) => i.product._id === productId);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i.product._id !== productId);
        } else {
          item.quantity = quantity;
        }
      }
      localStorage.setItem('omnikart_cart', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('omnikart_cart');
    },
    toggleCartSheet: (state, action) => {
      state.isCartOpen = action.payload !== undefined ? action.payload : !state.isCartOpen;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, toggleCartSheet } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalCount = (state) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartTotalPrice = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

export default cartSlice.reducer;
