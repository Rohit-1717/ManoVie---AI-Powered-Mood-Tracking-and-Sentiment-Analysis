import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import useSentimentStore from "../../store/useSentimentStore";
import moment from "moment";

const PIE_COLORS = ["#6366F1", "#EC4899", "#F59E0B", "#10B981", "#EF4444"];
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const TrackMood = () => {
  const {
    fetchMoodHistory,
    userSentiments,
    fetchAverageMood,
    averageMood,
    fetchWeeklyStability,
    weeklyStability,
  } = useSentimentStore();

  const [lineData, setLineData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [timeRange, setTimeRange] = useState("week"); // default

  // Load all data when component mounts or timeRange changes
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        await fetchMoodHistory(timeRange);
        await fetchAverageMood();
        await fetchWeeklyStability();

        if (!mounted) return;

        // Prepare pie chart data from latest sentiment entry
        const latest = userSentiments[0];
        if (latest?.categoryScores) {
          const pie = Object.entries(latest.categoryScores).map(([key, value]) => ({
            name: key.replace('_', ' '),
            value: Number((value * 100).toFixed(2)),
            rawValue: value ?? 0,
          }));
          setPieData(pie);
        } else {
          setPieData([]);
        }
      } catch (err) {
        console.error("TrackMood loadData error:", err);
      }
    };

    loadData();
    return () => {
      mounted = false;
    };
  }, [timeRange, fetchMoodHistory, fetchAverageMood, fetchWeeklyStability]);

  // Map sentiment trend for line chart
  useEffect(() => {
    if (!userSentiments || userSentiments.length === 0) return;

    let mapped = userSentiments.map((entry) => ({
      date: entry.analyzedAt,
      sentiment: entry.sentimentScore,
    }));

    // Sort by date for proper chronological order
    mapped.sort((a, b) => new Date(a.date) - new Date(b.date));

    if (timeRange === "week") {
      mapped = mapped.map((d) => ({
        day: moment(d.date).format("ddd"),
        sentiment: d.sentiment,
      }));

      // Fill missing weekdays
      const filled = weekDays.map((day) => {
        const found = mapped.find((d) => d.day === day);
        return { day, sentiment: found ? found.sentiment : null };
      });

      setLineData(filled);
    } else if (timeRange === "month") {
      setLineData(
        mapped.map((d) => ({
          day: moment(d.date).format("MMM DD"),
          sentiment: d.sentiment,
        }))
      );
    } else if (timeRange === "year") {
      setLineData(
        mapped.map((d) => ({
          day: moment(d.date).format("MMM"),
          sentiment: d.sentiment,
        }))
      );
    }
  }, [userSentiments, timeRange]);

  // Average mood card data
  const sentimentLabel = averageMood?.label ?? "neutral";
  const sentimentScore = averageMood?.avgSentiment ?? 0;

  // Get sentiment badge color
  const getSentimentBadgeColor = (label) => {
    switch (label) {
      case 'positive': return 'badge-success';
      case 'negative': return 'badge-error';
      default: return 'badge-neutral';
    }
  };

  // Custom tooltip for line chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      return (
        <div className="bg-base-100 p-3 border border-base-300 rounded-lg shadow">
          <p className="font-semibold">{label}</p>
          <p className="text-sm">
            Sentiment: <span className={value > 0 ? 'text-success' : value < 0 ? 'text-error' : 'text-neutral'}>
              {value?.toFixed(3) || 'No data'}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Sentiment Card - Enhanced */}
      <div className="card bg-base-200 shadow-md">
        <div className="card-body">
          <h2 className="card-title text-xl">📝 Sentiment Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="stat">
              <div className="stat-title">Current Sentiment</div>
              <div className="stat-value text-lg">
                <span className={`badge ${getSentimentBadgeColor(sentimentLabel)} badge-lg`}>
                  {sentimentLabel.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">Sentiment Score</div>
              <div className={`stat-value text-lg ${sentimentScore > 0 ? 'text-success' : sentimentScore < 0 ? 'text-error' : 'text-neutral'}`}>
                {sentimentScore}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mood Trend Chart - Enhanced */}
      <div className="card bg-base-200 shadow-md">
        <div className="card-body">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <h2 className="card-title text-xl">📈 Mood Trend</h2>
            <select
              className="select select-bordered max-w-xs"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="day" 
                stroke="#9CA3AF"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                domain={[-1.1, 1.1]} 
                stroke="#9CA3AF"
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="sentiment"
                stroke="#4f46e5"
                strokeWidth={3}
                dot={{ r: 5, fill: "#4f46e5" }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Toxicity Attributes - Enhanced */}
      <div className="card bg-base-200 shadow-md">
        <div className="card-body">
          <h2 className="card-title text-xl">☣️ Toxicity Attributes</h2>
          {pieData.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {pieData.map((item, index) => (
                <div
                  key={item.name}
                  className="bg-base-100 p-4 rounded-xl shadow border border-base-300 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-sm uppercase tracking-wide">
                      {item.name}
                    </p>
                    <span className="text-xs text-base-content/60">
                      {item.value}%
                    </span>
                  </div>
                  <progress
                    className={`progress w-full h-3 ${
                      item.value > 50 ? 'progress-error' : 
                      item.value > 25 ? 'progress-warning' : 'progress-success'
                    }`}
                    value={item.value}
                    max="100"
                  />
                  <p className="text-xs text-base-content/60 mt-1">
                    Raw: {item.rawValue.toFixed(4)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-base-content/60">
              <div className="loading loading-spinner loading-md mb-2"></div>
              <p>Loading toxicity data...</p>
            </div>
          )}
        </div>
      </div>

      {/* Toxicity Pie Chart - Enhanced */}
      <div className="card bg-base-200 shadow-md">
        <div className="card-body">
          <h2 className="card-title text-xl">🧬 Toxicity Distribution</h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  innerRadius={40}
                  paddingAngle={2}
                  label={({name, value}) => `${name}: ${value}%`}
                  labelLine={false}
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value}%`, name]}
                  contentStyle={{ 
                    backgroundColor: 'var(--fallback-b1,oklch(var(--b1)))',
                    border: '1px solid var(--fallback-bc,oklch(var(--bc)))',
                    borderRadius: '0.5rem'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-base-content/60">
              <div className="loading loading-spinner loading-md mb-2"></div>
              <p>Loading toxicity distribution...</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Analysis Summary - New Addition */}
      {userSentiments && userSentiments.length > 0 && (
        <div className="card bg-base-200 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-xl">📋 Recent Analysis</h2>
            <div className="space-y-3 mt-4">
              {userSentiments.slice(0, 2).map((entry, index) => (
                <div key={index} className="bg-base-100 p-4 rounded-lg border border-base-300">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`badge ${getSentimentBadgeColor(entry.sentiment)}`}>
                      {entry.sentiment}
                    </span>
                    <span className="text-xs text-base-content/60">
                      {moment(entry.analyzedAt).fromNow()}
                    </span>
                  </div>
                  <p className="text-sm text-base-content/80 line-clamp-2">
                    {entry.text?.substring(0, 120)}...
                  </p>
                  <div className="mt-2 flex justify-between text-xs text-base-content/60">
                    <span>Score: {entry.sentimentScore.toFixed(3)}</span>
                    <span>Toxicity: {(entry.toxicityScore * 100).toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackMood;