import { FileText } from "lucide-react";

export default function ResultCard({ title, children, darkMode = false }) {
  return (
    <div className={`rounded-2xl shadow-xl overflow-hidden backdrop-blur-xl border transition-all duration-300 ${
      darkMode 
        ? "bg-gray-800/90 border-gray-700" 
        : "bg-white/90 border-white/50"
    }`}>
      <div className="px-6 py-4 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-bold text-lg bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            {title}
          </h3>
        </div>
      </div>
      <div className={`p-6 planner-content ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
        <div className="prose prose-sm max-w-none">
          {children}
        </div>
      </div>
    </div>
  );
}
