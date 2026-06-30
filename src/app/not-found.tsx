import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0b0e]">
      <div className="text-center">
        <h1 className="mb-2 text-6xl font-bold text-zinc-700">404</h1>
        <p className="mb-6 text-lg text-zinc-400">Page not found</p>
        <Link
          href="/dashboard"
          className="inline-block rounded-xl bg-[#6d5efc] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
