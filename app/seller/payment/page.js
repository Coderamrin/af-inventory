"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function Sellers() {
  const { data: session, status } = useSession();

  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");

  async function fetchSellers() {
    try {
      setLoading(true);
      const res = await fetch("/api/sellers/summary");
      const data = await res.json();

      if (session?.user?.email) {
        const filtered = data.filter(
          (seller) => seller.email === session.user.email
        );
        setSellers(filtered);
      }
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      fetchSellers();
    }
  }, [status, session]);

  if (loading || status !== "authenticated")
    return <div>Loading sellers...</div>;
  if (error) return <div>Error loading sellers</div>;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">My Seller Info</h2>

      {sellers.length === 0 ? (
        <p className="text-gray-500">You are not registered as a seller yet.</p>
      ) : (
        <table className="w-full bg-white rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Number</th>
              <th className="p-3 text-left">Total Assigned (৳)</th>
              <th className="p-3 text-left">Total Paid (৳)</th>
              <th className="p-3 text-left">Balance (৳)</th>
              <th className="p-3 text-left">Assigned Products</th>
              <th className="p-3 text-left">Payment History</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((seller) => {
              const totalAssigned = seller.totalAssignedValue || 0;
              const totalPaid = seller.totalPaid || 0;
              const balance = totalPaid - totalAssigned;

              return (
                <tr
                  key={seller.id}
                  className="border-b hover:bg-gray-50 align-top"
                >
                  <td className="p-3 font-semibold">{seller.name}</td>
                  <td className="p-3 font-semibold">{seller.phone}</td>
                  <td className="p-3">{totalAssigned.toFixed(2)}</td>
                  <td className="p-3">{totalPaid.toFixed(2)}</td>
                  <td
                    className={`p-3 font-bold ${
                      balance < 0 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {balance.toFixed(2)}
                  </td>
                  <td className="p-3 max-w-xs">
                    {seller.assignments?.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1">
                        {seller.assignments.map((a) => (
                          <li key={a.id}>
                            {a.product.name} × {a.quantity}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-400">No assignments</span>
                    )}
                  </td>
                  <td className="p-3 max-w-xs">
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
                      <span className="text-gray-400">No payments</span>
                    )}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => {
                        setSelectedSeller(seller);
                        setShowPayModal(true);
                      }}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Make Payment
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Payment Modal */}
      {showPayModal && selectedSeller && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setShowPayModal(false)}
        >
          <div
            className="bg-white p-6 rounded shadow-md w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">
              Make Payment to {selectedSeller.name}
            </h3>
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <input
                type="number"
                step="0.01"
                placeholder="Payment Amount"
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
