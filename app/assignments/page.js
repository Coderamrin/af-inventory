"use client";

import React, { useEffect, useState } from "react";

export default function Assignments() {
  const [products, setProducts] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedSeller, setSelectedSeller] = useState("");
  const [quantity, setQuantity] = useState("");

  const [editId, setEditId] = useState(null);
  const [editQuantity, setEditQuantity] = useState("");

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
    if (!product || parseInt(quantity) > product.totalStock) {
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

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this assignment?")) return;

    const res = await fetch(`/api/assignments/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      fetchAll();
    } else {
      alert("Failed to delete assignment");
    }
  }

  async function handleUpdate(id) {
    const res = await fetch(`/api/assignments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newQuantity: parseInt(editQuantity) }),
    });

    if (res.ok) {
      setEditId(null);
      setEditQuantity("");
      fetchAll();
    } else {
      alert("Failed to update quantity");
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
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((a) => (
            <tr key={a.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{a.product.name}</td>
              <td className="p-3">{a.seller.name}</td>
              <td className="p-3">
                {editId === a.id ? (
                  <input
                    type="number"
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(e.target.value)}
                    className="border p-1 rounded w-20"
                    min={1}
                  />
                ) : (
                  a.quantity
                )}
              </td>
              <td className="p-3 space-x-2">
                {editId === a.id ? (
                  <>
                    <button
                      onClick={() => handleUpdate(a.id)}
                      className="px-2 py-1 bg-green-600 text-white rounded text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditId(null);
                        setEditQuantity("");
                      }}
                      className="px-2 py-1 border rounded text-sm"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditId(a.id);
                        setEditQuantity(a.quantity);
                      }}
                      className="px-2 py-1 bg-yellow-500 text-white rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="px-2 py-1 bg-red-600 text-white rounded text-sm"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
