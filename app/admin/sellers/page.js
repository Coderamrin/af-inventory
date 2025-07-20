"use client";

import React, { useEffect, useState } from "react";

export default function Sellers() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");

  async function fetchSellers() {
    try {
      setLoading(true);
      const res = await fetch(
        "/api/users?sellerOnly=true&include=assignments,payments"
      );
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

  async function handlePaymentSubmit(e) {
    e.preventDefault();
    if (!paymentAmount || !selectedUser) return;

    const res = await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: selectedUser.id,
        amount: parseFloat(paymentAmount),
      }),
    });

    if (res.ok) {
      setPaymentAmount("");
      setSelectedUser(null);
      setShowPayModal(false);
      fetchSellers();
    } else {
      alert("Failed to record payment");
    }
  }

  if (loading) return <div>Loading sellers...</div>;
  if (error) return <div>Error loading sellers</div>;

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6">Sellers Summary</h2>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="w-full bg-white rounded shadow text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Total Assigned (৳)</th>
              <th className="p-3 text-left">Total Paid (৳)</th>
              <th className="p-3 text-left">Balance (৳)</th>
              <th className="p-3 text-left">Assigned Products</th>
              <th className="p-3 text-left">Payment History</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((user) => {
              const totalAssigned =
                user.assignments?.reduce(
                  (sum, a) => sum + a.product.price * a.quantity,
                  0
                ) || 0;
              const totalPaid =
                user.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
              const balance = totalPaid - totalAssigned;

              return (
                <tr
                  key={user.id}
                  className="border-b hover:bg-gray-50 align-top"
                >
                  <td className="p-3 font-semibold">{user.name}</td>
                  <td className="p-3">{user.phone || "—"}</td>
                  <td className="p-3">{user.email}</td>
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
                    {user.assignments?.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1">
                        {user.assignments.map((a) => (
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
                    {user.payments?.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1">
                        {user.payments.map((p) => (
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
                        setSelectedUser(user);
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
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {sellers.map((user) => {
          const totalAssigned =
            user.assignments?.reduce(
              (sum, a) => sum + a.product.price * a.quantity,
              0
            ) || 0;
          const totalPaid =
            user.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
          const balance = totalPaid - totalAssigned;

          return (
            <div key={user.id} className="border rounded p-4 bg-white shadow">
              <div className="font-semibold text-lg">{user.name}</div>
              <div className="text-sm text-gray-600">{user.email}</div>
              <div className="text-sm">{user.phone || "—"}</div>

              <div className="mt-2 space-y-1 text-sm">
                <div>
                  <strong>Total Assigned:</strong> ৳{totalAssigned.toFixed(2)}
                </div>
                <div>
                  <strong>Total Paid:</strong> ৳{totalPaid.toFixed(2)}
                </div>
                <div
                  className={`font-bold ${
                    balance < 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  <strong>Balance:</strong> ৳{balance.toFixed(2)}
                </div>
              </div>

              <div className="mt-3">
                <strong>Assignments:</strong>
                {user.assignments?.length > 0 ? (
                  <ul className="list-disc list-inside text-sm text-gray-800">
                    {user.assignments.map((a) => (
                      <li key={a.id}>
                        {a.product.name} × {a.quantity}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-gray-400 text-sm">No assignments</div>
                )}
              </div>

              <div className="mt-3">
                <strong>Payments:</strong>
                {user.payments?.length > 0 ? (
                  <ul className="list-disc list-inside text-sm text-gray-800">
                    {user.payments.map((p) => (
                      <li key={p.id}>
                        ৳{p.amount.toFixed(2)} —{" "}
                        {new Date(p.timestamp).toLocaleDateString()}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-gray-400 text-sm">No payments</div>
                )}
              </div>

              <button
                onClick={() => {
                  setSelectedUser(user);
                  setShowPayModal(true);
                }}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded text-sm w-full"
              >
                Make Payment
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showPayModal && selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setShowPayModal(false)}
        >
          <div
            className="bg-white p-6 rounded shadow-md w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">
              Make Payment to {selectedUser.name}
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
