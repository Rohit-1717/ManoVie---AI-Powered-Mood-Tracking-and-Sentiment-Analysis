import React from "react";
import {
  FaBrain,
  FaRobot,
  FaRegSmile,
  FaMicrophone,
  FaDatabase,
  FaChartPie,
  FaCog,
  FaShieldAlt,
  FaLightbulb,
  FaUserMd,
  FaUsers,
  FaClipboardCheck,
  FaLinkedin,
} from "react-icons/fa";
import { motion } from "framer-motion";

function About() {
  const developers = [
    {
      name: "Rohit Vishwakarma",
      role: "Software Engineer",
      image:
        "https://media.licdn.com/dms/image/v2/D4D03AQGCMukwodjAGg/profile-displayphoto-shrink_800_800/B4DZQyxrZ6HUAc-/0/1736018672518?e=1749081600&v=beta&t=yqzZA0G4nnUTrNaAw6vjd4Vmh8CDsfnYxNjQueD_2NQ",
      linkedin: "https://www.linkedin.com/in/rohit-vishwakarma-aa2522293/",
      bio: "Building scalable and intelligent web solutions with MERN stack. Passionate about AI integration, seamless user experiences, and driving innovation in tech.",
    },
    {
      name: "Ayushi Singh",
      role: "Research & Development Engineer",
      image:
        "https://res.cloudinary.com/rohitcloudinary/image/upload/v1743445863/rlxd13x3u8ngq7hgmiwz.png",
      linkedin: "https://www.linkedin.com/in/ayushi-singh-3708b725b/",
      bio: "Focused on research and development, bringing innovation to AI-driven solutions. Passionate about exploring new technologies and enhancing user experiences through data-driven insights.",
    },
  ];

  return (
    <div className="bg-base-300 text-base-content">
      <div className="container mx-auto px-8 md:px-16 lg:px-20 py-10">
        {/* About Section */}
        <h1 className="text-5xl font-bold text-zinc-600">About ManoVie</h1>
        <div className="flex items-center justify-between w-full flex-col lg:flex-row">
          <p className="mt-4 text-justify lg:pr-10">
            ManoVie is an AI-powered mental well-being platform designed to help
            users track their emotions, analyze sentiments, and gain valuable
            insights into their mental health. By leveraging advanced sentiment
            analysis and AI-driven insights, ManoVie provides a personalized
            mood tracking experience that helps individuals understand their
            emotions better. With a simple and intuitive interface, users can
            log their thoughts, receive real-time sentiment analysis, and
            visualize their mental health trends over time. ManoVie empowers
            individuals to take proactive steps toward improving their
            well-being with data-driven recommendations and insights.
          </p>
          <img
            className="w-96 h-auto lg:w-xl lg:h-auto mt-5 rounded-xl lg:mt-0"
            src="./About_Image.png"
            alt="ManoVie"
          />
        </div>
      </div>

      {/* Our Mission & Vision Section */}
      <div className="bg-base-300 py-10">
        <div className="container mx-auto px-8 md:px-16 lg:px-20">
          <h2 className="text-5xl font-bold text-zinc-600 mb-6">Our Mission</h2>
          <p className="text-lg text-justify">
            "To empower individuals to take control of their mental well-being
            by providing AI-driven insights, mood tracking, and emotional
            analysis, fostering a healthier lifestyle."
          </p>
          <h2 className="text-5xl font-bold text-zinc-600 mt-10 mb-6">
            Our Vision
          </h2>
          <p className="text-lg text-justify">
            "We envision a world where mental health tracking is as common as
            physical fitness tracking, helping individuals and professionals
            make data-driven, informed decisions for overall well-being."
          </p>
        </div>
      </div>

      {/* Why Choose ManoVie Section */}
      <div className="bg-base-300 py-16">
        <div className="container mx-auto px-8 md:px-16 lg:px-20">
          <h2 className="text-5xl font-bold text-zinc-600 mb-10">
            Why Choose ManoVie?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                icon: <FaRegSmile className="text-6xl text-pink-500" />,
                title: "For Users",
                desc: "Track mood patterns, get AI insights, and receive personalized mental health suggestions.",
              },
              {
                icon: <FaUserMd className="text-6xl text-blue-500" />,
                title: "For Doctors",
                desc: "Gain deeper insights into patients' emotional well-being through AI-generated reports.",
              },
              {
                icon: <FaClipboardCheck className="text-6xl text-green-500" />,
                title: "For Consultants",
                desc: "Assist clients effectively with data-driven sentiment analysis and trend tracking.",
              },
              {
                icon: <FaShieldAlt className="text-6xl text-blue-500" />,
                title: "Secure & Private",
                desc: "We prioritize your privacy with encrypted data storage and secure access.",
              },
              {
                icon: <FaLightbulb className="text-6xl text-yellow-500" />,
                title: "AI-Powered Insights",
                desc: "Smart recommendations tailored to emotions and mood fluctuations.",
              },
              {
                icon: <FaUsers className="text-6xl text-purple-500" />,
                title: "Community Support",
                desc: "Connect with experts and find support through community-driven features.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="card bg-base-100 shadow-xl p-6 text-left flex items-center gap-4 rounded-md"
              >
                {feature.icon}
                <div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How ManoVie Works Section */}
      <div className="bg-base-300 py-16">
        <div className="container mx-auto px-8 md:px-16 lg:px-20">
          <h2 className="text-5xl font-bold text-zinc-600 mb-10">
            How ManoVie Works
          </h2>

          {/* Animated Workflow */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                icon: <FaMicrophone className="text-6xl text-red-500" />,
                title: "Data Input",
                desc: "Users input text or speech for analysis.",
              },
              {
                icon: <FaCog className="text-6xl text-yellow-500" />,
                title: "Data Processing",
                desc: "Preprocessing using NLP techniques.",
              },
              {
                icon: <FaRobot className="text-6xl text-blue-500" />,
                title: "Sentiment Analysis",
                desc: "AI models analyze sentiment and toxicity.",
              },
              {
                icon: <FaDatabase className="text-6xl text-green-500" />,
                title: "Database Storage",
                desc: "Data is securely stored in MongoDB.",
              },
              {
                icon: <FaChartPie className="text-6xl text-purple-500" />,
                title: "Visualization",
                desc: "Users see trends through interactive graphs.",
              },
              {
                icon: <FaBrain className="text-6xl text-pink-500" />,
                title: "AI Insights",
                desc: "AI provides recommendations for mental health.",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="card bg-base-100 shadow-xl p-6 text-left flex items-center gap-4 rounded-md"
              >
                {step.icon}
                <div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Meet the Developers Section
      <div className="bg-base-300 py-16">
        <div className="container mx-auto px-8 md:px-16 lg:px-20">
          <h2 className="text-5xl font-bold text-zinc-600 mb-10">
            Meet The Developers
          </h2>
          <div className="flex flex-wrap justify-center gap-10">
            {developers.map((dev, index) => (
              <div
                key={index}
                className="card w-80 bg-base-100 shadow-xl rounded-xl p-6 text-center"
              >
                <img
                  src={dev.image}
                  alt={dev.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-primary object-center"
                />
                <h3 className="text-xl font-semibold">{dev.name}</h3>
                <p className="text-sm text-gray-500">{dev.role}</p>
                <p className="text-gray-600 mt-2 text-justify">{dev.bio}</p>
                <div className="mt-4 flex items-center justify-center">
                  <a
                    href={dev.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center  hover:underline"
                  >
                    <FaLinkedin size={24} className="text-blue-600 mr-2" />
                    LinkedIn
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default About;
