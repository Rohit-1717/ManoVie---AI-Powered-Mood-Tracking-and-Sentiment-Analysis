import React, { useEffect, useState } from "react";
import moment from "moment";
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
import { useSentimentStore } from "../../store/useSentimentStore";

// Static weekdays for full week graph
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const TrackMood = () => {
  const { analyzeText, sentimentTrend, fetchSentimentTrend } =
    useSentimentStore();

  const [analysisData, setAnalysisData] = useState(null);
  const [lineData, setLineData] = useState([]);

  const sentimentColor = {
    positive: "success",
    neutral: "info",
    negative: "error",
  };

  const COLORS = [
    "#6366F1", // TOXICITY
    "#EC4899", // INSULT
    "#F59E0B", // PROFANITY
    "#10B981", // THREAT
    "#EF4444", // SEVERE_TOXICITY
  ];

  useEffect(() => {
    fetchSentimentTrend("week");

    const runAnalysis = async () => {
      const result = await analyzeText("I am feeling neutral and calm today.");
      if (result) setAnalysisData(result);
    };

    runAnalysis();
  }, []);

  useEffect(() => {
    const mapped = sentimentTrend.map((item) => ({
      day: moment(item.createdAt).format("ddd"),
      sentiment: item.score,
    }));

    // Fill in missing weekdays with null values
    const filled = weekDays.map((day) => {
      const found = mapped.find((d) => d.day === day);
      return {
        day,
        sentiment: found ? found.sentiment : null,
      };
    });

    setLineData(filled);
  }, [sentimentTrend]);

  const pieData = analysisData?.toxicity?.attributeScores
    ? Object.entries(analysisData.toxicity.attributeScores).map(
        ([label, score]) => ({
          name: label,
          value: +(score.summaryScore.value * 100).toFixed(2),
        })
      )
    : [];

  const sentimentScore = analysisData?.sentiment?.score ?? 0;
  const sentimentLabel = analysisData?.sentiment?.sentiment ?? "neutral";
  const detectedLanguages = analysisData?.toxicity?.detectedLanguages ?? [];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-base-content">
        🧠 Mood & Toxicity Dashboard
      </h1>

      {/* Sentiment Card */}
      <div className="card bg-base-200 shadow-md mb-6">
        <div className="card-body">
          <h2 className="card-title text-xl">📝 Sentiment Analysis</h2>
          <p className="text-base-content">
            <span className="font-semibold">Sentiment:</span>{" "}
            <span className={`badge badge-${sentimentColor[sentimentLabel]}`}>
              {sentimentLabel}
            </span>
          </p>
          <p className="text-base-content">
            <span className="font-semibold">Score:</span> {sentimentScore}
          </p>
        </div>
      </div>

      {/* Weekly Mood Graph */}
      <div className="card bg-base-200 shadow-md mb-6">
        <div className="card-body">
          <h2 className="card-title text-xl">📈 Weekly Mood Trend</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis domain={[0, 1]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sentiment"
                stroke="#6366F1"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Toxicity Attributes */}
      <div className="card bg-base-200 shadow-md mb-6">
        <div className="card-body">
          <h2 className="card-title text-xl">Toxicity Attributes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {analysisData?.toxicity?.attributeScores &&
              Object.entries(analysisData.toxicity.attributeScores).map(
                ([label, value]) => (
                  <div
                    key={label}
                    className="bg-base-100 p-4 rounded-xl shadow border border-base-300"
                  >
                    <p className="font-semibold text-sm text-base-content">
                      {label}
                    </p>
                    <progress
                      className="progress progress-secondary w-full"
                      value={(value.summaryScore.value * 100).toFixed(2)}
                      max="100"
                    ></progress>
                    <p className="text-sm text-base-content mt-1">
                      {Math.round(value.summaryScore.value * 100)}%
                    </p>
                  </div>
                )
              )}
          </div>
        </div>
      </div>

      {/* Toxicity Distribution Pie */}
      <div className="card bg-base-200 shadow-md mb-6">
        <div className="card-body">
          <h2 className="card-title text-xl">🧬 Toxicity Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Language Info */}
      <div className="card bg-base-200 shadow-md mb-6">
        <div className="card-body">
          <h2 className="card-title text-xl">🌐 Language Detection</h2>
          <p className="text-base-content">
            <span className="font-semibold">Detected Language:</span>{" "}
            <span className="badge badge-info">
              {detectedLanguages.join(", ") || "N/A"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrackMood;
