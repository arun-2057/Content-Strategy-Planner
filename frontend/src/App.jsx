import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, History, Trash2, Edit3, Sparkles, ChevronRight, X, Download, Search, Keyboard } from "lucide-react";
import PipelineForm from "./components/PipelineForm.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { useToast } from "./context/ToastContext.jsx";

export default function App() {
  const [history, setHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [plannerText, setPlannerText] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showShortcuts, setShowShortcuts] = useState(false);
  const toast = useToast();
  
  // Load initial state once on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("plannerHistory") || "[]");
    setHistory(saved);
    const theme = localStorage.getItem("theme") || "light";
    setDarkMode(theme === "dark");
  }, []);

  // Persist history to localStorage only when it changes
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("plannerHistory", JSON.stringify(history));
    }
  }, [history]);

  // Persist theme preference
  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Memoized callback for generating content
  const onGenerate = useCallback((topic, planner) => {
    setPlannerText(planner);
    setSelectedTopic(topic);
    setHistory((prev) => {
      const updated = [topic, ...prev.filter((t) => t !== topic)].slice(0, 20);
      return updated;
    });
    toast.success("Content planner generated successfully!", 3000);
  }, [toast]);

  const onSelectTopic = useCallback((topic) => {
    setSelectedTopic(topic);
    setPlannerText("");
    setSidebarOpen(false);
  }, []);

  const startEditing = useCallback((index, currentName) => {
    setEditingIndex(index);
    setEditValue(currentName);
  }, []);

  const saveEdit = useCallback(() => {
    if (editingIndex !== null && editValue.trim()) {
      setHistory((prev) => {
        const cloned = [...prev];
        cloned[editingIndex] = editValue.trim();
        return cloned;
      });
    }
    setEditingIndex(null);
    setEditValue("");
  }, [editingIndex, editValue]);

  const cancelEdit = useCallback(() => {
    setEditingIndex(null);
    setEditValue("");
  }, []);

  const onDelete = useCallback((index) => {
    setHistory((prev) => prev.filter((_, i) => i !== index));
    toast.info("Item deleted", 2000);
  }, [toast]);

  const onClearHistory = useCallback(() => {
    setHistory([]);
    toast.info("History cleared", 2000);
  }, [toast]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + K for search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
      }
      // Ctrl/Cmd + H for history sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        setSidebarOpen(prev => !prev);
      }
      // Ctrl/Cmd + D for dark mode toggle
      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && !e.shiftKey) {
        e.preventDefault();
        setDarkMode(prev => !prev);
      }
      // ? for keyboard shortcuts modal
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowShortcuts(prev => !prev);
      }
      // Escape to close modals
      if (e.key === 'Escape') {
        setShowShortcuts(false);
        setEditingIndex(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Memoized container classes to avoid recomputation
  const containerBg = useMemo(
    () => (darkMode 
      ? "bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-gray-100" 
      : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-900"),
    [darkMode]
  );

  const sidebarBg = useMemo(
    () => (darkMode ? "bg-gray-800/95" : "bg-white/90"),
    [darkMode]
  );

  const historyItemBg = useMemo(
    () => (darkMode ? "bg-gray-700/80 hover:bg-gray-600/80" : "bg-white/80 hover:bg-indigo-50/80"),
    [darkMode]
  );

  // Filtered history based on search query
  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return history;
    return history.filter(item => 
      item.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [history, searchQuery]);

  // Export planner to PDF/text
  const handleExport = useCallback(() => {
    if (!plannerText) {
      toast.error("No content to export", 2000);
      return;
    }
    const blob = new Blob([`# Content Planner: ${selectedTopic}\n\n${plannerText}`], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `planner-${selectedTopic.replace(/\s+/g, '-').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Planner exported successfully!", 3000);
  }, [plannerText, selectedTopic, toast]);

  return (
    <div className={`min-h-screen ${containerBg} flex transition-all duration-500`}>
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        className={`fixed md:relative z-50 w-80 p-6 flex flex-col gap-4 ${sidebarBg} glass shadow-2xl h-full transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        initial={false}
        animate={{ x: sidebarOpen || window.innerWidth >= 768 ? 0 : -320 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-6 h-6 text-indigo-500" />
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">History</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowShortcuts(true)}
              className="p-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Keyboard shortcuts"
              title="Keyboard Shortcuts (?)"
            >
              <Keyboard className="w-5 h-5 text-gray-500" />
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              aria-label="Toggle dark mode"
              title="Toggle Theme (Ctrl+D)"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            id="search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search history... (Ctrl+K)"
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              darkMode 
                ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400" 
                : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"
            }`}
          />
        </div>

        <div className="flex-1 overflow-auto pr-2">
          {filteredHistory.length === 0 && searchQuery && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm opacity-60 text-center py-8"
            >
              No results found for "{searchQuery}"
            </motion.p>
          )}
          {history.length === 0 && !searchQuery && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm opacity-60 text-center py-8"
            >
              No history yet. Start creating!
            </motion.p>
          )}
          <div className="space-y-2 mt-2">
            <AnimatePresence>
              {filteredHistory.map((t, i) => (
                <motion.div
                  key={`${i}-${t}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className={`group flex items-center justify-between p-3 rounded-xl ${historyItemBg} backdrop-blur-sm border border-transparent hover:border-indigo-300 transition-all`}
                >
                  {editingIndex === i ? (
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit();
                          if (e.key === 'Escape') cancelEdit();
                        }}
                        className="flex-1 px-2 py-1 rounded bg-white/90 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        autoFocus
                      />
                      <button onClick={saveEdit} className="text-green-500 hover:text-green-600">✓</button>
                      <button onClick={cancelEdit} className="text-red-500 hover:text-red-600"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <>
                      <button 
                        className="text-left flex-1 truncate hover:text-indigo-500 transition-colors font-medium" 
                        onClick={() => onSelectTopic(t)}
                        title={t}
                      >
                        {t}
                      </button>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => startEditing(i, t)}
                          className="p-1.5 rounded-lg hover:bg-indigo-100 dark:hover:bg-gray-600 transition-colors"
                          aria-label="Rename"
                        >
                          <Edit3 className="w-4 h-4 text-indigo-500" />
                        </button>
                        <button 
                          onClick={() => onDelete(i)} 
                          className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {history.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <button 
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all" 
              onClick={onClearHistory}
            >
              <Trash2 className="w-4 h-4" />
              Clear History
            </button>
          </motion.div>
        )}
      </motion.aside>

      {/* Main */}
      <main className="flex-1 p-6 flex flex-col items-center relative">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden absolute top-4 left-4 p-2 rounded-lg bg-white/80 dark:bg-gray-800/80 shadow-lg"
          aria-label="Open sidebar"
        >
          <History className="w-6 h-6 text-indigo-500" />
        </button>

        <div className="w-full max-w-4xl">
          {/* Export button */}
          {plannerText && (
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex justify-end mb-4"
            >
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                <Download className="w-4 h-4" />
                <span>Export Planner</span>
              </button>
            </motion.div>
          )}
          
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <PipelineForm initialTopic={selectedTopic} onResult={onGenerate} darkMode={darkMode} />
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Dashboard planner={plannerText} darkMode={darkMode} />
          </motion.div>
        </div>
      </main>

      {/* Keyboard Shortcuts Modal */}
      <AnimatePresence>
        {showShortcuts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
            onClick={() => setShowShortcuts(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`max-w-md w-full rounded-2xl p-6 shadow-2xl ${
                darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                  Keyboard Shortcuts
                </h3>
                <button
                  onClick={() => setShowShortcuts(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <span className="text-sm">Search History</span>
                  <kbd className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-600 text-xs font-mono">Ctrl+K</kbd>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <span className="text-sm">Toggle Sidebar</span>
                  <kbd className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-600 text-xs font-mono">Ctrl+H</kbd>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <span className="text-sm">Toggle Dark Mode</span>
                  <kbd className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-600 text-xs font-mono">Ctrl+D</kbd>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <span className="text-sm">Show Shortcuts</span>
                  <kbd className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-600 text-xs font-mono">?</kbd>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <span className="text-sm">Close Modal/Cancel Edit</span>
                  <kbd className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-600 text-xs font-mono">Esc</kbd>
                </div>
              </div>
              <p className="mt-4 text-xs text-center opacity-60">
                Press <kbd className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-600 text-xs font-mono">?</kbd> anytime to toggle this help
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
