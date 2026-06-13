import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "./hooks/useChat";
import Header from "./components/Header";
import Message from "./components/Message";
import TypingIndicator from "./components/TypingIndicator";
import ChatInput from "./components/ChatInput";
import Sidebar from "./components/Sidebar";
import AnimatedBackground from "./components/AnimatedBackground";
import LandingPage from "./components/LandingPage";

export default function App() {
  const { messages, loading, sendMessage, clearChat } = useChat();
  const bottomRef = useRef(null);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleDestinationSelect = (query) => {
    setShowChat(true);
    setTimeout(() => sendMessage(query), 300);
  };

  return (
    <AnimatePresence mode="wait">
      {!showChat ? (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <LandingPage
            onStart={() => setShowChat(true)}
            onDestinationSelect={handleDestinationSelect}
          />
        </motion.div>
      ) : (
        <motion.div
          key="chat"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="h-screen flex flex-col overflow-hidden text-white"
        >
          <AnimatedBackground />

          {/* Header */}
          <Header onClear={clearChat} onBack={() => setShowChat(false)} />

          {/* Body */}
          <div className="flex flex-1 overflow-hidden">
            <Sidebar messages={messages} onClear={clearChat} />

            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="max-w-3xl mx-auto">
                  {messages.length === 0 && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center mt-16 text-center"
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="text-6xl mb-4"
    >
      🌍
    </motion.div>
    <h2 className="text-2xl font-bold text-white mb-2">
      Where do you want to go?
    </h2>
    <p className="text-white/40 text-sm mb-8">
      Ask me anything about your trip!
    </p>

    {/* Suggested Queries */}
    <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
      {[
        { emoji: "🌴", text: "Plan a 5 day trip to Bali" },
        { emoji: "🇫🇷", text: "Visa requirements for France" },
        { emoji: "🗾", text: "Best time to visit Japan" },
        { emoji: "💰", text: "Budget trip to Dubai from Mumbai" },
        { emoji: "🏰", text: "7 day Rajasthan itinerary" },
        { emoji: "🌏", text: "Cheapest countries from India" },
      ].map((s, i) => (
        <motion.button
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => sendMessage(s.text)}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white/70 hover:text-white text-sm text-left transition-all duration-200 backdrop-blur-sm"
        >
          <span className="text-xl">{s.emoji}</span>
          <span>{s.text}</span>
        </motion.button>
      ))}
    </div>
  </motion.div>
)}

                  <AnimatePresence>
                    {messages.map((msg, i) => (
                      <Message key={i} role={msg.role} content={msg.content} />
                    ))}
                  </AnimatePresence>

                  {loading && <TypingIndicator />}
                  <div ref={bottomRef} />
                </div>
              </div>

              <ChatInput onSend={sendMessage} loading={loading} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}