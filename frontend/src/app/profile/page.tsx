"use client";

import { useState } from "react";

export default function UserProfilePage() {
  const [form, setForm] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "01234567890",
    password: "",
    address: "123 Main St, Dhaka",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving user:", form);
  };

  const handleLogout = () => {
    console.log("Logging out");
  };

  return (
    <section className="min-h-screen px-4 py-10 max-w-xl mx-auto bg-mint-light">
      <h1 className="text-2xl font-playfair font-bold text-dark-gray mb-6">
        Your Profile
      </h1>

      <form onSubmit={handleSave} className="flex flex-col gap-5">
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
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="input-box"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="input-box"
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="input-box"
        />

        <button
          type="submit"
          className="btn-dark py-2 px-4 rounded text-sm mt-2"
        >
          Save Changes
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="btn-dark py-2 px-4 rounded text-sm bg-red-600 hover:bg-red-700 mt-2"
        >
          Log Out
        </button>
      </form>
    </section>
  );
}
