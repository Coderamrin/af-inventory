"use client";

import getDate from "@/lib/getDate";
import { useSession } from "next-auth/react";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function SellerDashboard() {
  const { data: session } = useSession();

  const { data: assignments } = useSWR("/api/assignments", fetcher);
  const { data: payments } = useSWR(
    session?.user?.id ? `/api/payments?userId=${session.user.id}` : null,
    fetcher
  );

  if (!session || !assignments || !payments)
    return <p className="p-6">Loading...</p>;

  const sellerEmail = session.user?.email;

  const sellerAssignments = assignments.filter(
    (a) => a.user?.email === sellerEmail
  );

  const sellerPayments = payments.filter((p) => p.user?.email === sellerEmail);

  const totalAssigned = sellerAssignments.length;
  const totalPaidMoney = sellerPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalOwedMoney =
    sellerAssignments.reduce((sum, a) => {
      return sum + a.quantity * a.product.price;
    }, 0) - totalPaidMoney;

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Seller Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <div className="bg-indigo-100 p-5 rounded-xl shadow">
          <h3 className="text-base font-semibold">Total Assignments</h3>
          <p className="text-2xl font-bold">{totalAssigned}</p>
        </div>
        <div className="bg-green-100 p-5 rounded-xl shadow">
          <h3 className="text-base font-semibold">Total Paid</h3>
          <p className="text-2xl font-bold">৳{totalPaidMoney.toFixed(2)}</p>
        </div>
        <div className="bg-red-100 p-5 rounded-xl shadow">
          <h3 className="text-base font-semibold">Total Owed</h3>
          <p className="text-2xl font-bold">৳{totalOwedMoney.toFixed(2)}</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Assignment Details</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border text-left">Product</th>
                <th className="p-2 border text-left">Quantity</th>
                <th className="p-2 border text-left">Total Price</th>
                <th className="p-2 border text-left">Assignment Date</th>
              </tr>
            </thead>
            <tbody>
              {sellerAssignments.map((assignment) => {
                const totalPrice =
                  assignment.quantity * assignment.product.price;

                return (
                  <tr key={assignment.id} className="even:bg-gray-50">
                    <td className="p-2 border">{assignment.product.name}</td>
                    <td className="p-2 border">{assignment.quantity}</td>
                    <td className="p-2 border">৳{totalPrice.toFixed(2)}</td>
                    <td className="p-2 border">
                      {getDate(assignment.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
