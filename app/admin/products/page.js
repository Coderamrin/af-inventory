"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [totalStock, setTotalStock] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);

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
      setDialogOpen(false);
    } else {
      alert(editMode ? "Failed to update product" : "Failed to add product");
    }
  }

  function resetForm() {
    setName("");
    setPrice("");
    setTotalStock("");
    setEditMode(false);
    setEditId(null);
  }

  function handleEdit(product) {
    setEditMode(true);
    setEditId(product.id);
    setName(product.name);
    setPrice(product.price);
    setTotalStock(product.totalStock);
    setDialogOpen(true);
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
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Products</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm();
                setDialogOpen(true);
              }}
            >
              {editMode ? "Edit Product" : "Add New Product"}
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-md">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editMode ? "Edit Product" : "Add New Product"}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <Input
                  type="text"
                  placeholder="Product Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Price"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Total Stock"
                  min="0"
                  value={totalStock}
                  onChange={(e) => setTotalStock(e.target.value)}
                />
              </div>

              <DialogFooter className="gap-2">
                <Button type="submit">{editMode ? "Update" : "Save"}</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {products.length === 0 ? (
        <p className="text-sm text-gray-500">No products found.</p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full bg-white border rounded-md text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 border-b">Name</th>
                  <th className="p-3 border-b">Price/Item</th>
                  <th className="p-3 border-b">Total Price</th>
                  <th className="p-3 border-b">Stock</th>
                  <th className="p-3 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{p.name}</td>
                    <td className="p-3">{p.price.toFixed(2)} টাকা</td>
                    <td className="p-3">
                      {(p.price * p.totalStock).toFixed(2)} টাকা
                    </td>
                    <td className="p-3">{p.totalStock}</td>
                    <td className="p-3 space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(p)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(p.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="space-y-4 md:hidden">
            {products.map((p) => (
              <div
                key={p.id}
                className="border rounded-lg shadow-sm p-4 bg-white space-y-2 text-sm"
              >
                <div>
                  <strong>Name:</strong> {p.name}
                </div>
                <div>
                  <strong>Price/Item:</strong> {p.price.toFixed(2)} টাকা
                </div>
                <div>
                  <strong>Total Price:</strong>{" "}
                  {(p.price * p.totalStock).toFixed(2)} টাকা
                </div>
                <div>
                  <strong>Stock:</strong> {p.totalStock}
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(p)}
                    // className="w-full"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(p.id)}
                    // className="w-full"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
