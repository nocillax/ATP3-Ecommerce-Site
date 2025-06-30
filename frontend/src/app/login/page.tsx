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

  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = "Email is required.";
    if (!password) newErrors.password = "Password is required.";
    return newErrors;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    try {
      // 1. Call the login API endpoint
      await api.post("/auth/login", { email, password });

      // 2.  THIS IS THE FIX: After successful login, fetch the user's
      //    profile to update the global state.
      const user = await fetchUser();

      toast.success("Login successful!");

      // Step 3: Redirect based on role
      if (user?.role === "admin") {
        router.push("/admin/products");
      } else {
        router.push("/");
      }
    } catch (error) {
      setErrors({
        email: "Invalid email or password.",
      });
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

          {/*  Validation Summary Block */}
          {Object.keys(errors).length > 0 && (
            <div className="p-3 border border-red-300 bg-red-50 rounded-md text-sm">
              <ul className="list-disc list-inside text-red-600">
                {Object.values(errors).map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

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
