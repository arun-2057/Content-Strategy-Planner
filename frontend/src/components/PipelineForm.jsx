import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Sparkles, Send } from "lucide-react";
import Loader from "./Loader.jsx";

const API_BASE_URL = "http://127.0.0.1:8000";

export default function PipelineForm({ initialTopic = "", onResult, darkMode = false }) {
  const [topic, setTopic] = useState(initialTopic || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Sync with initialTopic prop changes
  useEffect(() => {
    if (initialTopic) {
      setTopic(initialTopic);
    }
  }, [initialTopic]);

  const handleGenerate = useCallback(async (e) => {
    e?.preventDefault();
    
    const trimmedTopic = topic.trim();
    if (!trimmedTopic) {
      setError("Please enter a topic.");
      return;
    }
    
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: trimmedTopic }),
      });
      
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Generation failed");
      }
      
      const data = await res.json();
      onResult(trimmedTopic, data.planner);
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  }, [topic, onResult]);

  return (
    <form 
      className={`relative overflow-hidden rounded-3xl p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
        darkMode 
          ? "bg-gray-800/90 border border-gray-700" 
          : "bg-white/90 border border-white/50"
      }`} 
      onSubmit={handleGenerate}
    >
      {/* Decorative gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 pointer-events-none" />
      
      <div className="relative">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            AI Content Planner
          </h1>
        </div>
        <p className={`text-sm mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Enter a topic to generate a strategic content planner powered by AI.
        </p>
        
        <div className="flex gap-3">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className={`flex-1 px-5 py-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 ${
              darkMode 
                ? "bg-gray-700/50 border-gray-600 focus:border-indigo-500 focus:ring-indigo-500/20 text-white placeholder-gray-400" 
                : "bg-white border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 text-gray-900 placeholder-gray-400"
            }`}
            placeholder="e.g., AI in Healthcare, Sustainable Energy..."
            disabled={loading}
          />
          <button 
            type="submit" 
            className={`group px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
              loading
                ? "bg-gray-400"
                : "bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-600 hover:via-purple-700 hover:to-pink-700 text-white"
            }`}
            disabled={loading}
          >
            {loading ? (
              <Loader />
            ) : (
              <>
                <span>Generate</span>
                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
        
        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 flex items-center gap-2"
            role="alert"
          >
            <span className="text-lg">⚠️</span>
            {error}
          </motion.p>
        )}
      </div>
    </form>
  );
}
