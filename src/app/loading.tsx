export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white p-8 max-w-7xl mx-auto flex flex-col gap-6 animate-pulse">
      <div className="h-16 bg-zinc-900 rounded-xl" />
      <div className="h-44 bg-zinc-900 rounded-2xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-96 bg-zinc-900 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
