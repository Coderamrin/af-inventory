"use client";

import React, { useEffect, useState } from "react";

export default function Sellers() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [name, setName] = useState("");
  const [showForm, setShowForm] = useState(false);

  async function fetchSellers() {
    try {
      setLoading(true);
      const res = await fetch("/api/sellers");
      const data = await res.json();
      setSellers(data);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSellers();
  }, []);

  async function handleAddSeller(e) {
    e.preventDefault();
    if (!name) {
      alert("Please enter a seller name");
      return;
    }
    const res = await fetch("/api/sellers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (res.ok) {
      setName("");
      setShowForm(false);
      fetchSellers();
    } else {
      alert("Failed to add seller");
    }
  }

  if (loading) return <div>Loading sellers...</div>;
  if (error) return <div>Error loading sellers</div>;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Sellers</h2>

      <button
        onClick={() => setShowForm(true)}
        className="mb-6 px-4 py-2 bg-green-600 text-white rounded"
      >
        Add New Seller
      </button>

      {showForm && (
        <form
          onSubmit={handleAddSeller}
          className="mb-6 p-4 bg-white rounded shadow max-w-md space-y-4"
        >
          <input
            type="text"
            placeholder="Seller Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded"
          >
            Save Seller
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

      <ul className="bg-white rounded shadow divide-y max-w-md">
        {sellers.map((seller) => (
          <li key={seller.id} className="p-3 hover:bg-gray-50">
            {seller.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
