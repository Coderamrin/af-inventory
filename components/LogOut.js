"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      className="mt-auto py-2 bg-purple-700 hover:bg-purple-800 cursor-pointer text-white rounded-md w-full"
      onClick={() =>
        signOut({
          callbackUrl: "/", // Redirect to home or login page after logout
        })
      }
    >
      Logout
    </button>
  );
}
