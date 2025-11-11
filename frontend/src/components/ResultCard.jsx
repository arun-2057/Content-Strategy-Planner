export default function ResultCard({ title, children }) {
  return (
    <div className="bg-white/90 rounded-xl p-4 shadow-md border">
      <h3 className="font-semibold mb-2">{title}</h3>
      <div className="text-sm whitespace-pre-wrap">{children}</div>
    </div>
  );
}
