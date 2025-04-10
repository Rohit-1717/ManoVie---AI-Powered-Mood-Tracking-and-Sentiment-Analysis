// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import {
  FaPenFancy,
  FaSmile,
  FaChartBar,
  FaBookOpen,
  FaChartLine,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import { useSentimentStore } from "../../store/useSentimentStore";

function Dashboard() {
  const { user } = useAuthStore();
  const {
    sentimentTrend,
    fetchSentimentTrend,
    loading,
    fetchTotalJournals,
    totalJournals,
    fetchAverageMood,
    averageMood,
    weeklyStability,
    loadingWeeklyStability,
    fetchWeeklyStability,
  } = useSentimentStore();

  const [selectedPeriod, setSelectedPeriod] = useState("week");

  useEffect(() => {
    fetchSentimentTrend(selectedPeriod);
    fetchTotalJournals();
    fetchAverageMood();
    fetchWeeklyStability();
  }, [selectedPeriod]);

  const actions = [
    {
      icon: <FaPenFancy className="text-xl" />,
      label: "Write Journal",
      color: "primary",
      path: "/journal/write",
    },
    {
      icon: <FaSmile className="text-xl" />,
      label: "Track Mood",
      color: "accent",
      path: "/mood/track",
    },
    {
      icon: <FaChartBar className="text-xl" />,
      label: "View Report",
      color: "secondary",
      path: "/dashboard/ViewReport",
    },
  ];

  const formattedTrend = sentimentTrend.map((entry) => {
    const today = new Date();
    const date = new Date(today.getFullYear(), today.getMonth(), entry._id);
    const label = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    return {
      name: label,
      avgSentimentScore: entry.avgSentimentScore,
      avgToxicityScore: entry.avgToxicityScore,
      count: entry.count,
    };
  });

  return (
    <div className="bg-base-300 text-base-content min-h-screen">
      <div className="container mx-auto px-6 md:px-12 py-10 space-y-12">
        {/* Welcome Message */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold">
            👋 Welcome back, {user?.fullName || "Guest"}
          </h1>
          <p className="text-sm text-base-content/70">
            Your mental wellness hub
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {actions.map((action, idx) => (
            <NavLink key={idx} to={action.path} className="w-full">
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.15 }}
                className={`btn btn-${action.color} w-full justify-start gap-3 shadow-md px-6 py-4 text-base`}
              >
                {action.icon} {action.label}
              </motion.button>
            </NavLink>
          ))}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <FaBookOpen className="text-2xl" />,
              title: "Total Journals",
              value:
                totalJournals !== null && totalJournals !== undefined
                  ? totalJournals
                  : "Loading...",
            },
            {
              icon: <FaSmile className="text-2xl" />,
              title: "Average Mood",
              value: averageMood
                ? `${averageMood.emoji} ${averageMood.label}`
                : "Loading...",
            },
            {
              icon: <FaChartLine className="text-2xl text-info" />,
              title: "This Week",
              value: loadingWeeklyStability
                ? "Loading..."
                : weeklyStability?.stability || "No Data",
            },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              className="bg-base-100 p-6 rounded-2xl shadow-md flex items-center gap-4"
            >
              <div className="bg-base-200 p-3 rounded-full">{stat.icon}</div>
              <div>
                <h3 className="text-sm opacity-70">{stat.title}</h3>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mood Trend Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-base-100 p-6 rounded-2xl shadow-md space-y-4"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <h2 className="text-lg font-semibold mb-2 md:mb-0">
              📈 Mood Trend (
              {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}
              )
            </h2>
            <select
              className="select select-bordered max-w-xs"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-6">Loading chart...</div>
          ) : formattedTrend.length === 0 ? (
            <div className="text-center py-6 text-warning">
              No data available for the selected period.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={formattedTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[-1, 1]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="avgSentimentScore"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;
