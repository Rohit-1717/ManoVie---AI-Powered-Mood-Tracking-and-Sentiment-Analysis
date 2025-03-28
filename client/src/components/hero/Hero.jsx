import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import useTimeframeStore from "../../store/useTimeframeStore";

const data = {
  day: [
    { label: "Mon", sentiment: 0.45, toxicity: 0.12 },
    { label: "Tue", sentiment: 0.6, toxicity: 0.25 },
    { label: "Wed", sentiment: 0.75, toxicity: 0.3 },
    { label: "Thu", sentiment: 0.5, toxicity: 0.2 },
    { label: "Fri", sentiment: 0.85, toxicity: 0.35 },
    { label: "Sat", sentiment: 0.66, toxicity: 0.1 },
    { label: "Sun", sentiment: 0.7, toxicity: 0.15 },
  ],
  week: [
    { label: "Week 1", sentiment: 0.58, toxicity: 0.18 },
    { label: "Week 2", sentiment: 0.65, toxicity: 0.22 },
    { label: "Week 3", sentiment: 0.72, toxicity: 0.28 },
    { label: "Week 4", sentiment: 0.55, toxicity: 0.14 },
  ],
  year: [
    { label: "Jan", sentiment: 0.6, toxicity: 0.2 },
    { label: "Feb", sentiment: 0.68, toxicity: 0.25 },
    { label: "Mar", sentiment: 0.75, toxicity: 0.3 },
    { label: "Apr", sentiment: 0.63, toxicity: 0.22 },
    { label: "May", sentiment: 0.7, toxicity: 0.27 },
    { label: "Jun", sentiment: 0.8, toxicity: 0.35 },
    { label: "Jul", sentiment: 0.55, toxicity: 0.15 },
    { label: "Aug", sentiment: 0.66, toxicity: 0.18 },
    { label: "Sep", sentiment: 0.78, toxicity: 0.3 },
    { label: "Oct", sentiment: 0.62, toxicity: 0.2 },
    { label: "Nov", sentiment: 0.72, toxicity: 0.28 },
    { label: "Dec", sentiment: 0.85, toxicity: 0.4 },
  ],
};

