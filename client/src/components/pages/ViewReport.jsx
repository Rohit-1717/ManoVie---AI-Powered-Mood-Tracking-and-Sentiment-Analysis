import React, { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import useAuthStore from "../../store/useAuthStore";
import { useSentimentStore } from "../../store/useSentimentStore";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#6366F1", "#EC4899", "#F59E0B", "#10B981", "#EF4444"];

const ViewReport = () => {
  const reportRef = useRef();
  const { user } = useAuthStore();
  const {
    fetchSentimentTrend,
    sentimentTrend,
    fetchAverageMood,
    averageMood,
    fetchWeeklyStability,
    weeklyStability,
    analyzeText,
  } = useSentimentStore();

  const [loading, setLoading] = useState(true);
  const [weekly, setWeekly] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [yearly, setYearly] = useState([]);
  const [analysisData, setAnalysisData] = useState(null);

  useEffect(() => {
    const initData = async () => {
      await fetchSentimentTrend("week");
      setWeekly(
        sentimentTrend.map((entry) => ({
          ...entry,
          date: new Date(entry.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          }),
        }))
      );

      await fetchSentimentTrend("month");
      setMonthly(
        sentimentTrend.map((entry) => ({
          ...entry,
          date: new Date(entry.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          }),
        }))
      );

      await fetchSentimentTrend("year");
      setYearly(
        sentimentTrend.map((entry) => ({
          ...entry,
          date: new Date(entry.createdAt).toLocaleDateString("en-IN", {
            month: "short",
            year: "numeric",
          }),
        }))
      );

      await fetchAverageMood();
      await fetchWeeklyStability();
      const result = await analyzeText("I feel calm and happy today.");
      setAnalysisData(result);

      // Delay to ensure rendering
      setTimeout(() => setLoading(false), 500);
    };
    initData();
  }, []);

  const generatePdf = async () => {
    const input = reportRef.current;
    if (!input) return;

    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("manovie_health_report.pdf");
  };

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-base-content">
          📄 Mental Health Report
        </h1>
        <button
          className="btn btn-primary"
          onClick={generatePdf}
          disabled={loading}
        >
          📥 Download PDF
        </button>
      </div>

      <div
        ref={reportRef}
        className="bg-white p-6 rounded-xl shadow space-y-8 text-black"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 gap-4">
          <div className="flex gap-4 items-center">
            <img src="/PDF_IMG_ManoVie.png" alt="Logo" className="h-12" />
            <div>
              <h2 className="text-xl font-bold text-base-content">
                ManoVie Mental Health Report
              </h2>
              <p className="text-xs text-gray-500">
                Electronically generated and confidential.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user?.avatar && (
              <img
                src={user.avatar}
                alt="User Avatar"
                className="w-14 h-14 rounded-full object-cover border-2 border-primary"
              />
            )}
            <div className="text-sm text-right">
              <p className="font-semibold text-base-content">
                {user?.fullName}
              </p>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Sentiment Summary */}
        <div>
          <h3 className="text-lg font-semibold mb-2">📝 Sentiment Analysis</h3>
          <div className="flex flex-wrap gap-4">
            <div className="bg-base-200 p-4 rounded-xl w-40 text-center shadow">
              <p className="text-sm font-semibold">Sentiment</p>
              <p className="text-lg font-bold capitalize">
                {analysisData?.sentiment?.sentiment ?? "N/A"}
              </p>
            </div>
            <div className="bg-base-200 p-4 rounded-xl w-40 text-center shadow">
              <p className="text-sm font-semibold">Score</p>
              <p className="text-lg font-bold">
                {analysisData?.sentiment?.score?.toFixed(2) ?? "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Mood Trend Charts */}
        {[["Weekly", weekly], ["Monthly", monthly], ["Yearly", yearly]].map(
          ([label, data], idx) => (
            <div key={idx}>
              <h3 className="text-lg font-semibold mb-2">
                📊 {label} Mood Trend
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[-1, 1]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="avgSentimentScore"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )
        )}

        {/* Toxicity Attributes */}
        {analysisData?.toxicity?.attributeScores && (
          <div>
            <h3 className="text-lg font-semibold mb-2">
              ☣️ Toxicity Attributes
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {Object.entries(analysisData.toxicity.attributeScores).map(
                ([label, value]) => (
                  <div
                    key={label}
                    className="bg-base-200 p-4 rounded-xl shadow"
                  >
                    <p className="text-sm font-semibold">{label}</p>
                    <progress
                      className="progress progress-secondary w-full"
                      value={(value.summaryScore.value * 100).toFixed(2)}
                      max="100"
                    ></progress>
                    <p className="text-sm mt-1">
                      {(value.summaryScore.value * 100).toFixed(2)}%
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Toxicity Pie */}
        {analysisData?.toxicity?.attributeScores && (
          <div>
            <h3 className="text-lg font-semibold mb-2">
              🧬 Toxicity Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={Object.entries(
                    analysisData.toxicity.attributeScores
                  ).map(([label, score]) => ({
                    name: label,
                    value: +(score.summaryScore.value * 100).toFixed(2),
                  }))}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {Object.entries(
                    analysisData.toxicity.attributeScores
                  ).map((_, index) => (
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
        )}

        {/* Footer */}
        <div className="text-xs text-center text-gray-500 border-t pt-4 mt-6">
          Generated by ManoVie | Confidential Mental Health Report | ©{" "}
          {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
};

export default ViewReport;
