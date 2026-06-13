import { motion } from "framer-motion";

export default function Sidebar({ messages, onClear }) {
  const userMessages = messages.filter((m) => m.role === "user");

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 shrink-0 border-r border-white/10 bg-black/20 backdrop-blur-md flex flex-col h-full"
    >
      {/* Sidebar Header */}
      <div className="px-4 py-5 border-b border-white/10">
        <p className="text-xs text-white/40 uppercase tracking-widest font-medium">
          Chat History
        </p>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
        {userMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-12 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
              🌍
            </div>
            <p className="text-white/30 text-xs text-center px-4">
              Your conversations will appear here
            </p>
            <div className="flex flex-col gap-2 w-full mt-2">
              {["Bali 🌴", "Paris 🇫🇷", "Tokyo 🗾"].map((dest, i) => (
                <div
                  key={i}
                  className="px-3 py-2 rounded-xl bg-white/3 border border-white/5 text-white/20 text-xs text-center"
                >
                  {dest}
                </div>
              ))}
            </div>
            <p className="text-white/20 text-xs text-center px-4 mt-1">
              Start a conversation to see history
            </p>
          </div>
        ) : (
          userMessages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group px-3 py-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/15 transition cursor-pointer"
            >
              <div className="flex items-start gap-2">
                <span className="text-sm mt-0.5 shrink-0">
                  {msg.content.toLowerCase().includes("bali") ? "🌴" :
                   msg.content.toLowerCase().includes("paris") ? "🇫🇷" :
                   msg.content.toLowerCase().includes("tokyo") || msg.content.toLowerCase().includes("japan") ? "🗾" :
                   msg.content.toLowerCase().includes("dubai") ? "🏙️" :
                   msg.content.toLowerCase().includes("maldives") ? "🏝️" :
                   msg.content.toLowerCase().includes("rajasthan") ? "🏰" :
                   msg.content.toLowerCase().includes("singapore") ? "🦁" :
                   msg.content.toLowerCase().includes("rome") || msg.content.toLowerCase().includes("italy") ? "🏛️" :
                   msg.content.toLowerCase().includes("visa") ? "🛂" :
                   msg.content.toLowerCase().includes("weather") ? "🌤️" :
                   msg.content.toLowerCase().includes("budget") ? "💰" : "✈️"}
                </span>
                <p className="text-white/60 text-xs leading-relaxed line-clamp-2 group-hover:text-white/80 transition">
                  {msg.content}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Stats */}
      {userMessages.length > 0 && (
        <div className="px-4 py-3 border-t border-white/10 border-b">
          <div className="flex items-center justify-between">
            <span className="text-white/30 text-xs">{userMessages.length} conversation{userMessages.length > 1 ? "s" : ""}</span>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-blue-300/60 text-xs">Active</span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom */}
      <div className="px-4 py-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClear}
          className="w-full py-2.5 rounded-xl border border-white/10 text-white/40 text-xs hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 transition flex items-center justify-center gap-2"
        >
          <span>🗑️</span>
          <span>Clear History</span>
        </motion.button>
      </div>
    </motion.div>
  );
}