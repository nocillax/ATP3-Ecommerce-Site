// FILE: src/store/authStore.ts
import { create } from "zustand";
import api from "@/lib/api";
import { User } from "@/types";
import { useCartStore } from "./cartStore"; // We'll call the cart store from here

interface AuthState {
  user: User | null;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  fetchUser: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/users/me/profile");
      set({ user: response.data, isLoading: false });
    } catch (error) {
      set({ user: null, isLoading: false });
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
      // After successful logout from backend, clear all local state
      set({ user: null, isLoading: false });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  },
}));
