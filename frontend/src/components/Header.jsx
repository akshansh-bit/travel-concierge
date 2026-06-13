import { motion } from "framer-motion";

export default function Header({ onClear, onBack }) {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex items-center justify-between px-8 py-4 border-b border-white/10 backdrop-blur-md bg-black/20 z-10"
    >
      <div className="flex items-center gap-4">
  {onBack && (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onBack}
      className="w-9 h-9 rounded-xl border border-white/20 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition"
    >
      ←
    </motion.button>
  )}
  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl shadow-lg">
    ✈️
  </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-wide">
            Travel Concierge
          </h1>
          <p className="text-xs text-blue-300/80">
            AI-Powered · Premium Travel Planning
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
          <span className="text-xs text-green-400">AI Online</span>
        </div>
        <button
          onClick={onClear}
          className="text-sm px-4 py-2 rounded-xl border border-white/20 text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200"
        >
          + New Chat
        </button>
      </div>
    </motion.div>
  );
}