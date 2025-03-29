import React from "react";
import {
  FaSignInAlt,
  FaRegSmile,
  FaBrain,
  FaChartLine,
  FaBell,
  FaCloudUploadAlt,
  FaLightbulb,
  FaUsers,
  FaRobot,
  FaMicrophone,
  FaFileAlt,
  FaUserLock,
  FaSmile,
  FaCloud,
} from "react-icons/fa";
import { motion } from "framer-motion";

function Features() {
  return (
    <div className="bg-base-300 text-base-content">
      <div className="container mx-auto px-8 md:px-16 lg:px-20 py-10">
        <h1 className="text-5xl font-bold text-primary mb-10">Features</h1>

        {/* Features Timeline */}
        <div className="relative border-l-4 border-primary pl-8 space-y-10">
          {[
            {
              icon: (
                <FaUserLock className="text-4xl lg:text-2xl text-primary" />
              ),
              title: "User Authentication",
              desc: "Secure login/signup with JWT authentication.",
            },
            {
              icon: (
                <FaSmile className="text-4xl lg:text-2xl text-yellow-500" />
              ),
              title: "Mood Tracking",
              desc: "Users can log emotions, write journal entries, and track patterns.",
            },
            {
              icon: (
                <FaChartLine className="text-4xl lg:text-2xl text-blue-500" />
              ),
              title: "Mood Data Visualization",
              desc: "Displays mood trends over time using interactive charts.",
            },
            {
              icon: <FaBell className="text-4xl lg:text-2xl text-red-500" />,
              title: "Reminders & Notifications",
              desc: "Custom reminders for mood logging.",
            },
            {
              icon: <FaCloud className="text-4xl lg:text-2xl text-green-500" />,
              title: "Secure Cloud Storage",
              desc: "Option to store mood-related images or voice notes.",
            },
            {
              icon: (
                <FaLightbulb className="text-4xl lg:text-2xl text-purple-500" />
              ),
              title: "Personalized Insights",
              desc: "AI-driven mood insights to help users understand emotional patterns.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="flex items-start gap-4"
            >
              {feature.icon}
              <div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Future Enhancements Grid */}
        <h2 className="text-4xl font-bold text-primary mt-16 mb-8">
          Future Enhancements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <FaUsers className="text-5xl text-primary" />,
              title: "Community Support Features",
              desc: "Allow users to share moods with trusted individuals.",
            },
            {
              icon: <FaRobot className="text-5xl text-blue-500" />,
              title: "AI Chatbot Integration",
              desc: "Provide mental health tips based on user mood.",
            },
            {
              icon: <FaMicrophone className="text-5xl text-yellow-500" />,
              title: "Voice Note Analysis",
              desc: "Analyze emotions from voice recordings.",
            },
            {
              icon: <FaBrain className="text-5xl text-green-500" />,
              title: "Mood Prediction & AI Insights",
              desc: "Implement a mood prediction model and provide AI-generated recommendations.",
            },
            {
              icon: <FaFileAlt className="text-5xl text-red-500" />,
              title: "Detailed Mood Reports",
              desc: "Provide users with comprehensive reports on mood trends to assist in treatment.",
            },
            {
              icon: <FaLightbulb className="text-5xl text-purple-500" />,
              title: "Best Recommendations",
              desc: "Offer personalized recommendations based on mood trends.",
            },
          ].map((enhancement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-base-100 shadow-xl p-6 rounded-md flex items-center gap-4"
            >
              {enhancement.icon}
              <div>
                <h3 className="text-xl font-semibold">{enhancement.title}</h3>
                <p className="text-gray-600">{enhancement.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Features;
