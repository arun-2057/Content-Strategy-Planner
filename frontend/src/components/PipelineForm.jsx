import { useState, useEffect } from "react";
import Loader from "./Loader.jsx";

export default function PipelineForm({ initialTopic = "", onResult, darkMode = false }) {
  const [topic, setTopic] = useState(initialTopic || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => setTopic(initialTopic), [initialTopic]);

  const handleGenerate = async (e) => {
    e?.preventDefault();
    if (!topic.trim()) {
      setError("Please enter a topic.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Generation failed");
      }
      const data = await res.json();
      onResult(topic, data.planner);
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={`bg-white/80 ${darkMode ? "bg-gray-800/80 text-gray-100" : ""} rounded-2xl p-6 shadow-lg`} onSubmit={handleGenerate}>
      <h1 className="text-2xl font-bold mb-2">AI Content Planner</h1>
      <p className="text-sm text-gray-600 mb-4">Enter a topic to generate a strategic content planner.</p>
      <div className="flex gap-3">
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="flex-1 p-3 rounded border"
          placeholder="e.g., AI in Healthcare"
        />
        <button type="submit" className="px-4 py-3 rounded bg-indigo-600 text-white font-semibold" disabled={loading}>
          {loading ? <Loader /> : "Generate"}
        </button>
      </div>
      {error && <p className="text-red-500 mt-3">{error}</p>}
    </form>
  );
}
