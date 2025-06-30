"use client";

import Image from "next/image";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import NotchedInput from "@/components/ui/NotchedInput";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import api from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // Get the fetchUser action from our auth store
  const fetchUser = useAuthStore((state) => state.fetchUser);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Call the login API endpoint
      await api.post("/auth/login", { email, password });

      // 2. ✅ THIS IS THE FIX: After successful login, fetch the user's
      //    profile to update the global state.
      await fetchUser();

      toast.success("Login successful!");

      // 3. Redirect to the homepage
      router.push("/");
    } catch (error) {
      console.error("Login failed:. Please check your credentials.");
      alert("Login failed. Check console for details.");
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-mint-light">
      {/* Logo */}
      <div className="mb-6 text-center">
        <Image
          src="/logo/nocillax-typo.svg"
          alt="Logo"
          width={120}
          height={40}
          className="mx-auto h-10 w-auto"
        />
      </div>

      <div className="bg-mint-light border border-light-green shadow-md rounded-xl px-8 pt-10 pb-12 max-w-md w-full">
        <h1 className="text-xl font-playfair font-bold text-dark-gray mb-6 text-center">
          Welcome Back
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <NotchedInput
            label="Email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <NotchedInput
            label="Password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="btn-dark py-2 px-4 rounded text-sm mt-2"
          >
            Log In
          </button>
        </form>

        <p className="text-sm text-center text-dark-gray mt-6">
          Don't have an account?{" "}
          <Link href="/register" className="text-primary font-bold">
            Register Now
          </Link>
        </p>
      </div>
    </section>
  );
}
