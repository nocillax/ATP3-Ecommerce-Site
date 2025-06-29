"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const stats = [
  {
    label: "Total Products",
    value: 128,
  },
  {
    label: "Monthly Sales",
    value: 342,
  },
  {
    label: "Monthly Profit",
    value: "BDT 24,980",
    change: +12.5,
  },
  {
    label: "Top Product",
    value: "VELURÉ Silk Hijab",
  },
  {
    label: "Fastest-Moving Product",
    value: "LUMÉ Cotton Essentials",
  },
  {
    label: "Most Loss-Making Product",
    value: "AYRAH Luxe Wrap",
  },
];

const chartData = [
  { name: "Week 1", sales: 54 },
  { name: "Week 2", sales: 78 },
  { name: "Week 3", sales: 91 },
  { name: "Week 4", sales: 68 },
];

const peakHours = [
  { hour: "10 AM", sales: 42 },
  { hour: "12 PM", sales: 61 },
  { hour: "2 PM", sales: 37 },
  { hour: "4 PM", sales: 53 },
  { hour: "6 PM", sales: 29 },
];

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-playfair font-bold text-dark-gray mb-6">
        Manager Dashboard
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-mint-light border border-light-green rounded-xl p-5 shadow-sm"
          >
            <p className="text-sm text-dark-gray font-semibold mb-1">
              {stat.label}
            </p>
            <p className="text-xl font-bold text-dark-gray">
              {stat.value}
              {stat.change !== undefined && (
                <span
                  className={`ml-2 text-sm font-bold ${
                    stat.change > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.change > 0 ? "▲" : "▼"} {Math.abs(stat.change)}%
                </span>
              )}
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend Chart */}
        <div className="bg-white border border-light-green rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-playfair font-bold text-dark-gray mb-4">
            Monthly Sales Trend
          </h2>
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Bar dataKey="sales" fill="#3f6e67" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Peak Hours Chart */}
        <div className="bg-white border border-light-green rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-playfair font-bold text-dark-gray mb-4">
            Peak Sales Hours (This Month)
          </h2>
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peakHours}>
                <XAxis dataKey="hour" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Bar dataKey="sales" fill="#69b3a2" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
