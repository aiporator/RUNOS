import Link from 'next/link';

// Placeholder — replaced by the full marketing homepage.
export default function Home() {
  return (
    <main className="grid min-h-screen place-items-center">
      <div className="text-center">
        <h1 className="font-display text-5xl font-bold">RunOS</h1>
        <p className="mt-3 text-muted">The operating system for running communities.</p>
        <Link href="/app" className="mt-6 inline-block rounded-full bg-volt px-6 py-3 font-display font-semibold text-ink">
          Open the app →
        </Link>
      </div>
    </main>
  );
}
