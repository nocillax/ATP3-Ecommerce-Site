"use client";

import { Minus, Plus, Trash } from "lucide-react";
import { useState } from "react";

const dummyCartItems = [
  {
    id: 1,
    product: {
      brand: "AYRAH",
      title: "Signature Satin Hijab",
      subtitle: "- Platinum Haze -",
      image:
        "https://images.unsplash.com/photo-1594736797933-d0401ba886fe?auto=format&fit=crop&w=800&q=80",
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
      image:
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    },
    price: 1299,
    quantity: 1,
  },
];

export default function CartPage() {
  const [items, setItems] = useState(dummyCartItems);

  const updateQuantity = (id: number, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = 60;
  const total = subtotal + shipping;

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-playfair font-bold text-dark-gray mb-8">
        Your Shopping Cart
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 bg-mint-light border border-light-green rounded-md shadow-soft"
            >
              <div className="w-24 h-24 rounded overflow-hidden bg-gray-100">
                <img
                  src={item.product.image}
                  alt={item.product.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-reem-kufi font-bold text-dark-gray">
                  {item.product.brand}
                </h3>
                <p className="text-sm font-crimson text-dark-gray">
                  {item.product.title}{" "}
                  <span className="text-dark-gray/60">
                    {item.product.subtitle}
                  </span>
                </p>
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex items-center border border-dark-gray rounded-full overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition"
                    >
                      <Minus className="w-4 h-4 text-dark-gray" />
                    </button>
                    <span className="px-4 text-sm font-bold text-dark-gray">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition"
                    >
                      <Plus className="w-4 h-4 text-dark-gray" />
                    </button>
                  </div>
                  <span className="text-sm font-montserrat text-dark-gray">
                    BDT {item.price * item.quantity}
                  </span>
                </div>
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="p-2 hover:bg-red-100 rounded-full transition"
                title="Remove item"
              >
                <Trash className="w-5 h-5 text-red-400" />
              </button>
            </div>
          ))}
        </div>

        {/* Summary Box */}
        <div className="p-6 bg-mint-light border border-light-green rounded-md shadow-soft space-y-4">
          <h3 className="text-lg font-reem-kufi font-bold text-dark-gray mb-4">
            Order Summary
          </h3>
          <div className="flex justify-between text-sm font-montserrat text-dark-gray">
            <span>Subtotal</span>
            <span>BDT {subtotal}</span>
          </div>
          <div className="flex justify-between text-sm font-montserrat text-dark-gray">
            <span>Shipping Estimate</span>
            <span>BDT {shipping}</span>
          </div>
          <hr className="my-2 border-brown" />
          <div className="flex justify-between font-bold text-base text-dark-gray">
            <span>Total</span>
            <span>BDT {total}</span>
          </div>

          <button className="btn-dark w-full px-6 py-3 rounded-md text-sm mt-4">
            CHECKOUT
          </button>
        </div>
      </div>
    </section>
  );
}
