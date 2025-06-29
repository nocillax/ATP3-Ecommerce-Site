"use client";

import ProductModal from "@/components/admin/ProductModal";
import AdminLayout from "@/components/admin/AdminLayout";
import { useParams, useRouter } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Pencil, Trash } from "lucide-react";
import { useState } from "react";

const salesData = [
  { date: "Jun 01", units: 2, revenue: 2598 },
  { date: "Jun 02", units: 0, revenue: 0 },
  { date: "Jun 03", units: 1, revenue: 1299 },
  { date: "Jun 04", units: 3, revenue: 3897 },
  { date: "Jun 05", units: 0, revenue: 0 },
  { date: "Jun 06", units: 2, revenue: 2598 },
  { date: "Jun 07", units: 1, revenue: 1299 },
  { date: "Jun 08", units: 0, revenue: 0 },
  { date: "Jun 09", units: 4, revenue: 5196 },
  { date: "Jun 10", units: 2, revenue: 2598 },
  { date: "Jun 11", units: 3, revenue: 3897 },
  { date: "Jun 12", units: 1, revenue: 1299 },
  { date: "Jun 13", units: 0, revenue: 0 },
  { date: "Jun 14", units: 2, revenue: 2598 },
  { date: "Jun 15", units: 1, revenue: 1299 },
];

const product = {
  id: 1,
  name: "VELURÉ Premium Silk Hijab",
  brand: "VELURÉ",
  category: "Hijab",
  price: 1299,
  stock: 22,
  totalSold: 25,
  totalRevenue: 32475,
  discount: 15,
};

export default function ProductAnalyticsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <AdminLayout>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-2xl font-playfair font-bold text-dark-gray mb-1">
            Product Performance
          </h1>
          <p className="text-sm font-montserrat text-gray-600">
            Product ID: {id}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-2 flex items-center gap-1 text-sm font-semibold text-white bg-dark-gray rounded hover:bg-gray-800"
          >
            <Pencil className="w-4 h-4" /> Edit
          </button>
          <button
            onClick={() => alert("Delete logic here")}
            className="px-3 py-2 flex items-center gap-1 text-sm font-semibold text-red-700 border border-red-300 rounded hover:bg-red-50"
          >
            <Trash className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-mint-light border border-light-green rounded-xl p-5">
          <p className="text-sm text-dark-gray mb-1">Name</p>
          <p className="text-lg font-bold text-dark-gray">{product.name}</p>
        </div>
        <div className="bg-mint-light border border-light-green rounded-xl p-5">
          <p className="text-sm text-dark-gray mb-1">Brand</p>
          <p className="text-lg font-bold text-dark-gray">{product.brand}</p>
        </div>
        <div className="bg-mint-light border border-light-green rounded-xl p-5">
          <p className="text-sm text-dark-gray mb-1">Price</p>
          <p className="text-lg font-bold text-dark-gray">
            BDT {product.price}
          </p>
        </div>
        <div className="bg-mint-light border border-light-green rounded-xl p-5">
          <p className="text-sm text-dark-gray mb-1">Current Stock</p>
          <p className="text-lg font-bold text-dark-gray">
            {product.stock} units
          </p>
        </div>
        <div className="bg-mint-light border border-light-green rounded-xl p-5">
          <p className="text-sm text-dark-gray mb-1">Total Sold</p>
          <p className="text-lg font-bold text-dark-gray">
            {product.totalSold} units
          </p>
        </div>
        <div className="bg-mint-light border border-light-green rounded-xl p-5">
          <p className="text-sm text-dark-gray mb-1">Total Revenue</p>
          <p className="text-lg font-bold text-dark-gray">
            BDT {product.totalRevenue}
          </p>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="bg-white border border-light-green rounded-xl p-6">
        <h2 className="text-lg font-playfair font-bold text-dark-gray mb-4">
          Last 15 Days Sales
        </h2>
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="units"
                stroke="#3f6e67"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={product}
        onSubmit={(data) => console.log("Update product:", data)}
      />
    </AdminLayout>
  );
}
