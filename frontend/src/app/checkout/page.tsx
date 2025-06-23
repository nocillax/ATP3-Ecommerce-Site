"use client";

import { useState } from "react";

const dummyCartItems = [
  {
    id: 1,
    product: {
      brand: "AYRAH",
      title: "Signature Satin Hijab",
      subtitle: "- Platinum Haze -",
    },
    price: 899,
    quantity: 2,
  },
  {
    id: 2,
    product: {
      brand: "VELURÉ",
      title: "Premium Silk Hijab",
      subtitle: "- Mocha Dusk -",
    },
    price: 1299,
    quantity: 1,
  },
];

export default function CheckoutPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    zip: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const subtotal = dummyCartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = 60;
  const total = subtotal + shipping;

  const handleStripeCheckout = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: dummyCartItems.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
            })),
          }),
        }
      );

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to create Stripe session.");
      }
    } catch (err) {
      console.error(err);
      alert("Stripe checkout error.");
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-playfair font-bold text-dark-gray mb-8">
        Checkout
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-[0.7fr_0.7fr_1fr] gap-10">
        {/* Left: Form */}
        <form className="lg:col-span-2 space-y-6">
          {/* Contact Info */}
          <div>
            <h3 className="font-reem-kufi font-bold text-dark-gray text-lg mb-2">
              Contact Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={form.fullName}
                onChange={handleChange}
                className="input-box"
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                className="input-box"
              />
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="font-reem-kufi font-bold text-dark-gray text-lg mb-2">
              Shipping Address
            </h3>
            <input
              type="text"
              name="address"
              placeholder="Street Address"
              value={form.address}
              onChange={handleChange}
              className="input-box w-full mb-4"
            />
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                className="input-box"
              />
              <input
                type="text"
                name="zip"
                placeholder="ZIP Code"
                value={form.zip}
                onChange={handleChange}
                className="input-box"
              />
            </div>
          </div>

          {/* Payment (dummy for now) */}
          <div>
            <h3 className="font-reem-kufi font-bold text-dark-gray text-lg mb-2 mt-8">
              Payment Method
            </h3>
            <p className="text-sm font-montserrat text-dark-gray mb-4">
              Secure payment powered by Stripe.
            </p>
            <button
              type="button"
              onClick={handleStripeCheckout}
              className="stripe-btn px-6 py-3 rounded-md text-sm font-reem-kufi font-bold"
            >
              PAY WITH STRIPE
            </button>
          </div>
        </form>

        {/* Right: Order Summary */}
        <div className="p-6 bg-mint-light border border-light-green rounded-md shadow-soft space-y-4">
          <h3 className="text-lg font-reem-kufi font-bold text-dark-gray mb-4">
            Order Summary
          </h3>
          {dummyCartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center text-sm"
            >
              <p className="font-montserrat text-dark-gray">
                {item.product.title}{" "}
                <span className="text-dark-gray/60">
                  {item.product.subtitle}
                </span>{" "}
                × {item.quantity}
              </p>
              <p className="font-montserrat text-dark-gray">
                BDT {item.price * item.quantity}
              </p>
            </div>
          ))}
          <hr className="my-2 border-brown" />
          <div className="flex justify-between text-sm font-montserrat text-dark-gray">
            <span>Subtotal</span>
            <span>BDT {subtotal}</span>
          </div>
          <div className="flex justify-between text-sm font-montserrat text-dark-gray">
            <span>Shipping</span>
            <span>BDT {shipping}</span>
          </div>
          <div className="flex justify-between font-bold text-base text-dark-gray">
            <span>Total</span>
            <span>BDT {total}</span>
          </div>

          <button className="btn-dark w-full px-6 py-3 rounded-md text-sm mt-4">
            PLACE ORDER
          </button>
        </div>
      </div>
    </section>
  );
}
