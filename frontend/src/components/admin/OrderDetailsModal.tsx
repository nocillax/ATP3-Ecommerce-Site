"use client";

import { X } from "lucide-react";
import { Order, OrderItem } from "@/types";
import { useState } from "react";
import NotchedSelect from "../ui/NotchedSelect";

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  // ✅ Add a prop to handle status changes
  onStatusChange: (orderId: number, newStatus: string) => void;
}

export default function OrderDetailsModal({
  isOpen,
  onClose,
  order,
  onStatusChange,
}: OrderDetailsModalProps) {
  if (!isOpen || !order) return null;

  const [newStatus, setNewStatus] = useState(order.status);

  const orderDate = new Date(order.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const orderTime = new Date(order.date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="fixed inset-0 bg-black/40 z-50 grid place-items-center overflow-y-auto p-4">
      <div className="bg-white w-full max-w-3xl rounded-md p-6 relative shadow-lg">
        <button
          className="absolute top-4 right-4 p-1 rounded hover:bg-gray-200"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold mb-4">Order Details #{order.id}</h2>

        {/* Order Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6 border-b pb-4">
          <div>
            <span className="font-bold">Customer:</span> {order.customer}
          </div>
          <div>
            <span className="font-bold">Date:</span> {orderDate}
          </div>
          <div>
            <span className="font-bold">Shipping Address:</span>{" "}
            {order.shippingAddress}
          </div>
          <div>
            <span className="font-bold">Time:</span> {orderTime}
          </div>
          <div>
            <span className="font-bold">Payment:</span> {order.paymentStatus}
          </div>
          <div>
            <span className="font-bold">Status:</span> {order.status}
          </div>
        </div>

        {/* Change Status Section */}
        <div className="flex items-end gap-4 mb-6">
          <NotchedSelect
            label="Change Order Status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as Order["status"])}
            className="w-full md:w-1/3"
            options={["Pending", "Shipped", "Delivered", "Cancelled"].map(
              (s) => ({ value: s, label: s })
            )}
          />
          <button
            onClick={() => onStatusChange(order.databaseId, newStatus)}
            className="btn-dark py-3 px-4 text-sm"
          >
            Update Status
          </button>
        </div>

        {/* Order Items Table */}
        <h3 className="font-bold text-sm mb-2">Order Items</h3>
        <div className="border rounded-md overflow-hidden">
          <table className="w-full text-sm">
            {/* ✅ Updated Table Header */}
            <thead className="bg-gray-50 text-xs uppercase font-semibold">
              <tr>
                <th className="px-4 py-2 text-left" colSpan={2}>
                  Product
                </th>
                <th className="px-4 py-2 text-right">Regular Price</th>
                <th className="px-4 py-2 text-right">Discount</th>
                <th className="px-4 py-2 text-right">Final Price</th>
                <th className="px-4 py-2 text-center">Qty</th>
                <th className="px-4 py-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2 w-16">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${item.imageUrl}`}
                      alt={item.name}
                      className="h-12 w-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <div className="font-bold">{item.name}</div>
                    <div className="text-xs text-gray-600">
                      {item.variantInfo}
                    </div>
                  </td>

                  {/* ✅ New, detailed price columns */}
                  <td className="px-4 py-2 text-right">
                    BDT {item.originalPrice.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-right text-red-600">
                    {item.discount > 0
                      ? `-BDT ${item.discount.toFixed(2)}`
                      : "—"}
                  </td>
                  <td className="px-4 py-2 text-right font-medium">
                    BDT {item.price.toFixed(2)}
                  </td>

                  <td className="px-4 py-2 text-center">{item.quantity}</td>
                  <td className="px-4 py-2 text-right font-semibold">
                    BDT {item.subtotal.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Grand Total Footer */}
            <tfoot>
              <tr className="border-t bg-gray-50">
                <td colSpan={6} className="px-4 py-2 text-right font-bold">
                  Grand Total
                </td>
                <td className="px-4 py-2 text-right font-bold">
                  BDT {order.total.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
