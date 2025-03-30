import React from "react";
import { FaWifi } from "react-icons/fa";
export function Offline() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-base-200 text-center p-4">
      <FaWifi className="text-6xl text-red-500 mb-4" />
      <h1 className="text-3xl font-bold text-red-500">You Are Offline</h1>
      <p className="text-lg text-gray-600 mt-2">
        Check your internet connection and try again.
      </p>
    </div>
  );
}
