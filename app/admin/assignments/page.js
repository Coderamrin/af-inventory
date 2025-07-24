"use client";

import { Button } from "@/components/ui/button";
import getDate from "@/lib/getDate";
import { useState, useEffect } from "react";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function ProductAssigner() {
  const [sellers, setSellers] = useState([]);
  const [products, setProducts] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [created, setCreated] = useState("");
  const [message, setMessage] = useState("");

  const [filterSeller, setFilterSeller] = useState("");
  const [filterProduct, setFilterProduct] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch("/api/users?sellerOnly=true")
      .then((res) => res.json())
      .then(setSellers);

    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts);

    fetchAssignments();
  }, []);

  const filteredAssignments = assignments.filter((a) => {
    const matchSeller = filterSeller ? a.userId === Number(filterSeller) : true;
    const matchProduct = filterProduct
      ? a.productId === Number(filterProduct)
      : true;
    const matchDate = filterDate
      ? new Date(a.createdAt).toISOString().startsWith(filterDate)
      : true;
    return matchSeller && matchProduct && matchDate;
  });

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
        createdAt: created,
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
      {/* <h2 className="text-xl font-semibold mb-4">Assign Product to Seller</h2> */}

      {/* Assignment Form */}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogTrigger asChild>
          <Button onClick={() => setShowForm(true)}>Assign Product</Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Product to Seller</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block mb-1">Seller:</label>
              <select
                className="w-full p-2 border"
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
            </div>

            <div>
              <label className="block mb-1">Product:</label>
              <select
                className="w-full p-2 border"
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
            </div>

            <div>
              <label className="block mb-1">Quantity:</label>
              <input
                type="number"
                className="w-full p-2 border"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1">Date:</label>
              <input
                type="date"
                className="w-full p-2 border"
                value={created}
                onChange={(e) => setCreated(e.target.value)}
              />
            </div>

            {message && <p className="text-sm text-gray-600">{message}</p>}
          </div>

          <DialogFooter className="mt-4">
            <Button
              onClick={assignProduct}
              disabled={!selectedSeller || !selectedProduct}
            >
              Assign
            </Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Responsive Assignments */}
      <h1 className="text-2xl font-semibold mt-4 mb-2">Assigned Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <select
          className="w-full p-2 border"
          value={filterSeller}
          onChange={(e) => setFilterSeller(e.target.value)}
        >
          <option value="">Filter by Seller</option>
          {sellers.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          className="w-full p-2 border"
          value={filterProduct}
          onChange={(e) => setFilterProduct(e.target.value)}
        >
          <option value="">Filter by Product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="w-full p-2 border"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </div>

      {/* Table for Desktop */}
      <div className="hidden md:block">
        <table className="w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Seller</th>
              <th className="p-2 border">Product</th>
              <th className="p-2 border">Total Price</th>
              <th className="p-2 border">Created</th>
              <th className="p-2 border">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {assignments.length > 0 ? (
              filteredAssignments.map((a) => (
                <tr key={a.id}>
                  <td className="p-2 border">{a.user?.name || a.userId}</td>
                  <td className="p-2 border">
                    {a.product?.name || a.productId}
                  </td>
                  <td className="p-2 border">
                    ৳{(a.product?.price * a.quantity).toFixed(2)}
                  </td>
                  <td className="p-2 border">{getDate(a.createdAt)}</td>
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
          filteredAssignments.map((a) => (
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
                <strong>Created At:</strong> {getDate(a.createdAt)}
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
