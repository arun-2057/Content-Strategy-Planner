import ResultCard from "../components/ResultCard.jsx";

export default function Dashboard({ planner }) {
  if (!planner) {
    return null;
  }
  return (
    <section className="mt-6">
      <ResultCard title="Generated Planner">
        {planner}
      </ResultCard>
    </section>
  );
}
