export default function DashboardLoading() {
  return (
    <div className="flex h-screen w-screen bg-[#09090b]">
      <div className="w-12 border-r border-zinc-800 bg-[#0b0b0e]" />
      <div className="flex flex-1 flex-col">
        <div className="h-12 border-b border-zinc-800 bg-[#0b0b0e]" />
        <div className="flex flex-1">
          <div className="flex-1 bg-[#0e0e11]">
            <div className="mx-auto mt-8 max-w-3xl space-y-3 px-4">
              <div className="h-4 w-32 animate-pulse rounded bg-zinc-800" />
              <div className="h-20 animate-pulse rounded-2xl bg-zinc-800/50" />
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 w-40 animate-pulse rounded-full bg-zinc-800/30" />
                ))}
              </div>
            </div>
          </div>
          <div className="hidden w-72 border-l border-zinc-800 bg-[#0b0b0e] lg:block" />
        </div>
      </div>
    </div>
  );
}
