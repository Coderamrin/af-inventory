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
  const [stockData, setStockData] = useState([]);

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

      const totalPaidMoney = sellers.reduce(
        (acc, s) => acc + (s.totalPaid || 0),
        0
      );

      const totalOwedMoney = sellers.reduce((acc, s) => {
        const owed = (s.totalAssignedValue || 0) - (s.totalPaid || 0);
        return acc + (owed > 0 ? owed : 0);
      }, 0);

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

      const sellerChart = sellers.map((s) => ({
        name: s.name,
        Paid: s.totalPaid || 0,
        Owed: Math.max((s.totalAssignedValue || 0) - (s.totalPaid || 0), 0),
      }));

      const stockChart = products.map((p) => ({
        name: p.name,
        Stock: p.totalStock,
      }));

      setStockData(stockChart);
      setProductData(productChart);
      setSellerData(sellerChart);
      setStats({
        totalProducts,
        totalSellers,
        totalAssigned,
        totalPaidMoney,
        totalOwedMoney,
      });
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
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
        <div className="bg-green-100 p-5 rounded-xl shadow">
          <h3 className="text-lg font-semibold">Total Paid</h3>
          <p className="text-3xl font-bold">
            ৳{stats.totalPaidMoney.toFixed(2)}
          </p>
        </div>
        <div className="bg-red-100 p-5 rounded-xl shadow">
          <h3 className="text-lg font-semibold">Total Owed</h3>
          <p className="text-3xl font-bold">
            ৳{stats.totalOwedMoney.toFixed(2)}
          </p>
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

      {/* Bar Chart: Product Stock Availability */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">
          Available Stock per Product
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stockData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Stock" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
