import React, { useEffect } from "react";
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
import dayjs from "dayjs";
import ManovieAI from "../../components/manovieAi/ManoVieAi.jsx"; // Import the AI component

function Dashboard() {
  const user = useAuthStore((state) => state.user);

  const {
    sentimentTrend,
    totalJournals,
    averageMood,
    weeklyStability,
    fetchSentimentTrend,
    fetchTotalJournals,
    fetchAverageMood,
    fetchWeeklyStability,
  } = useSentimentStore();

  // Fetch all data on mount
  useEffect(() => {
    const fetchAllData = async () => {
      await fetchTotalJournals();
      await fetchAverageMood();
      await fetchWeeklyStability();
      await fetchSentimentTrend("week");
    };
    fetchAllData();
  }, []);

  // Random peaceful messages
  const welcomeMessages = [
    (name) => `Welcome back, ${name}. Take a deep breath.`,
    (name) => `A calm day awaits you, ${name}.`,
    (name) => `Hello, ${name}. Your peaceful space is here.`,
    (name) => `Gentle moments for you today, ${name}.`,
    (name) => `Relax, ${name}. You’re in your safe space.`,
    (name) => `Hello, ${name}. Let’s nurture your mind today.`,
    (name) => `Welcome, ${name}. A mindful moment just for you.`,
    (name) => `Peace and calm, ${name}. Let’s begin.`,
  ];

  const userName = user?.fullName || user?.username || "Friend";
  const randomMessage =
    welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)](
      userName
    );

  // Action buttons
  const actions = [
    { icon: <FaPenFancy className="text-xl" />, label: "Write Journal", color: "primary", path: "/journal/write" },
    { icon: <FaSmile className="text-xl" />, label: "Track Mood", color: "accent", path: "/mood/track" },
    { icon: <FaChartBar className="text-xl" />, label: "View Report", color: "secondary", path: "/dashboard/ViewReport" },
  ];

  return (
    <div className="bg-base-300 text-base-content min-h-screen">
      <div className="container mx-auto px-6 md:px-12 py-10 space-y-12">
        {/* Welcome Message */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold">{randomMessage}</h1>
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
          {/* Total Journals */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0 }} className="bg-base-100 p-6 rounded-2xl shadow-md flex items-center gap-4">
            <div className="bg-base-200 p-3 rounded-full"><FaBookOpen className="text-2xl" /></div>
            <div><h3 className="text-sm opacity-70">Total Journals</h3><p className="text-xl font-bold">{totalJournals ?? 0}</p></div>
          </motion.div>

          {/* Average Mood */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="bg-base-100 p-6 rounded-2xl shadow-md flex items-center gap-4">
            <div className="bg-base-200 p-3 rounded-full"><FaSmile className="text-2xl" /></div>
            <div><h3 className="text-sm opacity-70">Average Mood</h3>
            <p className="text-xl font-bold">{averageMood?.label ? `${averageMood.emoji} ${averageMood.label}` : "N/A"}</p></div>
          </motion.div>

          {/* Weekly Stability */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-base-100 p-6 rounded-2xl shadow-md flex items-center gap-4">
            <div className="bg-base-200 p-3 rounded-full"><FaChartLine className="text-2xl text-info" /></div>
            <div><h3 className="text-sm opacity-70">This Week</h3>
            <p className="text-xl font-bold">{weeklyStability?.stability || "N/A"}</p></div>
          </motion.div>
        </div>

        {/* Mood Trend Chart */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.3 }} className="bg-base-100 p-6 rounded-2xl shadow-md space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <h2 className="text-lg font-semibold mb-2 md:mb-0">📈 Mood Trend (Week)</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sentimentTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(str) => dayjs(str).format("ddd")} />
              <YAxis domain={[-1, 1]} />
              <Tooltip />
              <Line type="monotone" dataKey="avgSentiment" stroke="#4f46e5" strokeWidth={2} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Import the AI Component */}
      <ManovieAI />
    </div>
  );
}

export default Dashboard;
