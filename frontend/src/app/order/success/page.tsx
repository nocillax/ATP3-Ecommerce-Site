"use client";

import { useRequireAuth } from "@/hooks/useRequireAuth";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function OrderSuccessPage() {
  const { user, isloading } = useRequireAuth();

  return (
    <section className="max-w-xl mx-auto px-4 py-20 text-center">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
      <h1 className="text-2xl font-playfair font-bold text-dark-gray mb-4">
        Order Confirmed!
      </h1>
      <p className="text-sm font-montserrat text-dark-gray mb-8">
        Thank you for your purchase. A confirmation email has been sent. Your
        order will be shipped soon!
      </p>
      <Link href="/">
        <button className="btn-primary px-6 py-3 rounded-md text-sm">
          Continue Shopping
        </button>
      </Link>
    </section>
  );
}
