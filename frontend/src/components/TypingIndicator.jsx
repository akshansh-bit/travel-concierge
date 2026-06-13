import { motion } from "framer-motion";

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start mb-6"
    >
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-base mr-3 mt-1 shrink-0 shadow-lg">
        ✈️
      </div>
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl rounded-bl-sm px-5 py-4 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-blue-400"></div>
          <span className="text-xs text-blue-300 font-medium">Planning your trip...</span>
        </div>
        <div className="flex gap-1.5 items-center">
          {[0, 150, 300].map((delay, i) => (
            <motion.span
              key={i}
              className="w-2 h-2 bg-blue-400 rounded-full"
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: delay / 1000,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}