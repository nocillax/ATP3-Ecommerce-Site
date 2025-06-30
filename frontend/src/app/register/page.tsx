// FILE: src/app/register/page.tsx
"use client";

import NotchedInput from "@/components/ui/NotchedInput";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";
import axios from "axios";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "", // ✅ Add phone to the form state
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ✅ Validation logic function
  const validateForm = () => {
    const newErrors: Partial<typeof form> = {};
    if (!form.name) newErrors.name = "Full name is required.";
    if (!form.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email address is invalid.";
    }
    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    return newErrors;
  };

  // ✅ The complete registration logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // ✅ Call validate() before submitting
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({}); // Clear previous errors

    setIsLoading(true);

    try {
      // 2. Prepare the payload for the API (without confirmPassword)
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      };

      // 3. Make the API call
      await api.post("/users/signup", payload);

      toast.success("Registration successful! Please log in.");

      // 4. Redirect to the login page on success
      router.push("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      if (axios.isAxiosError(error) && error.response) {
        const message = error.response.data.message;
        // Display the specific error from the backend (e.g., "Email already exists")
        toast.error(Array.isArray(message) ? message.join(", ") : message);
      } else {
        toast.error("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-mint-light">
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
          Create an Account
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <NotchedInput
            label="Full Name"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <NotchedInput
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          {/* ✅ Add the Phone Number input field */}
          <NotchedInput
            label="Phone Number"
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
          <NotchedInput
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <NotchedInput
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          {/* ✅ Validation Summary Block */}
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
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
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
