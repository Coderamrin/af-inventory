"use client";

import React, { useEffect, useState } from "react";

export default function Assignments() {
  const [products, setProducts] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedSeller, setSelectedSeller] = useState("");
  const [quantity, setQuantity] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchAll() {
    try {
      setLoading(true);
      const [pRes, sRes, aRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/sellers"),
        fetch("/api/assignments"),
      ]);
      const [pData, sData, aData] = await Promise.all([
        pRes.json(),
        sRes.json(),
        aRes.json(),
      ]);
      setProducts(pData);
      setSellers(sData);
      setAssignments(aData);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAll();
  }, []);

  async function handleAssign(e) {
    e.preventDefault();
    if (!selectedProduct || !selectedSeller || !quantity) {
      alert("সব ঘর পূরণ করুন");
      return;
    }

    const product = products.find((p) => p.id === parseInt(selectedProduct));
    if (!product) {
      alert("Invalid product selected");
      return;
    }
    if (quantity > product.totalStock) {
      alert("স্টক এর বেশি পরিমাণ নির্ধারণ করা যায় না");
      return;
    }

    const res = await fetch("/api/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: parseInt(selectedProduct),
        sellerId: parseInt(selectedSeller),
        quantity: parseInt(quantity),
      }),
    });

    if (res.ok) {
      setSelectedProduct("");
      setSelectedSeller("");
      setQuantity("");
      fetchAll();
    } else {
      alert("অ্যাসাইনমেন্ট ব্যর্থ হয়েছে");
    }
  }

  if (loading) return <div>Loading assignments...</div>;
  if (error) return <div>Error loading assignments</div>;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Product Assignments to Sellers</h2>

      <form
        onSubmit={handleAssign}
        className="mb-6 p-4 bg-white rounded shadow max-w-md space-y-4"
      >
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} (Stock: {p.totalStock})
            </option>
          ))}
        </select>

        <select
          value={selectedSeller}
          onChange={(e) => setSelectedSeller(e.target.value)}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Seller</option>
          {sellers.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          min="1"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded"
        >
          Assign
        </button>
      </form>

      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Product</th>
            <th className="p-3 text-left">Seller</th>
            <th className="p-3 text-left">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((a) => (
            <tr key={a.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{a.product.name}</td>
              <td className="p-3">{a.seller.name}</td>
              <td className="p-3">{a.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
