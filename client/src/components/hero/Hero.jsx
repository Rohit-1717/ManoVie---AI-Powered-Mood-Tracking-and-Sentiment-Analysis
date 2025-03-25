import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center bg-base-200 px-6 text-center">
      {/* Glassmorphism Effect Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl opacity-30"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-3xl rounded-3xl bg-white/10 p-10 backdrop-blur-lg shadow-xl border border-white/20"
      >
        <h1 className="text-4xl font-bold text-primary md:text-5xl">
          Track Your Mind, Elevate Your Life
        </h1>
        <p className="mt-4 text-lg text-gray-300">
          ManoVie helps you analyze your emotions, track mood trends, and find
          insights to improve mental well-being.
        </p>

        {/* DaisyUI Buttons */}
        <div className="mt-6 flex justify-center space-x-4">
          <button className="btn btn-primary flex items-center gap-2">
            Get Started <FaArrowRight />
          </button>
          <button className="btn btn-outline btn-secondary">Learn More</button>
        </div>
      </motion.div>
    </section>
  );
}
