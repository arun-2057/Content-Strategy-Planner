import { motion } from "framer-motion";
import ResultCard from "../components/ResultCard.jsx";

export default function Dashboard({ planner, darkMode = false }) {
  if (!planner) {
    return null;
  }
  
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8"
    >
      <ResultCard title="Generated Planner" darkMode={darkMode}>
        {planner}
      </ResultCard>
    </motion.section>
  );
}
