import React, { useState, useEffect, useRef } from "react";
import { FaMicrophone, FaMicrophoneSlash, FaSave } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

import { useSentimentStore } from "../../store/useSentimentStore";

function WriteJournal() {
  const [entry, setEntry] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const { analyzeText } = useSentimentStore();

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      toast.error("Your browser doesn't support voice recognition.");
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript) {
        setEntry((prev) => (prev + " " + finalTranscript).trim());
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      toast.error("Voice recognition error: " + event.error);
      setListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const toggleRecording = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (listening) {
      recognition.stop();
      setListening(false);
      toast.success("Voice recording stopped.");
    } else {
      recognition.start();
      setListening(true);
      toast("🎤 Voice recording started...");
    }
  };

  const handleSave = async () => {
    if (!entry.trim()) {
      toast.error("Journal entry is empty.");
      return;
    }

    toast.loading("Analyzing your journal...");
    try {
      const result = await analyzeText(entry);
      toast.dismiss();
      toast.success("Journal saved & analyzed successfully!");

      // Optional: Use the result
      console.log("Analyzed Result:", result);
    } catch (error) {
      toast.dismiss();
      toast.error("Something went wrong while saving.");
      console.error(error);
    }
  };

  return (
    <div className="bg-base-300 min-h-screen py-10 px-6 md:px-16 lg:px-20 text-base-content">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto bg-base-100 p-8 rounded-2xl shadow-xl space-y-6 relative"
      >
        {/* Voice Recorder Card */}
        <div className="w-full bg-base-200 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Sound Bars */}
            <div className="flex gap-[2px] h-6 items-end">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: listening
                      ? ["8px", "24px", "12px"]
                      : ["10px", "12px", "10px"],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: listening ? 0.6 : 1.5,
                    delay: i * 0.1,
                  }}
                  className={`w-1 rounded ${
                    listening ? "bg-primary" : "bg-base-content/40"
                  }`}
                />
              ))}
            </div>
            <p className="font-medium transition-all duration-300">
              {listening ? (
                <span className="text-primary font-semibold">Listening...</span>
              ) : (
                <span className="text-base-content/60">Mic is off</span>
              )}
            </p>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            className={`btn btn-circle btn-sm ${
              listening
                ? "bg-red-600 text-white hover:bg-red-700"
                : "btn-primary"
            } shadow-md transition-all duration-300`}
            onClick={toggleRecording}
          >
            {listening ? (
              <FaMicrophoneSlash className="text-lg" />
            ) : (
              <FaMicrophone className="text-lg" />
            )}
          </motion.button>
        </div>

        {/* Textarea */}
        <div className="relative">
          {listening && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: -20 }}
              className="absolute left-4 -top-6 bg-primary text-white text-sm px-4 py-1 rounded-lg shadow z-10 tracking-wide font-medium"
            >
              🎙️ Transcribing...
            </motion.div>
          )}
          <textarea
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            className="textarea textarea-bordered w-full h-60 text-lg p-4 resize-none"
            placeholder="Start writing your journal here or speak to write..."
          ></textarea>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl shadow-md hover:scale-[1.03] hover:shadow-lg transition-all duration-300 flex items-center gap-2"
        >
          <FaSave className="text-lg" />
          Save Journal
        </button>
      </motion.div>
    </div>
  );
}

export default WriteJournal;
