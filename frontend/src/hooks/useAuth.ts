"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { User } from "@/types"; // Make sure you have a User interface

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/users/me/profile");
        setUser(response.data);
      } catch (error) {
        // This is expected if the user is not logged in
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, isLoading };
}
