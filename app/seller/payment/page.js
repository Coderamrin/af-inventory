"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function SellerDashboard() {
  const { data: session, status } = useSession();

  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");

  async function fetchSellerSummary() {
    try {
      setLoading(true);
      const res = await fetch(`/api/sellers/${session.user.id}/summary`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch summary");

      setSeller(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handlePaymentSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        body: JSON.stringify({
          userId: session.user.id,
          amount: parseFloat(paymentAmount),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Payment failed");

      setShowPayModal(false);
      setPaymentAmount("");
      fetchSellerSummary(); // Refresh after payment
    } catch (err) {
      console.error("Payment error:", err);
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      fetchSellerSummary();
    }
  }, [status]);

  if (loading || status !== "authenticated")
    return <div>Loading seller data...</div>;
  if (error) return <div>Error: {error}</div>;

  const totalAssigned = seller.totalAssignedValue || 0;
  const totalPaid = seller.totalPaid || 0;
  const balance = totalPaid - totalAssigned;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">My Seller Summary</h2>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Name</h3>
          <p>{seller.name}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Email</h3>
          <p>{seller.email}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Total Assigned Value</h3>
          <p>৳ {totalAssigned.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Total Paid</h3>
          <p>৳ {totalPaid.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded shadow col-span-full">
          <h3
            className={`font-semibold ${
              balance < 0 ? "text-red-600" : "text-green-600"
            }`}
          >
            Balance: ৳ {balance.toFixed(2)}
          </h3>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="font-bold mb-2">Assigned Products</h3>
        {seller.assignments?.length > 0 ? (
          <ul className="list-disc list-inside space-y-1">
            {seller.assignments.map((a) => (
              <li key={a.id}>
                {a.product.name} × {a.quantity}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No assignments yet.</p>
        )}
      </div>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="font-bold mb-2">Payment History</h3>
        {seller.payments?.length > 0 ? (
          <ul className="list-disc list-inside space-y-1">
            {seller.payments.map((p) => (
              <li key={p.id}>
                ৳{p.amount.toFixed(2)} —{" "}
                {new Date(p.timestamp).toLocaleDateString()}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No payments yet.</p>
        )}
      </div>

      <button
        onClick={() => setShowPayModal(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Make Payment
      </button>

      {showPayModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setShowPayModal(false)}
        >
          <div
            className="bg-white p-6 rounded shadow-md w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">Pay Now</h3>
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <input
                type="number"
                step="0.01"
                placeholder="Amount"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