function Hero() {
  const { timeframe, setTimeframe } = useTimeframeStore();

  return (
    // <div className="hero bg-base-200 min-h-screen mx-auto md:px-16 lg:px-20">
    //   <div className="hero-content flex-col lg:flex-row-reverse w-full">
    //     {/* Line Chart */}
    //     <div className="w-full lg:w-1/2">
    //       <div className="flex justify-center space-x-2 mb-3">
    //         <button
    //           className={`btn ${
    //             timeframe === "day" ? "btn-primary" : "btn-outline"
    //           }`}
    //           onClick={() => setTimeframe("day")}
    //         >
    //           Day
    //         </button>
    //         <button
    //           className={`btn ${
    //             timeframe === "week" ? "btn-primary" : "btn-outline"
    //           }`}
    //           onClick={() => setTimeframe("week")}
    //         >
    //           Week
    //         </button>
    //         <button
    //           className={`btn ${
    //             timeframe === "year" ? "btn-primary" : "btn-outline"
    //           }`}
    //           onClick={() => setTimeframe("year")}
    //         >
    //           Year
    //         </button>
    //       </div>

    //       <ResponsiveContainer width="100%" height={300}>
    //         <LineChart
    //           data={data[timeframe]}
    //           margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
    //         >
    //           <CartesianGrid strokeDasharray="3 3" />
    //           <XAxis dataKey="label" />
    //           <YAxis domain={[0, 1]} /> {/* Now ranges from 0 to 1 */}
    //           <Tooltip />
    //           <Line
    //             type="monotone"
    //             dataKey="sentiment"
    //             stroke="#4f46e5"
    //             strokeWidth={3}
    //             dot={{ r: 5 }}
    //           />
    //           <Line
    //             type="monotone"
    //             dataKey="toxicity"
    //             stroke="#e53e3e"
    //             strokeWidth={3}
    //             dot={{ r: 5 }}
    //           />
    //         </LineChart>
    //       </ResponsiveContainer>
    //     </div>

    //     {/* Text Content */}
    //     <div className="lg:w-1/2 text-center lg:text-left">
    //       <h1 className="text-5xl font-bold text-primary">
    //         Track Your Mood Effortlessly
    //       </h1>
    //       <p className="py-6 text-lg">
    //         ManoVie helps you analyze your mood patterns through advanced
    //         AI-based sentiment tracking. Keep track of your emotional well-being
    //         with our interactive insights.
    //       </p>
    //       <button className="btn btn-primary">Get Started</button>
    //     </div>
    //   </div>
    // </div>

    <div className="bg-base-200 min-h-screen mx-auto md:px-16 lg:px-20 flex flex-col">
      {/* Hero Section */}
      <div className="hero w-full flex flex-col lg:flex-row-reverse items-center mt-10">
        {/* Line Chart Section */}
        <div className="w-full lg:w-1/2">
          <div className="flex justify-center space-x-2 mb-3">
            <button
              className={`btn ${
                timeframe === "day" ? "btn-primary" : "btn-outline"
              }`}
              onClick={() => setTimeframe("day")}
            >
              Day
            </button>
            <button
              className={`btn ${
                timeframe === "week" ? "btn-primary" : "btn-outline"
              }`}
              onClick={() => setTimeframe("week")}
            >
              Week
            </button>
            <button
              className={`btn ${
                timeframe === "year" ? "btn-primary" : "btn-outline"
              }`}
              onClick={() => setTimeframe("year")}
            >
              Year
            </button>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={data[timeframe]}
              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis domain={[0, 1]} /> {/* Now ranges from 0 to 1 */}
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sentiment"
                stroke="#4f46e5"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="toxicity"
                stroke="#e53e3e"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Text Content */}
        <div className="lg:w-1/2 text-center lg:text-left px-6">
          <h1 className="text-5xl font-bold text-primary">
            Track Your Mood Effortlessly
          </h1>
          <p className="py-6 text-lg text-justify">
            ManoVie helps you analyze your mood patterns through advanced
            AI-based sentiment tracking. Keep track of your emotional well-being
            with our interactive insights.
          </p>
          <div className="flex flex-row gap-2">
            <button className="btn btn-primary">Get Started</button>
            <button className="btn ">Learn More</button>
          </div>
        </div>
      </div>

      {/* Key Features Section */}
      <div className="bg-base-200 py-12 px-6">
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-primary">Key Features</h1>
        </div>

        {/* Feature Cards */}
        <div className="flex flex-wrap justify-center gap-8">
          {/* Sentiment Analysis */}
          <div className="card bg-base-100 w-80 shadow-lg py-6 px-4">
            <figure>
              <img
                src="https://img.freepik.com/free-vector/company-reputation-concept-building-relationship-with-people-improving-customer-loyalty-idea-pr-reputation-management-flat-vector-illustration_613284-2471.jpg?t=st=1743194611~exp=1743198211~hmac=e6792849abeaf159f20923e9734b907e0aa01e9b63320ec4d9a53fc7792fef17&w=900"
                alt="Sentiment Analysis"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">Sentiment Analysis</h2>
              <p className="text-justify">
                Analyzes emotional tone in text and detects positive, neutral,
                and negative sentiments.
              </p>
            </div>
          </div>

          {/* Toxicity Detection */}
          <div className="card bg-base-100 w-80 shadow-lg py-6 px-4">
            <figure>
              <img
                src="https://img.freepik.com/free-vector/emoji-satisfaction-meter-gradient_78370-4157.jpg?t=st=1743194565~exp=1743198165~hmac=978c814611cf06e80bd117f07b714101ca9313ddb67359d5a85cc13ca89ef991&w=996"
                alt="Toxicity Detection"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">Toxicity Detection</h2>
              <p className="text-justify">
                Identifies harmful and toxic language to ensure a safer space
                for users.
              </p>
            </div>
          </div>

          {/* Mood Journal */}
          <div className="card bg-base-100 w-80 shadow-lg py-6 px-4">
            <figure>
              <img
                src="https://img.freepik.com/free-vector/my-feelings-storyboard_742173-4382.jpg?t=st=1743193014~exp=1743196614~hmac=2cd1d14ed7d103593e39e243fc7eccd4c1b1d0b81a012fa21aa9fb54d22cd024&w=996"
                alt="Mood Journal"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">Mood Journal</h2>
              <p className="text-justify">
                Allows users to log daily thoughts and track mood fluctuations
                over time.
              </p>
            </div>
          </div>

          {/* AI-Based Mood Predictions */}
          <div className="card bg-base-100 w-80 shadow-lg py-6 px-4">
            <figure>
              <img
                src="https://img.freepik.com/premium-vector/people-are-mood-scale-emotion-overload-burnout-fatigue-from-work-stress-level-meter_101179-2192.jpg?w=826"
                alt="AI-Based Mood Predictions"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">AI-Based Mood Predictions</h2>
              <p className="text-justify">
                Uses AI to predict mood patterns and provide personalized
                recommendations.
              </p>
            </div>
          </div>

          {/* Data Visualization & Reports */}
          <div className="card bg-base-100 w-80 shadow-lg py-6 px-4">
            <figure>
              <img
                src="https://img.freepik.com/free-vector/stock-market-analysis-with-chart_23-2148584739.jpg?t=st=1743194743~exp=1743198343~hmac=2b0c7ca12af536dbc59647f516db14ee263e02c764e6590e6417023dfa7d8c39&w=996"
                alt="Data Visualization"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">Data Visualization & Reports</h2>
              <p className="text-justify">
                Displays mood trends through interactive graphs and charts for
                better insights.
              </p>
            </div>
          </div>

          {/* Secure & Private */}
          <div className="card bg-base-100 w-80 shadow-lg py-6 px-4">
            <figure>
              <img
                src="https://img.freepik.com/free-vector/gradient-ssl-illustration_23-2149251019.jpg?t=st=1743194820~exp=1743198420~hmac=fda4740c2e9174222d08aa38b12d014ba898f8567bd00281d6c3adf049650309&w=740"
                alt="Secure & Private"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">Secure & Private</h2>
              <p className="text-justify">
                Ensures complete privacy with encrypted and secure data storage.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}

      <div className="Testimonial mb-10">
        <h1 className="text-5xl font-bold text-primary px-6">
          What Our Users Say
        </h1>

        <div className="bg-base-200 py-16 px-6 md:px-16 lg:px-20 lg:flex lg:items-center lg:justify-center">
          {/* Testimonial Carousel */}
          <div className="carousel w-full max-w-3xl mx-auto">
            {/* Slide 1 */}
            <div
              id="slide1"
              className="carousel-item relative w-full flex justify-center"
            >
              <div className="card bg-base-100 shadow-lg p-6 text-center max-w-lg">
                <p className="text-lg italic">
                  "ManoVie has completely changed the way I understand my
                  emotions. The insights are so accurate!"
                </p>
                <div className="mt-4">
                  <h3 className="font-bold text-primary">Rahul Sharma</h3>
                  <p className="text-sm text-gray-500">Software Engineer</p>
                </div>
              </div>
              <a
                href="#slide3"
                className="absolute left-5 top-1/2 transform -translate-y-1/2 btn btn-circle"
              >
                ❮
              </a>
              <a
                href="#slide2"
                className="absolute right-5 top-1/2 transform -translate-y-1/2 btn btn-circle"
              >
                ❯
              </a>
            </div>

            {/* Slide 2 */}
            <div
              id="slide2"
              className="carousel-item relative w-full flex justify-center"
            >
              <div className="card bg-base-100 shadow-lg p-6 text-center max-w-lg">
                <p className="text-lg italic">
                  "I love how intuitive the dashboard is. Mood tracking has
                  never been this easy!"
                </p>
                <div className="mt-4">
                  <h3 className="font-bold text-primary">Sneha Verma</h3>
                  <p className="text-sm text-gray-500">Psychology Student</p>
                </div>
              </div>
              <a
                href="#slide1"
                className="absolute left-5 top-1/2 transform -translate-y-1/2 btn btn-circle"
              >
                ❮
              </a>
              <a
                href="#slide3"
                className="absolute right-5 top-1/2 transform -translate-y-1/2 btn btn-circle"
              >
                ❯
              </a>
            </div>

            {/* Slide 3 */}
            <div
              id="slide3"
              className="carousel-item relative w-full flex justify-center"
            >
              <div className="card bg-base-100 shadow-lg p-6 text-center max-w-lg">
                <p className="text-lg italic">
                  "The AI-powered insights are a game-changer. It helps me stay
                  mindful of my emotions."
                </p>
                <div className="mt-4">
                  <h3 className="font-bold text-primary">Amit Tiwari</h3>
                  <p className="text-sm text-gray-500">
                    Mental Health Advocate
                  </p>
                </div>
              </div>
              <a
                href="#slide2"
                className="absolute left-5 top-1/2 transform -translate-y-1/2 btn btn-circle"
              >
                ❮
              </a>
              <a
                href="#slide1"
                className="absolute right-5 top-1/2 transform -translate-y-1/2 btn btn-circle"
              >
                ❯
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
