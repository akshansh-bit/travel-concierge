import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AnimatedBackground from "./AnimatedBackground";

const DESTINATIONS = [
  { name: "Bali", country: "Indonesia", query: "bali temple indonesia" },
  { name: "Paris", country: "France", query: "paris eiffel tower" },
  { name: "Tokyo", country: "Japan", query: "tokyo japan city" },
  { name: "Dubai", country: "UAE", query: "dubai skyline" },
  { name: "Maldives", country: "Maldives", query: "maldives beach ocean" },
  { name: "Rajasthan", country: "India", query: "rajasthan palace india" },
  { name: "Singapore", country: "Singapore", query: "singapore marina bay" },
  { name: "Rome", country: "Italy", query: "rome colosseum italy" },
];

const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_KEY;

function DestinationCard({ dest, onSelect }) {
  const [img, setImg] = useState(null);

  useEffect(() => {
    fetch(
      `https://api.unsplash.com/search/photos?query=${dest.query}&per_page=1&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } }
    )
      .then((r) => r.json())
      .then((d) => setImg(d.results?.[0]?.urls?.regular))
      .catch(() => {});
  }, []);

  return (
    <motion.div
      whileHover={{ scale: 1.04, y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(`Plan a trip to ${dest.name}`)}
      className="relative rounded-2xl overflow-hidden cursor-pointer group h-48 bg-white/5 border border-white/10"
    >
      {img ? (
        <img src={img} alt={dest.name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 animate-pulse" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 p-4">
        <h3 className="text-white font-bold text-lg leading-tight">{dest.name}</h3>
        <p className="text-white/60 text-xs">{dest.country}</p>
      </div>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <span className="bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs px-4 py-2 rounded-full">
          Plan Trip ✈️
        </span>
      </div>
    </motion.div>
  );
}

export default function LandingPage({ onStart, onDestinationSelect }) {
  const [heroImg, setHeroImg] = useState(null);

  useEffect(() => {
    fetch(
      `https://api.unsplash.com/search/photos?query=travel+aerial+landscape&per_page=1&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } }
    )
      .then((r) => r.json())
      .then((d) => setHeroImg(d.results?.[0]?.urls?.full))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen text-white overflow-y-auto">
      <AnimatedBackground />

      {/* ── Navbar ── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 backdrop-blur-md bg-black/20 border-b border-white/10"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg shadow-lg">
            ✈️
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">Travel Concierge</h1>
            <p className="text-xs text-blue-300/70">AI-Powered Planning</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-green-400">AI Online</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium shadow-lg"
          >
            Start Planning ✈️
          </motion.button>
        </div>
      </motion.nav>

      {/* ── Hero Section ── */}
      <div className="relative h-screen flex flex-col items-center justify-center text-center px-6">
        {heroImg && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${heroImg})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-400/30 bg-blue-500/10 backdrop-blur-sm mb-6"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-300 text-xs font-medium">AI-Powered Travel Planning</span>
          </motion.div>

          <h1 className="text-6xl font-bold text-white mb-4 leading-tight">
            Your Dream Trip,<br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Planned by AI
            </span>
          </h1>

          <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
            Personalized itineraries, visa info, live weather & budget planning —
            all for Indian travellers.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-semibold text-lg shadow-2xl shadow-blue-500/30 transition-all duration-200"
          >
            Start Planning ✈️
          </motion.button>
        </motion.div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-8 text-white/30 text-sm flex flex-col items-center gap-1"
        >
          <span>Scroll to explore</span>
          <span>↓</span>
        </motion.div>
      </div>

      {/* ── Features Section ── */}
      <div className="relative z-10 px-8 py-16 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
        >
          {[
            { icon: "🗺️", title: "Itineraries", desc: "Day-by-day personalized plans" },
            { icon: "🛂", title: "Visa Info", desc: "Indian passport requirements" },
            { icon: "🌤️", title: "Live Weather", desc: "Real-time destination weather" },
            { icon: "💱", title: "Forex Rates", desc: "Live INR exchange rates" },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition"
            >
              <span className="text-3xl mb-3">{f.icon}</span>
              <h3 className="text-white font-semibold text-sm mb-1">{f.title}</h3>
              <p className="text-white/40 text-xs">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── Destinations Grid ── */}
      <div className="relative z-10 px-8 pb-16 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold text-white mb-2">Popular Destinations</h2>
          <p className="text-white/40 text-sm">Click any destination to start planning</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {DESTINATIONS.map((dest, i) => (
            <motion.div
              key={dest.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <DestinationCard dest={dest} onSelect={onDestinationSelect} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-white/30 text-sm mb-4">Ready to explore the world?</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="px-6 py-3 rounded-xl border border-white/20 text-white/70 hover:bg-white/10 hover:text-white transition text-sm"
          >
            Open AI Concierge →
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}