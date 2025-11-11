import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PipelineForm from "./components/PipelineForm.jsx";
import Dashboard from "./pages/Dashboard.jsx";

export default function App() {
  const [history, setHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [plannerText, setPlannerText] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("plannerHistory") || "[]");
    setHistory(saved);
    const theme = localStorage.getItem("theme") || "light";
    setDarkMode(theme === "dark");
  }, []);

  useEffect(() => {
    localStorage.setItem("plannerHistory", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const onGenerate = (topic, planner) => {
    setPlannerText(planner);
    setSelectedTopic(topic);
    setHistory((prev) => {
      const updated = [topic, ...prev.filter((t) => t !== topic)].slice(0, 20);
      return updated;
    });
  };

  const onSelectTopic = (topic) => {
    setSelectedTopic(topic);
    setPlannerText("");
  };

  const onRename = (index, newName) => {
    const cloned = [...history];
    cloned[index] = newName;
    setHistory(cloned);
  };

  const onDelete = (index) => {
    const cloned = history.filter((_, i) => i !== index);
    setHistory(cloned);
  };

  const containerBg = darkMode ? "bg-gray-900 text-gray-100" : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-900";

  return (
    <div className={`min-h-screen ${containerBg} flex`}>
      {/* Sidebar */}
      <aside className={`hidden md:flex w-72 p-6 flex-col gap-4 ${darkMode ? "bg-gray-800" : "bg-white/70"} backdrop-blur-xl`} >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">History</h2>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-1 rounded bg-indigo-600 text-white"
          >
            {darkMode ? "Light" : "Dark"}
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          {history.length === 0 && <p className="text-sm opacity-60">No history yet.</p>}
          <div className="space-y-2 mt-2">
            {history.map((t, i) => (
              <div key={i} className={`flex items-center justify-between p-2 rounded ${darkMode ? "bg-gray-700" : "bg-white/60"}`}>
                <button className="text-left flex-1" onClick={() => onSelectTopic(t)}>{t}</button>
                <div className="flex gap-2">
                  <button onClick={() => {
                    const name = prompt("Rename topic", t);
                    if (name) onRename(i, name);
                  }}>✏️</button>
                  <button onClick={() => onDelete(i)}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-sm">
          <button className="text-red-500" onClick={() => setHistory([])}>Clear History</button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 flex flex-col items-center">
        <div className="w-full max-w-3xl">
          <PipelineForm initialTopic={selectedTopic} onResult={onGenerate} darkMode={darkMode} />
          <Dashboard planner={plannerText} />
        </div>
      </main>
    </div>
  );
}

