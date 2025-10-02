// src/components/DemoCredentials.jsx
import { useState } from "react";
import { FaCopy, FaChevronDown, FaChevronUp } from "react-icons/fa";

function DemoCredentials() {
  const [open, setOpen] = useState(false);
  const [copiedField, setCopiedField] = useState("");

  // Get credentials from environment variables
  const demoUsername = import.meta.env.VITE_DEMO_USERNAME || "demoExample";
  const demoPassword = import.meta.env.VITE_DEMO_PASSWORD || "Demo@123";

  const handleCopy = async (value, field) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      setTimeout(() => setCopiedField(""), 1500);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mb-4">
      <div className="card bg-base-100 shadow-md border border-base-300">
        <button
          className="flex justify-between items-center p-3 w-full font-medium text-sm sm:text-base"
          onClick={() => setOpen(!open)}
        >
          <span>Try Demo Account</span>
          {open ? <FaChevronUp /> : <FaChevronDown />}
        </button>

        {open && (
          <div className="p-3 border-t border-base-300 space-y-2">
            {/* Username */}
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-base-content mb-1">
                Username
              </span>
              <div className="flex justify-between items-center bg-base-200 p-2 rounded-md">
                <span className="truncate">{demoUsername}</span>
                <button
                  className="btn btn-xs btn-outline ml-2 flex items-center gap-1"
                  onClick={() => handleCopy(demoUsername, "email")}
                >
                  <FaCopy size={12} />
                  {copiedField === "email" && (
                    <span className="ml-1 text-xs text-green-500">Copied</span>
                  )}
                </button>
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-base-content mb-1">
                Password
              </span>
              <div className="flex justify-between items-center bg-base-200 p-2 rounded-md">
                <span className="truncate">{demoPassword}</span>
                <button
                  className="btn btn-xs btn-outline ml-2 flex items-center gap-1"
                  onClick={() => handleCopy(demoPassword, "password")}
                >
                  <FaCopy size={12} />
                  {copiedField === "password" && (
                    <span className="ml-1 text-xs text-green-500">Copied</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DemoCredentials;
