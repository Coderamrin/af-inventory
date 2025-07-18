"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function SellerDashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState(null);
  const [productData, setProductData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);

  useEffect(() => {
    if (status !== "authenticated") return;

    async function fetchSellerStats() {
      const [productsRes, assignmentsRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/assignments"),
      ]);

      const products = await productsRes.json();
      const assignments = await assignmentsRes.json();

      const sellerEmail = session.user.email;

      // Filter assignments belonging to current seller
      const sellerAssignments = assignments.filter(
        (a) => a.seller?.email === sellerEmail
      );

      const totalAssigned = sellerAssignments.reduce(
        (acc, cur) => acc + cur.quantity,
        0
      );

      // Pie Chart: Assigned Quantity per Product
      const productMap = {};
      sellerAssignments.forEach((a) => {
        const product = products.find((p) => p.id === a.productId);
        if (product) {
          productMap[product.name] =
            (productMap[product.name] || 0) + a.quantity;
        }
      });

      const productChart = Object.entries(productMap).map(([name, value]) => ({
        name,
        value,
      }));

      // Payments Summary
      const totalAssignedValue = sellerAssignments.reduce(
        (acc, a) => acc + a.quantity * (a.unitPrice || 0),
        0
      );
      const totalPaid = sellerAssignments.reduce(
        (acc, a) => acc + (a.paid || 0),
        0
      );

      setStats({
        totalProducts: Object.keys(productMap).length,
        totalAssigned,
        totalAssignedValue,
        totalPaid,
      });

      setProductData(productChart);
      setPaymentData([
        { name: "Paid", value: totalPaid },
        { name: "Owed", value: Math.max(totalAssignedValue - totalPaid, 0) },
      ]);
    }

    fetchSellerStats();
  }, [status, session]);

  if (status !== "authenticated" || !stats) {
    return (
      <p className="text-lg text-blue-500">🔄 Loading Seller Dashboard...</p>
    );
  }

  const COLORS = ["#10b981", "#ef4444", "#6366f1", "#f59e0b", "#0ea5e9"];

  return (
    <div className="space-y-10">
      <h2 className="text-3xl font-bold text-gray-800">📦 Seller Dashboard</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-100 p-5 rounded-xl shadow">
          <h3 className="text-lg font-semibold">Total Products Assigned</h3>
          <p className="text-3xl font-bold">{stats.totalProducts}</p>
        </div>
        <div className="bg-amber-100 p-5 rounded-xl shadow">
          <h3 className="text-lg font-semibold">Total Quantity Assigned</h3>
          <p className="text-3xl font-bold">{stats.totalAssigned}</p>
        </div>
        <div className="bg-green-100 p-5 rounded-xl shadow">
          <h3 className="text-lg font-semibold">Total Value</h3>
          <p className="text-3xl font-bold">৳ {stats.totalAssignedValue}</p>
        </div>
      </div>

      {/* Pie Chart: Assigned Products */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">
          Assigned Product Breakdown
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={productData} dataKey="value" outerRadius={120} label>
              {productData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart: Payments */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Payment Status</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={paymentData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
