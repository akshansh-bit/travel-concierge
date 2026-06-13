import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

export default function Message({ role, content }) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6`}
    >
      {!isUser && (
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-base mr-3 mt-1 shrink-0 shadow-lg">
          ✈️
        </div>
      )}

      <div className={`max-w-[78%] ${isUser ? "" : "w-full"}`}>
        {isUser ? (
          <div className="px-5 py-3 rounded-2xl rounded-br-sm bg-gradient-to-br from-blue-600 to-blue-700 text-white text-sm leading-relaxed shadow-lg">
            {content}
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl rounded-bl-sm overflow-hidden shadow-xl">
            <div className="px-5 py-3 border-b border-white/10 bg-white/5 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <span className="text-xs text-blue-300 font-medium">Travel Concierge</span>
            </div>
            <div className="px-5 py-4 text-sm text-white/85 leading-relaxed prose prose-invert prose-sm max-w-none
              prose-headings:text-white prose-headings:font-bold prose-headings:mb-2 prose-headings:mt-4
              prose-p:text-white/80 prose-p:mb-2
              prose-li:text-white/80 prose-li:mb-1
              prose-strong:text-white prose-strong:font-semibold
              prose-hr:border-white/10">
              <ReactMarkdown
                components={{
                  a: ({ href, children }) => (
                    <a href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-base ml-3 mt-1 shrink-0 shadow-lg">
          👤
        </div>
      )}
    </motion.div>
  );
}