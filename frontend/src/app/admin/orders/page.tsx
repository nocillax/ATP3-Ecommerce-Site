// IN: src/app/admin/orders/page.tsx
// ACTION: Replace your entire file with this.

"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import OrderDetailsModal from "@/components/admin/OrderDetailsModal";
import { Eye, Trash } from "lucide-react"; // Add Trash icon
import { useState, useEffect } from "react";
import { Order } from "@/types";
import api from "@/lib/api";
import axios from "axios";
import NotchedSelect from "@/components/ui/NotchedSelect";

const statusOptions = ["All", "Pending", "Shipped", "Delivered", "Cancelled"];
const sortOptions = [
  "Date Newest",
  "Date Oldest",
  "Total High–Low",
  "Total Low–High",
];

export default function AdminOrdersPage() {
  // State to hold orders fetched from the API, correctly typed
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState("Date Newest");
  const [status, setStatus] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const perPage = 5;

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/orders");
        setOrders(response.data.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []); // The empty array [] means this effect runs once when the component mounts

  // ✅ NEW: Handler for changing order status
  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await api.patch(`/orders/${orderId}/status`, {
        status: newStatus.toLowerCase(),
      });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          // ✅ Add 'as Order['status']' to tell TypeScript this is a valid status
          order.databaseId === orderId
            ? { ...order, status: newStatus as Order["status"] }
            : order
        )
      );
      alert("Order status updated successfully!");
    } catch (error) {
      console.error("Failed to update order status:", error);
      alert("Error updating status.");
    }
  };

  // ✅ NEW: Handler for deleting an order
  const handleDeleteOrder = async (orderId: number) => {
    if (
      !window.confirm("Are you sure you want to permanently delete this order?")
    )
      return;
    try {
      await api.delete(`/orders/${orderId}`);
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.databaseId !== orderId)
      );
    } catch (error) {
      console.error("Failed to delete order:", error);
      alert("Error deleting order.");
    }
  };

  let filtered = orders.filter((o) => status === "All" || o.status === status);

  // Your sorting logic here...
  const paginated = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-playfair font-bold text-dark-gray">
          Orders
        </h1>
      </div>

      <div className="overflow-x-auto rounded border border-light-green">
        <table className="min-w-full text-sm text-left font-montserrat text-dark-gray">
          <thead className="bg-light-green text-xs font-bold uppercase">
            <tr>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>{" "}
              {/* ✅ Was "Change Status", now just "Status" */}
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7}>Loading...</td>
              </tr>
            ) : (
              paginated.map((order) => (
                <tr key={order.id} className="border-t border-light-green">
                  <td className="px-4 py-3">{order.id}</td>
                  <td className="px-4 py-3">{order.customer}</td>
                  <td className="px-4 py-3">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    $ {Number(order.total).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    {/* ✅ Reverted to the colored status badge */}
                    <span
                      className={`rounded px-2 py-1 text-xs font-bold ${
                        order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "Shipped"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "Delivered"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-700" // For Cancelled
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    {/* The Eye and Trash buttons remain the same */}
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-1 hover:bg-gray-100"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteOrder(order.databaseId)}
                      className="p-1 hover:bg-gray-100"
                    >
                      <Trash size={16} className="text-red-500" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => setCurrentPage(pageNum)}
            className={`px-3 py-1.5 rounded border text-sm font-bold ${
              pageNum === currentPage
                ? "bg-dark-gray text-mint-light border-dark-gray"
                : "border-dark-gray text-dark-gray hover:bg-dark-gray hover:text-mint-light"
            }`}
          >
            {pageNum}
          </button>
        ))}
      </div>

      <OrderDetailsModal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
        onStatusChange={handleStatusChange} // ✅ Pass the handler function
      />
    </AdminLayout>
  );
}
