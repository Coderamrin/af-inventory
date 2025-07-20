"use client";

import { useState, useEffect } from "react";

export default function ProductAssigner() {
  const [sellers, setSellers] = useState([]);
  const [products, setProducts] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/users?sellerOnly=true")
      .then((res) => res.json())
      .then(setSellers);

    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts);

    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    const res = await fetch("/api/assignments");
    const data = await res.json();
    setAssignments(data);
  };

  const assignProduct = async () => {
    const res = await fetch("/api/assignments", {
      method: "POST",
      body: JSON.stringify({
        userId: Number(selectedSeller),
        productId: Number(selectedProduct),
        quantity: Number(quantity),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      setMessage("✅ Product assigned!");
      fetchAssignments(); // Refresh table
    } else {
      const data = await res.json();
      setMessage("❌ Failed: " + data.error);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Assign Product to Seller</h2>

      {/* Assignment Form */}
      <div className="mb-6">
        <label className="block">Seller:</label>
        <select
          className="w-full p-2 border mb-2"
          value={selectedSeller}
          onChange={(e) => setSelectedSeller(e.target.value)}
        >
          <option value="">Select Seller</option>
          {sellers.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <label className="block">Product:</label>
        <select
          className="w-full p-2 border mb-2"
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
        >
          <option value="">Select Product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <label className="block">Quantity:</label>
        <input
          type="number"
          className="w-full p-2 border mb-4"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={assignProduct}
          disabled={!selectedSeller || !selectedProduct}
        >
          Assign
        </button>

        {message && <p className="mt-2 text-sm">{message}</p>}
      </div>

      {/* Responsive Assignments */}
      <h3 className="text-lg font-semibold mb-2">Assigned Products</h3>

      {/* Table for Desktop */}
      <div className="hidden md:block">
        <table className="w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Seller</th>
              <th className="p-2 border">Product</th>
              <th className="p-2 border">Total Price</th>
              <th className="p-2 border">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {assignments.length > 0 ? (
              assignments.map((a) => (
                <tr key={a.id}>
                  <td className="p-2 border">{a.user?.name || a.userId}</td>
                  <td className="p-2 border">{a.product?.name || a.productId}</td>
                  <td className="p-2 border">৳{(a.product?.price * a.quantity).toFixed(2)}</td>
                  <td className="p-2 border">{a.quantity}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-2 border text-center" colSpan={4}>
                  No assignments yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cards for Mobile */}
      <div className="md:hidden space-y-4">
        {assignments.length > 0 ? (
          assignments.map((a) => (
            <div key={a.id} className="border rounded p-4 shadow-sm">
              <p>
                <strong>Seller:</strong> {a.user?.name || a.userId}
              </p>
              <p>
                <strong>Product:</strong> {a.product?.name || a.productId}
              </p>
              <p>
                <strong>Total Price:</strong> ৳
                {(a.product?.price * a.quantity).toFixed(2)}
              </p>
              <p>
                <strong>Quantity:</strong> {a.quantity}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No assignments yet.</p>
        )}
      </div>
    </div>
  );
}
