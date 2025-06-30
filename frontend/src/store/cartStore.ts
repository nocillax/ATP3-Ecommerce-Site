// FILE: src/store/cartStore.ts
import { create } from "zustand";
import api from "@/lib/api";
import { Cart, CartItem } from "@/types"; // Assuming you have a Cart type

interface CartState {
  cart: Cart | null;
  itemCount: number;
  fetchCart: () => Promise<void>;
  addToCart: (productVariantId: number, quantity: number) => Promise<void>;
  updateCartItem: (cartItemId: number, quantity: number) => Promise<void>;
  removeCartItem: (cartItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  itemCount: 0,

  fetchCart: async () => {
    try {
      const response = await api.get("/cart");
      const cart = response.data;
      const totalItems =
        cart.cartItems?.reduce(
          (sum: number, item: CartItem) => sum + item.quantity,
          0
        ) || 0;

      set({ cart: cart, itemCount: totalItems });
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      // Handle logged-out state, where fetching a cart might fail
      set({ cart: null, itemCount: 0 });
    }
  },

  addToCart: async (productVariantId, quantity) => {
    try {
      await api.post("/cart", { productVariantId, quantity });
      // After adding, refetch the cart to get the latest state
      await get().fetchCart();
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      // Optionally re-throw the error to be handled in the component
      throw error;
    }
  },

  // ✅ NEW: Action to update item quantity
  updateCartItem: async (cartItemId, quantity) => {
    try {
      // Your backend expects a PATCH request to /cart with this body
      await api.patch("/cart", { cartItemId, quantity });
      await get().fetchCart(); // Refetch after action
    } catch (error) {
      console.error("Failed to update cart item:", error);
      throw error;
    }
  },

  // ✅ NEW: Action to remove an item
  removeCartItem: async (cartItemId) => {
    try {
      // Your backend expects a DELETE request to /cart/:cartItemId
      await api.delete(`/cart/${cartItemId}`);
      await get().fetchCart(); // Refetch after action
    } catch (error) {
      console.error("Failed to remove cart item:", error);
      throw error;
    }
  },

  clearCart: async () => {
    try {
      await api.delete("/cart/"); // Assuming this is your endpoint to clear the cart
      await get().fetchCart(); // Refetch to confirm the cart is empty
    } catch (error) {
      console.error("Failed to clear cart:", error);
      throw error;
    }
  },
}));
