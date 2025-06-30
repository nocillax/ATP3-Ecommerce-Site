"use client";

import { Minus, Plus, Trash } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout"; // Or your main Layout
import { useCartStore } from "@/store/cartStore";
import { CartItem } from "@/types";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export default function CartPage() {
  const { user, isloading } = useRequireAuth();

  // 1. Get the cart state and actions from our Zustand store
  const { cart, itemCount, fetchCart, updateCartItem, removeCartItem } =
    useCartStore();
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  // 2. Fetch the cart data when the page loads
  useEffect(() => {
    const initCart = async () => {
      setIsLoading(true);
      await fetchCart();
      setIsLoading(false);
    };
    initCart();
  }, [fetchCart]);

  // 3. Create new handlers that call the backend API via the store
  const handleUpdateQuantity = async (item: CartItem, delta: number) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity >= 1) {
      await updateCartItem(item.id, newQuantity);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      try {
        //  UNCOMMENT THIS LINE
        await removeCartItem(itemId);
        toast.success("Item removed from cart");
      } catch (error) {
        toast.error("Failed to remove item.");
        console.error("Remove item error:", error);
      }
    }
  };

  // The summary is now much simpler as the backend calculates the total
  const subtotal = Number(cart?.totalPrice ?? 0);
  const total = subtotal;

  // Calculate total savings
  const totalSavings =
    cart?.cartItems.reduce((sum, item) => {
      const savingsForItem =
        (item.originalUnitPrice - item.unitPrice) * item.quantity;
      return sum + savingsForItem;
    }, 0) ?? 0;

  if (isLoading) {
    return <div className="text-center py-20">Loading Your Cart...</div>;
  }

  if (!cart || !itemCount) {
    return <div className="text-center py-20">Your Cart is Empty.</div>;
  }

  const sortedCartItems = [...cart.cartItems].sort((a, b) => {
    // First, compare by product name
    const nameCompare = a.productVariant.product.name.localeCompare(
      b.productVariant.product.name
    );

    // If the names are different, sort by name
    if (nameCompare !== 0) {
      return nameCompare;
    }

    //  If names are the same, use the unique cart item ID as a tie-breaker
    return a.id - b.id;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-playfair font-bold text-dark-gray mb-8">
        Your Shopping Cart
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {sortedCartItems.map((item) => {
            //  FIX: Prioritize variant image, but fall back to main product image
            const imageUrl =
              item.productVariant.imageUrls?.[0] ||
              item.productVariant.product.imageUrls[0] ||
              "/placeholder.png";

            return (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 bg-mint-light border border-light-green rounded-md shadow-soft"
              >
                <Link
                  href={`/products/${item.productVariant.product.id}`}
                  className="w-24 h-24 rounded overflow-hidden bg-gray-100 flex-shrink-0"
                >
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${imageUrl}`}
                    alt={item.productVariant.product.name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                <div className="flex-1">
                  <Link href={`/products/${item.productVariant.product.id}`}>
                    {/*  R1: Displaying Brand, Name, and Variant Color */}
                    <h3 className="text-lg font-reem-kufi font-bold text-dark-gray hover:text-accent-red transition-colors">
                      {item.productVariant.product.brand.name}
                    </h3>
                    <p className="text-sm font-crimson text-dark-gray">
                      {item.productVariant.product.name}
                      <span className="text-dark-gray/60">
                        {" "}
                        - {item.productVariant.color}
                      </span>
                    </p>
                  </Link>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="flex items-center border border-dark-gray rounded-full overflow-hidden">
                      <button
                        onClick={() => handleUpdateQuantity(item, -1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4 text-sm font-bold text-dark-gray">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item, 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    {/*  R2: Displaying the final line price */}
                    <span className="text-sm font-montserrat text-dark-gray font-semibold">
                      $ {Number(item.price).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-2 hover:bg-red-100 rounded-full transition"
                  title="Remove item"
                >
                  <Trash className="w-5 h-5 text-red-400" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Summary Box */}
        <div className="p-6 bg-mint-light border border-light-green rounded-md shadow-soft space-y-4 self-start">
          <h3 className="text-lg font-reem-kufi font-bold text-dark-gray mb-4">
            Order Summary
          </h3>
          <div className="flex justify-between text-sm font-montserrat text-dark-gray">
            <span>Subtotal</span>
            <span>$ {Number(subtotal).toFixed(2)}</span>
          </div>

          {/*  ADD THIS NEW SECTION */}
          {totalSavings > 0 && (
            <div className="flex justify-between text-sm font-montserrat font-medium text-green-600">
              <span>Discount</span>
              <span>( $ {totalSavings.toFixed(2)})</span>
            </div>
          )}
          <hr className="my-2 border-brown" />
          <div className="flex justify-between font-bold text-base text-dark-gray">
            <span>Total</span>
            <span>$ {Number(total).toFixed(2)}</span>
          </div>
          <button
            onClick={() => router.push("/checkout")}
            className="btn-dark w-full px-6 py-3 rounded-md text-sm mt-4"
          >
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </section>
  );
}
