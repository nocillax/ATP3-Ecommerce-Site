"use client";

import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Registration logic here
    console.log("Registering:", form);
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-mint-light">
      {/* Logo */}
      <div className="mb-6 text-center">
        <img src="/logo.svg" alt="Logo" className="h-10 mx-auto" />
      </div>

      <div className="bg-white border border-light-green shadow-sm rounded-xl px-8 pt-10 pb-12 max-w-md w-full">
        <h1 className="text-xl font-playfair font-bold text-dark-gray mb-6 text-center">
          Create an Account
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="input-box"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="input-box"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="input-box"
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="input-box"
            required
          />

          <button
            type="submit"
            className="btn-dark py-2 px-4 rounded text-sm mt-2"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-center text-dark-gray mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-bold">
            Log In
          </Link>
        </p>
      </div>
    </section>
  );
}
