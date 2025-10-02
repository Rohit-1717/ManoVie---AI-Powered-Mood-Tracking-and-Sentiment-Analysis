import { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import useAuthStore from "../../store/useAuthStore";
import useSentimentStore from "../../store/useSentimentStore";
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
  BarChart,
  Bar,
} from "recharts";
import moment from "moment";

// Progress bar colors for toxicity attributes
const PROGRESS_COLORS = ["#4f46e5", "#ec4899", "#f59e0b", "#10b981", "#ef4444"];
const PIE_COLORS = ["#6366F1", "#EC4899", "#F59E0B", "#10B981", "#EF4444"];

const ViewReport = () => {
  const reportRef = useRef();
  const { user } = useAuthStore();
  const { fetchMoodHistory, userSentiments, fetchAverageMood, averageMood } =
    useSentimentStore();

  const [loading, setLoading] = useState(true);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [reportData, setReportData] = useState({
    weekly: [],
    monthly: [],
    yearly: [],
    toxicityData: [],
    sentimentDistribution: [],
    recentEntries: [],
  });

  // Calculate comprehensive analytics from mood history
  const calculateAnalytics = (sentiments) => {
    if (!sentiments || sentiments.length === 0) return null;

    // Sort by date
    const sorted = [...sentiments].sort(
      (a, b) => new Date(a.analyzedAt) - new Date(b.analyzedAt)
    );

    // Calculate averages
    const totalSentiment = sorted.reduce(
      (sum, item) => sum + item.sentimentScore,
      0
    );
    const totalToxicity = sorted.reduce(
      (sum, item) => sum + item.toxicityScore,
      0
    );
    const avgSentiment = totalSentiment / sorted.length;
    const avgToxicity = totalToxicity / sorted.length;

    // Sentiment distribution
    const positive = sorted.filter((item) => item.sentimentScore > 0.1).length;
    const negative = sorted.filter((item) => item.sentimentScore < -0.1).length;
    const neutral = sorted.length - positive - negative;

    // Get latest toxicity breakdown
    const latestWithToxicity = sorted.find((item) => item.categoryScores);
    const toxicityBreakdown = latestWithToxicity
      ? Object.entries(latestWithToxicity.categoryScores).map(
          ([key, value]) => ({
            name: key.replace("_", " "),
            value: Number((value * 100).toFixed(2)),
            rawValue: value,
          })
        )
      : [];

    // Weekly trend (last 7 entries or available data)
    const weeklyData = sorted.slice(-7).map((item) => ({
      date: moment(item.analyzedAt).format("MMM DD"),
      sentiment: item.sentimentScore,
      toxicity: item.toxicityScore,
    }));

    // Monthly aggregation
    const monthlyMap = {};
    sorted.forEach((item) => {
      const month = moment(item.analyzedAt).format("MMM YYYY");
      if (!monthlyMap[month]) {
        monthlyMap[month] = { total: 0, count: 0, toxicity: 0 };
      }
      monthlyMap[month].total += item.sentimentScore;
      monthlyMap[month].toxicity += item.toxicityScore;
      monthlyMap[month].count++;
    });

    const monthlyData = Object.entries(monthlyMap).map(([month, data]) => ({
      date: month,
      sentiment: data.total / data.count,
      toxicity: data.toxicity / data.count,
    }));

    return {
      summary: {
        totalEntries: sorted.length,
        avgSentiment,
        avgToxicity,
        sentimentLabel:
          avgSentiment > 0.1
            ? "positive"
            : avgSentiment < -0.1
            ? "negative"
            : "neutral",
      },
      distribution: [
        { name: "Positive", value: positive, color: "#10B981" },
        { name: "Neutral", value: neutral, color: "#6B7280" },
        { name: "Negative", value: negative, color: "#EF4444" },
      ],
      toxicityBreakdown,
      trends: {
        weekly: weeklyData,
        monthly: monthlyData,
      },
      recentEntries: sorted.slice(-3),
    };
  };

  useEffect(() => {
    let mounted = true;

    const initData = async () => {
      setLoading(true);
      try {
        // Fetch all mood history data
        const [weekData, monthData, yearData] = await Promise.all([
          fetchMoodHistory("week"),
          fetchMoodHistory("month"),
          fetchMoodHistory("year"),
        ]);

        await fetchAverageMood();

        if (!mounted) return;

        // Use the most comprehensive dataset (usually year or month)
        const mainDataset =
          yearData.length > 0
            ? yearData
            : monthData.length > 0
            ? monthData
            : weekData;

        const analytics = calculateAnalytics(mainDataset);

        if (analytics) {
          setReportData({
            weekly: analytics.trends.weekly,
            monthly: analytics.trends.monthly,
            yearly: analytics.trends.monthly, // Using monthly for yearly view
            toxicityData: analytics.toxicityBreakdown,
            sentimentDistribution: analytics.distribution,
            recentEntries: analytics.recentEntries,
            summary: analytics.summary,
          });
        }
      } catch (err) {
        console.error("Error initializing report data:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initData();

    return () => {
      mounted = false;
    };
  }, [fetchMoodHistory, fetchAverageMood]);

  // Enhanced PDF generator
  const generatePdf = async () => {
    if (!reportRef.current) {
      alert("Report content not found!");
      return;
    }

    setPdfGenerating(true);

    try {
      console.log("Starting PDF generation...");

      const canvas = await html2canvas(reportRef.current, {
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: reportRef.current.scrollWidth,
        height: reportRef.current.scrollHeight,
        onclone: (clonedDoc) => {
          const allElements = clonedDoc.querySelectorAll("*");

          allElements.forEach((el) => {
            const computedStyle = window.getComputedStyle(el);

            // Normalize background
            if (computedStyle.backgroundColor?.includes("oklch")) {
              el.style.backgroundColor = "#ffffff";
            }

            // Normalize text color
            if (computedStyle.color?.includes("oklch")) {
              el.style.color = "#000000";
            }

            // Normalize border colors
            if (computedStyle.borderColor?.includes("oklch")) {
              el.style.borderColor = "#e5e7eb";
            }
          });

          // Force root to be white
          const pdfContent = clonedDoc.querySelector("[data-pdf-content]");
          if (pdfContent) {
            pdfContent.style.backgroundColor = "#ffffff";
            pdfContent.style.color = "#000000";
          }
        },
      });

      const imgData = canvas.toDataURL("image/png", 0.9);
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      if (imgHeight <= pdfHeight) {
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      } else {
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pdfHeight;
        }
      }

      const fileName = `manovie_mental_health_report_${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      pdf.save(fileName);

      console.log("PDF downloaded successfully");
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert(`Failed to generate PDF: ${error.message}`);
    } finally {
      setPdfGenerating(false);
    }
  };

  const noData = !userSentiments || userSentiments.length === 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="bg-white p-3 border border-gray-300 rounded-lg shadow"
          style={{ backgroundColor: "#ffffff", color: "#000000" }}
        >
          <p className="font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value?.toFixed(3)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-base-content">
          📄 Mental Health Report
        </h1>
        <button
          className={`btn btn-primary ${pdfGenerating ? "loading" : ""}`}
          onClick={generatePdf}
          disabled={loading || pdfGenerating || noData}
        >
          {pdfGenerating ? "Generating..." : "📥 Download PDF"}
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="text-lg text-base-content/70">
            Loading your mental health report...
          </p>
        </div>
      ) : noData ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 px-4">
          <p className="text-xl font-semibold text-base-content">
            No mood or sentiment data available.
          </p>
          <p className="text-base text-base-content/70">
            Start by writing a journal entry to generate your mental health
            report.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => (window.location.href = "/journal/write")}
          >
            📝 Write Journal
          </button>
        </div>
      ) : (
        <div
          ref={reportRef}
          data-pdf-content
          className="bg-white text-black p-6 rounded-xl shadow space-y-8"
          style={{
            backgroundColor: "#ffffff",
            color: "#000000",
          }}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-300 pb-4 gap-4">
            <div className="flex gap-4 items-center">
              <div className="w-18 h-18 rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  src="/ManoVie.svg" // 🔹 Replace with your logo path
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h2 className="text-xl font-bold text-black">
                  ManoVie Mental Health Report
                </h2>
                <p className="text-xs text-gray-600">
                  Comprehensive Mental Wellness Analysis
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {user?.avatar && (
                <img
                  src={user.avatar}
                  alt="User Avatar"
                  className="w-14 h-14 rounded-full object-cover border-2 border-purple-500"
                />
              )}
              <div className="text-sm text-right">
                <p className="font-semibold text-black">
                  {user?.fullName || "User"}
                </p>
                <p className="text-gray-600">{user?.email}</p>
                <p className="text-xs text-gray-500">
                  {moment().format("MMMM DD, YYYY")}
                </p>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-black">
              📊 Executive Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                className="bg-gray-100 p-4 rounded-xl text-center shadow"
                style={{ backgroundColor: "#f8fafc" }}
              >
                <p className="text-sm font-semibold text-black">
                  Total Entries
                </p>
                <p className="text-2xl font-bold text-black">
                  {reportData.summary?.totalEntries || 0}
                </p>
              </div>
              <div
                className="bg-gray-100 p-4 rounded-xl text-center shadow"
                style={{ backgroundColor: "#f8fafc" }}
              >
                <p className="text-sm font-semibold text-black">
                  Overall Sentiment
                </p>
                <p className="text-lg font-bold capitalize text-black">
                  {reportData.summary?.sentimentLabel || "N/A"}
                </p>
              </div>
              <div
                className="bg-gray-100 p-4 rounded-xl text-center shadow"
                style={{ backgroundColor: "#f8fafc" }}
              >
                <p className="text-sm font-semibold text-black">Avg Score</p>
                <p className="text-2xl font-bold text-black">
                  {reportData.summary?.avgSentiment
                    ? reportData.summary.avgSentiment.toFixed(3)
                    : "N/A"}
                </p>
              </div>
              <div
                className="bg-gray-100 p-4 rounded-xl text-center shadow"
                style={{ backgroundColor: "#f8fafc" }}
              >
                <p className="text-sm font-semibold text-black">Avg Toxicity</p>
                <p className="text-2xl font-bold text-black">
                  {reportData.summary?.avgToxicity
                    ? (reportData.summary.avgToxicity * 100).toFixed(1) + "%"
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Sentiment Distribution */}
          {reportData.sentimentDistribution.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-black">
                📈 Sentiment Distribution
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={reportData.sentimentDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {reportData.sentimentDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        color: "#000000",
                        border: "1px solid #e5e7eb",
                        borderRadius: "0.5rem",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={reportData.sentimentDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#000000" />
                    <YAxis stroke="#000000" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" fill="#4f46e5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Weekly Trend */}
          {reportData.weekly.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-black">
                📊 Recent Mood Trend
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={reportData.weekly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#000000" />
                  <YAxis domain={[-1, 1]} stroke="#000000" />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="sentiment"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Sentiment"
                  />
                  <Line
                    type="monotone"
                    dataKey="toxicity"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Toxicity"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Monthly Overview */}
          {reportData.monthly.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-black">
                📅 Monthly Overview
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={reportData.monthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#000000" />
                  <YAxis domain={[-1, 1]} stroke="#000000" />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="sentiment"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Toxicity Analysis */}
          {reportData.toxicityData.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-black">
                ⚠️ Toxicity Analysis
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid grid-cols-2 gap-3">
                  {reportData.toxicityData.map((item, index) => (
                    <div
                      key={item.name}
                      className="bg-gray-100 p-3 rounded-xl shadow"
                      style={{ backgroundColor: "#f8fafc" }}
                    >
                      <p className="text-xs font-semibold text-black uppercase">
                        {item.name}
                      </p>
                      <div
                        className="w-full bg-gray-300 rounded-full h-2 mt-2"
                        style={{ backgroundColor: "#e2e8f0" }}
                      >
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${item.value}%`,
                            backgroundColor:
                              PROGRESS_COLORS[index % PROGRESS_COLORS.length],
                          }}
                        />
                      </div>
                      <p className="text-sm mt-1 text-black">{item.value}%</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-xs text-center text-gray-600 border-t border-gray-300 pt-4 mt-6">
            <p>Generated by ManoVie Mental Health Platform</p>
            <p>
              Confidential Mental Health Report | © {new Date().getFullYear()}
            </p>
            <p className="mt-1">
              For support: contact@manovie.com | Emergency: Your local crisis
              helpline
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewReport;
