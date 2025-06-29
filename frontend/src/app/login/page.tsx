"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      console.log("Login success:", response.data);

      // 👇 Redirect to your protected dashboard or admin page
      router.push("/dashboard"); // or "/admin", "/orders", whatever you set
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Check console for details.");
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-mint-light">
      {/* Logo */}
      <div className="mb-6 text-center">
        <img src="/logo.svg" alt="Logo" className="h-10 mx-auto" />
      </div>

      <div className="bg-white border border-light-green shadow-sm rounded-xl px-8 pt-10 pb-12 max-w-md w-full">
        <h1 className="text-xl font-playfair font-bold text-dark-gray mb-6 text-center">
          Welcome Back
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-box"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-box"
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
