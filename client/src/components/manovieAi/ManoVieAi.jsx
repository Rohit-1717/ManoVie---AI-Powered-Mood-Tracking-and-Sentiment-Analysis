import React, { useState, useRef, useEffect } from "react";
import { FaTimes, FaArrowDown, FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import useManoVieAiStore from "../../store/useManoVieAiStore";


function ManovieAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [voiceOverlay, setVoiceOverlay] = useState(false);

  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const isNearBottomRef = useRef(true);

  // ✅ Select only what we need, stable references
  const messages = useManoVieAiStore((state) => state.messages);
  const loading = useManoVieAiStore((state) => state.loading);
  const sendMessage = useManoVieAiStore((state) => state.sendMessage);

  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue("");
  };

  // Scroll handling
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const threshold = 100;
    const onScroll = () => {
      const distanceFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;
      const atBottom = distanceFromBottom <= threshold;
      isNearBottomRef.current = atBottom;
      setShowScrollDown(!atBottom);
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (isNearBottomRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      setShowScrollDown(false);
    } else {
      setShowScrollDown(true);
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    isNearBottomRef.current = true;
    setShowScrollDown(false);
  };

  return (
    <>
      {/* Floating AI Button */}
      <button
        className="fixed top-1/2 right-0 z-50 bg-primary text-white px-4 py-2 rounded-l-full shadow-lg flex items-center gap-2 hover:bg-primary-focus transition-all max-w-[90vw] sm:max-w-xs -translate-y-1/2"
        onClick={() => setIsOpen(true)}
        aria-label="Open Manovie AI"
      >
        <img src="/manovieAiLogo.png" alt="Manovie AI" className="w-8 h-8 rounded-full object-cover" />
        <span className="font-semibold text-sm sm:text-base whitespace-nowrap">AI</span>
      </button>

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm sm:max-w-md bg-base-100 shadow-xl transform transition-transform duration-300 z-50 flex flex-col
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-base-300">
          <div className="flex items-center gap-3">
            <img src="/manovieAiLogo.png" alt="Manovie AI Logo" className="w-8 h-8 rounded-full object-cover" />
            <h2 className="text-xl font-semibold">Manovie AI</h2>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700" aria-label="Close">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Messages */}
        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3 pb-28" role="log" aria-live="polite">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`p-3 rounded-xl max-w-xs break-words ${
                  msg.from === "user"
                    ? "bg-blue-600 text-white dark:bg-blue-400 dark:text-black"
                    : "bg-base-200 text-base-content"
                }`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Scroll Down Button */}
        {showScrollDown && (
          <button className="absolute bottom-24 right-4 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary-focus" onClick={scrollToBottom} aria-label="Scroll to latest message">
            <FaArrowDown />
          </button>
        )}

        {/* Input */}
        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-base-300 flex gap-2 bg-base-100">
          <input
            type="text"
            placeholder="Type your thoughts..."
            className="input input-bordered flex-1"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button className="btn btn-primary" onClick={handleSend} aria-label="Send message">➤</button>
          <button className="btn btn-circle btn-secondary" onClick={() => setVoiceOverlay(true)} aria-label="Voice Chat">
            <FaMicrophone size={18} />
          </button>
        </div>
      </div>

      {isOpen && <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setIsOpen(false)} />}

      {/* Voice Overlay */}
      {voiceOverlay && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60]">
          <div className="bg-base-100 rounded-2xl p-8 w-11/12 max-w-md text-center shadow-2xl transform animate-scaleIn">
            <div className="flex justify-center mb-6">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 rounded-full bg-primary opacity-20 animate-ping" />
                <div className="absolute inset-4 rounded-full bg-primary opacity-40 animate-pulse" />
                <div className="absolute inset-8 rounded-full bg-primary flex items-center justify-center text-white">
                  <FaMicrophone size={28} />
                </div>
              </div>
            </div>
            <h3 className="text-lg font-semibold">Listening...</h3>
            <p className="text-sm text-gray-500 mt-1">Speak to Manovie AI — your voice is being captured</p>
            <div className="mt-6 flex justify-center">
              <button onClick={() => setVoiceOverlay(false)} className="btn btn-error flex items-center gap-2">
                <FaMicrophoneSlash />
                Stop Talking
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ManovieAI;
