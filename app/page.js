"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [productData, setProductData] = useState([]);
  const [sellerData, setSellerData] = useState([]);

  useEffect(() => {
    async function fetchStats() {
      const [productsRes, sellersRes, assignmentsRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/sellers/summary"),
        fetch("/api/assignments"),
      ]);
      const products = await productsRes.json();
      const sellers = await sellersRes.json();
      const assignments = await assignmentsRes.json();

      const totalProducts = products.length;
      const totalSellers = sellers.length;
      const totalAssigned = assignments.reduce(
        (acc, cur) => acc + cur.quantity,
        0
      );

      // Pie chart: total quantity assigned per product
      const productQuantityMap = {};
      assignments.forEach((a) => {
        const product = products.find((p) => p.id === a.productId);
        if (product) {
          productQuantityMap[product.name] =
            (productQuantityMap[product.name] || 0) + a.quantity;
        }
      });
      const productChart = Object.entries(productQuantityMap).map(
        ([name, value]) => ({ name, value })
      );

      // Bar chart: seller balances
      const sellerChart = sellers.map((s) => ({
        name: s.name,
        Paid: s.totalPaid || 0,
        Owed: Math.max((s.totalAssignedValue || 0) - (s.totalPaid || 0), 0),
      }));

      setProductData(productChart);
      setSellerData(sellerChart);
      setStats({ totalProducts, totalSellers, totalAssigned });
    }

    fetchStats();
  }, []);

  if (!stats)
    return (
      <div className="text-xl text-yellow-500 font-semibold">
        🚀 Loading dashboard with charts...
      </div>
    );

  const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#0ea5e9"];

  return (
    <div className="space-y-10">
      <h2 className="text-3xl font-bold mb-2 text-gray-800">📊 Dashboard</h2>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-100 p-5 rounded-xl shadow">
          <h3 className="text-lg font-semibold">Total Products</h3>
          <p className="text-3xl font-bold">{stats.totalProducts}</p>
        </div>
        <div className="bg-emerald-100 p-5 rounded-xl shadow">
          <h3 className="text-lg font-semibold">Total Sellers</h3>
          <p className="text-3xl font-bold">{stats.totalSellers}</p>
        </div>
        <div className="bg-amber-100 p-5 rounded-xl shadow">
          <h3 className="text-lg font-semibold">Total Assigned</h3>
          <p className="text-3xl font-bold">{stats.totalAssigned}</p>
        </div>
      </div>

      {/* Pie Chart: Product Assignment Distribution */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Product Assignment Ratio</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              dataKey="value"
              isAnimationActive
              data={productData}
              outerRadius={120}
              label
            >
              {productData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart: Seller Balances */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Seller Payments Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sellerData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Paid" fill="#10b981" />
            <Bar dataKey="Owed" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
