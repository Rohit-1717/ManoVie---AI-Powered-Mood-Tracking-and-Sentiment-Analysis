import React from "react";
import { FaTools } from "react-icons/fa";

export function UnderConstruction() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-base-200 text-center p-4">
      <FaTools className="text-6xl text-primary mb-4" />
      <h1 className="text-3xl font-bold text-primary">
        Website Under Construction
      </h1>
      <p className="text-lg text-gray-600 mt-2">
        We're working hard to bring you something amazing. Stay tuned!
      </p>
    </div>
  );
}
