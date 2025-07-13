"use client";

import React, { useEffect, useState } from "react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add product form states
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [totalStock, setTotalStock] = useState("");
  const [showForm, setShowForm] = useState(false);

  async function fetchProducts() {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function handleAddProduct(e) {
    e.preventDefault();
    if (!name || !price || !totalStock) {
      alert("Please fill all fields");
      return;
    }

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price: parseFloat(price), totalStock: parseInt(totalStock) }),
    });

    if (res.ok) {
      setName("");
      setPrice("");
      setTotalStock("");
      setShowForm(false);
      fetchProducts();
    } else {
      alert("Failed to add product");
    }
  }

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Products</h2>

      <button
        onClick={() => setShowForm(true)}
        className="mb-6 px-4 py-2 bg-green-600 text-white rounded"
      >
        Add New Product
      </button>

      {showForm && (
        <form
          onSubmit={handleAddProduct}
          className="mb-6 p-4 bg-white rounded shadow space-y-4 max-w-md"
        >
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            min="0"
            step="0.01"
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Total Stock"
            value={totalStock}
            min="0"
            onChange={(e) => setTotalStock(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded"
          >
            Save Product
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="ml-4 py-2 px-4 border rounded"
          >
            Cancel
          </button>
        </form>
      )}

      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Price</th>
            <th className="p-3 text-left">Total Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{p.name}</td>
              <td className="p-3">{p.price.toFixed(2)} টাকা</td>
              <td className="p-3">{p.totalStock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
