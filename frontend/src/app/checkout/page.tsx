// "use client";

// import { useState } from "react";

// const dummyCartItems = [
//   {
//     id: 1,
//     product: {
//       brand: "AYRAH",
//       title: "Signature Satin Hijab",
//       subtitle: "- Platinum Haze -",
//     },
//     price: 899,
//     quantity: 2,
//   },
//   {
//     id: 2,
//     product: {
//       brand: "VELURÉ",
//       title: "Premium Silk Hijab",
//       subtitle: "- Mocha Dusk -",
//     },
//     price: 1299,
//     quantity: 1,
//   },
// ];

// export default function CheckoutPage() {
//   const [form, setForm] = useState({
//     fullName: "",
//     email: "",
//     address: "",
//     city: "",
//     zip: "",
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const subtotal = dummyCartItems.reduce(
//     (total, item) => total + item.price * item.quantity,
//     0
//   );
//   const shipping = 60;
//   const total = subtotal + shipping;

//   const handleStripeCheckout = async () => {
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/payments/checkout-session`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             items: dummyCartItems.map((item) => ({
//               productId: item.id,
//               quantity: item.quantity,
//             })),
//           }),
//         }
//       );

//       const data = await res.json();
//       if (data.url) {
//         window.location.href = data.url;
//       } else {
//         alert("Failed to create Stripe session.");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Stripe checkout error.");
//     }
//   };

//   return (
//     <section className="max-w-7xl mx-auto px-4 py-10">
//       <h2 className="text-2xl font-playfair font-bold text-dark-gray mb-8">
//         Checkout
//       </h2>

//       <div className="grid grid-cols-1 lg:grid-cols-[0.7fr_0.7fr_1fr] gap-10">
//         {/* Left: Form */}
//         <form className="lg:col-span-2 space-y-6">
//           {/* Contact Info */}
//           <div>
//             <h3 className="font-reem-kufi font-bold text-dark-gray text-lg mb-2">
//               Contact Information
//             </h3>
//             <div className="grid md:grid-cols-2 gap-4">
//               <input
//                 type="text"
//                 name="fullName"
//                 placeholder="Full Name"
//                 value={form.fullName}
//                 onChange={handleChange}
//                 className="input-box"
//               />
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Email Address"
//                 value={form.email}
//                 onChange={handleChange}
//                 className="input-box"
//               />
//             </div>
//           </div>

//           {/* Shipping Address */}
//           <div>
//             <h3 className="font-reem-kufi font-bold text-dark-gray text-lg mb-2">
//               Shipping Address
//             </h3>
//             <input
//               type="text"
//               name="address"
//               placeholder="Street Address"
//               value={form.address}
//               onChange={handleChange}
//               className="input-box w-full mb-4"
//             />
//             <div className="grid md:grid-cols-2 gap-4">
//               <input
//                 type="text"
//                 name="city"
//                 placeholder="City"
//                 value={form.city}
//                 onChange={handleChange}
//                 className="input-box"
//               />
//               <input
//                 type="text"
//                 name="zip"
//                 placeholder="ZIP Code"
//                 value={form.zip}
//                 onChange={handleChange}
//                 className="input-box"
//               />
//             </div>
//           </div>

//           {/* Payment (dummy for now) */}
//           <div>
//             <h3 className="font-reem-kufi font-bold text-dark-gray text-lg mb-2 mt-8">
//               Payment Method
//             </h3>
//             <p className="text-sm font-montserrat text-dark-gray mb-4">
//               Secure payment powered by Stripe.
//             </p>
//             <button
//               type="button"
//               onClick={handleStripeCheckout}
//               className="stripe-btn px-6 py-3 rounded-md text-sm font-reem-kufi font-bold"
//             >
//               PAY WITH STRIPE
//             </button>
//           </div>
//         </form>

//         {/* Right: Order Summary */}
//         <div className="p-6 bg-mint-light border border-light-green rounded-md shadow-soft space-y-4">
//           <h3 className="text-lg font-reem-kufi font-bold text-dark-gray mb-4">
//             Order Summary
//           </h3>
//           {dummyCartItems.map((item) => (
//             <div
//               key={item.id}
//               className="flex justify-between items-center text-sm"
//             >
//               <p className="font-montserrat text-dark-gray">
//                 {item.product.title}{" "}
//                 <span className="text-dark-gray/60">
//                   {item.product.subtitle}
//                 </span>{" "}
//                 × {item.quantity}
//               </p>
//               <p className="font-montserrat text-dark-gray">
//                 $ {item.price * item.quantity}
//               </p>
//             </div>
//           ))}
//           <hr className="my-2 border-brown" />
//           <div className="flex justify-between text-sm font-montserrat text-dark-gray">
//             <span>Subtotal</span>
//             <span>$ {subtotal}</span>
//           </div>
//           <div className="flex justify-between text-sm font-montserrat text-dark-gray">
//             <span>Shipping</span>
//             <span>$ {shipping}</span>
//           </div>
//           <div className="flex justify-between font-bold text-base text-dark-gray">
//             <span>Total</span>
//             <span>$ {total}</span>
//           </div>

//           <button className="btn-dark w-full px-6 py-3 rounded-md text-sm mt-4">
//             PLACE ORDER
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }

// FILE: src/app/checkout/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import api from "@/lib/api";
import toast from "react-hot-toast";

// A simple type for the user profile data
interface UserProfile {
  name: string;
  email: string;
  defaultShippingAddress?: string;
}

export default function CheckoutPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    zip: "",
  });

  // 1. Get cart data from our global Zustand store
  const { cart, fetchCart } = useCartStore();

  // 2. Fetch cart and user profile data on page load
  useEffect(() => {
    fetchCart(); // Get the latest cart state

    const fetchProfile = async () => {
      try {
        const response = await api.get<UserProfile>("/users/me/profile");
        const profile = response.data;
        // Pre-fill the form with the user's data
        setForm((prev) => ({
          ...prev,
          fullName: profile.name || "",
          email: profile.email || "",
          address: profile.defaultShippingAddress || "",
        }));
      } catch (error) {
        console.error("Could not fetch user profile", error);
      }
    };
    fetchProfile();
  }, [fetchCart]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 3. The summary now uses live data from the cart store
  const subtotal = Number(cart?.totalPrice ?? 0);
  const shipping = 60; // Or your dynamic shipping logic
  const total = subtotal + shipping;
  const totalSavings =
    cart?.cartItems.reduce((sum, item) => {
      const savingsForItem =
        (item.originalUnitPrice - item.unitPrice) * item.quantity;
      return sum + savingsForItem;
    }, 0) ?? 0;

  const handleStripeCheckout = async () => {
    // Basic validation
    if (!form.fullName || !form.address || !form.city || !form.zip) {
      return toast.error("Please fill out all contact and shipping fields.");
    }
    if (!cart?.cartItems || cart.cartItems.length === 0) {
      return toast.error("Your cart is empty.");
    }

    // 4. The checkout handler now uses real data
    try {
      // Combine address fields into a single string for the backend
      const shippingAddress = `${form.address}, ${form.city}, ${form.zip}`;

      const response = await api.post("/payment/checkout", {
        // Map the real cart items to the format the backend expects
        items: cart.cartItems.map((item) => ({
          productVariantId: item.productVariant.id,
          quantity: item.quantity,
        })),
        // Send the combined shipping address
        shippingAddress: shippingAddress,
      });

      if (response.data.url) {
        // Redirect to Stripe's hosted checkout page
        window.location.href = response.data.url;
      } else {
        toast.error("Failed to create Stripe session.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during checkout.");
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-playfair font-bold text-dark-gray mb-8">
        Checkout
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,0.7fr] gap-10">
        {/* Left: Form */}
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleStripeCheckout();
          }}
        >
          {/* Contact Info - now pre-filled */}
          <div>
            <h3 className="font-reem-kufi font-bold text-dark-gray text-lg mb-2">
              Contact Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="input-box bg-gray-100 cursor-not-allowed">
                {form.fullName || "Loading..."}
              </div>
              <div className="input-box bg-gray-100 cursor-not-allowed">
                {form.email || "Loading..."}
              </div>
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
              required
            />
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                className="input-box"
                required
              />
              <input
                type="text"
                name="zip"
                placeholder="ZIP Code"
                value={form.zip}
                onChange={handleChange}
                className="input-box"
                required
              />
            </div>
          </div>

          {/* Payment (dummy for now) */}
          {/* <div>
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
          </div> */}
        </form>

        {/* Right: Order Summary - now uses live data */}
        <div className="p-6 bg-mint-light border border-light-green rounded-md shadow-soft space-y-4 self-start">
          <h3 className="text-lg font-reem-kufi font-bold text-dark-gray mb-4">
            Order Summary
          </h3>
          {cart?.cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center text-sm"
            >
              <p className="font-montserrat text-dark-gray">
                {item.productVariant.product.name}
                <span className="text-dark-gray/60"> × {item.quantity}</span>
              </p>
              <p className="font-montserrat text-dark-gray font-semibold">
                $ {Number(item.price).toFixed(2)}
              </p>
            </div>
          ))}
          <hr className="my-2 border-brown" />
          <div className="flex justify-between text-sm font-montserrat text-dark-gray">
            <span>Subtotal</span>
            <span>$ {Number(subtotal).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-montserrat text-dark-gray">
            <span>Shipping</span>
            <span>$ {Number(shipping).toFixed(2)}</span>
          </div>
          {totalSavings > 0 && (
            <div className="flex justify-between text-sm font-montserrat font-medium text-green-600">
              <span>Discount</span>
              <span>( $ {totalSavings.toFixed(2)})</span>
            </div>
          )}

          <div className="flex justify-between font-bold text-base text-dark-gray">
            <span>Total</span>
            <span>$ {Number(total).toFixed(2)}</span>
          </div>
          <button
            onClick={handleStripeCheckout}
            className="stripe-btn btn-dark w-full px-6 py-3 rounded-md text-sm mt-4"
          >
            PAY WITH STRIPE
          </button>
        </div>
      </div>
    </section>
  );
}
