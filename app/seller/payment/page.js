"use client";

import { useSession } from "next-auth/react";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function MakePaymentPage() {
  const { data: session } = useSession();

  const { data: assignments } = useSWR("/api/assignments", fetcher);
  const { data: payments } = useSWR(
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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-xl mt-10">
      <h1 className="text-2xl font-bold mb-4">Make a Payment</h1>
      <p className="mb-2 text-gray-700">
        You currently owe: <strong>৳{remaining.toFixed(2)}</strong>
      </p>

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
