"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export function useRequireAuth(redirectTo: string = "/") {
  const user = useAuthStore((state) => state.user);
  const isloading = useAuthStore((state) => state.isLoading);
  const router = useRouter();

  useEffect(() => {
    if (!isloading && !user) {
      router.push(redirectTo);
    }
  }, [user, isloading, router, redirectTo]);

  return { user, isloading };
}
