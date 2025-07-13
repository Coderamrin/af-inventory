"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      const [productsRes, sellersRes, assignmentsRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/sellers"),
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

      setStats({ totalProducts, totalSellers, totalAssigned });
    }

    fetchStats();
  }, []);

  if (!stats) return <div className="text-2xl text-amber-400">test Loading stats...</div>;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Total Products</h3>
          <p className="text-2xl">{stats.totalProducts}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Total Sellers</h3>
          <p className="text-2xl">{stats.totalSellers}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Total Assigned Quantity</h3>
          <p className="text-2xl">{stats.totalAssigned}</p>
        </div>
      </div>
    </div>
  );
}
