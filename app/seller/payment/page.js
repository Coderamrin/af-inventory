"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function MakePaymentPage() {
  const { data: session } = useSession();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const { data: assignments } = useSWR("/api/assignments", fetcher);
  const { data: payments, mutate } = useSWR(
    session?.user?.id ? `/api/payments?userId=${session.user.id}` : null,
    fetcher
  );

  if (!session || !assignments || !payments) return <p>Loading...</p>;

  const sellerEmail = session.user.email;

  const sellerAssignments = assignments.filter(
    (a) => a.user?.email === sellerEmail
  );

  const sellerPayments = payments.filter((p) => p.user?.email === sellerEmail);

  const totalOwed = sellerAssignments.reduce((sum, a) => {
    return sum + a.quantity * a.product.price;
  }, 0);

  const totalPaid = sellerPayments.reduce((sum, p) => sum + p.amount, 0);
  const remaining = totalOwed - totalPaid;

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    const res = await fetch("/api/payments", {
      method: "POST",
      body: JSON.stringify({
        userId: session.user.id,
        amount: parseFloat(amount),
      }),
    });

    const result = await res.json();

    if (res.ok) {
      setSuccess("Payment successful!");
      setAmount("");
      mutate(); // refresh payment history
    } else {
      alert("Payment failed: " + result.error);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-xl mt-10">
      <h1 className="text-2xl font-bold mb-4">Make a Payment</h1>
      <p className="mb-2 text-gray-700">
        You currently owe: <strong>৳{remaining.toFixed(2)}</strong>
      </p>

      <form onSubmit={handlePayment} className="space-y-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Payment Amount
          </label>
          <input
            type="number"
            step="0.01"
            min="1"
            max={remaining}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>

        {success && <p className="text-green-600">{success}</p>}
      </form>

      {/* Payment History Table */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Payment History</h2>
        {sellerPayments.length === 0 ? (
          <p className="text-gray-600">No payments made yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border rounded">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    #
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Amount (৳)
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sellerPayments.map((p, i) => (
                  <tr key={p.id}>
                    <td className="px-4 py-2 text-sm">{i + 1}</td>
                    <td className="px-4 py-2 text-sm font-semibold">
                      ৳{p.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {new Date(p.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
