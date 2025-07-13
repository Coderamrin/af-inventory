"use client";

import React, { useEffect, useState } from "react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [totalStock, setTotalStock] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

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

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name || !price || !totalStock) {
      alert("Please fill all fields");
      return;
    }

    const payload = {
      name,
      price: parseFloat(price),
      totalStock: parseInt(totalStock),
    };

    const res = await fetch(
      editMode ? `/api/products/${editId}` : "/api/products",
      {
        method: editMode ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (res.ok) {
      resetForm();
      fetchProducts();
    } else {
      alert(editMode ? "Failed to update product" : "Failed to add product");
    }
  }

  function resetForm() {
    setName("");
    setPrice("");
    setTotalStock("");
    setShowForm(false);
    setEditMode(false);
    setEditId(null);
  }

  function handleEdit(product) {
    setEditMode(true);
    setEditId(product.id);
    setName(product.name);
    setPrice(product.price);
    setTotalStock(product.totalStock);
    setShowForm(true);
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const res = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      fetchProducts();
    } else {
      alert("Failed to delete product");
    }
  }

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Products</h2>

      <button
        onClick={() => {
          resetForm();
          setShowForm(true);
        }}
        className="mb-6 px-4 py-2 bg-green-600 text-white rounded"
      >
        {editMode ? "Cancel Edit" : "Add New Product"}
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
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
            {editMode ? "Update Product" : "Save Product"}
          </button>
          <button
            type="button"
            onClick={resetForm}
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
            <th className="p-3 text-left">Price/Item</th>
            <th className="p-3 text-left">Total Price </th>
            <th className="p-3 text-left">Total Stock</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{p.name}</td>
              <td className="p-3">{p.price.toFixed(2)} টাকা</td>
              <td className="p-3">{p.price.toFixed(2) * p.totalStock} টাকা</td>
              <td className="p-3">{p.totalStock}</td>
              <td className="p-3 space-x-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
