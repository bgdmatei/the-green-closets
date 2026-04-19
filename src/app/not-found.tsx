import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="text-zinc-600">The page you requested does not exist or is unavailable.</p>
      <Link className="text-blue-700 hover:underline" href="/en">
        Go to homepage
      </Link>
    </div>
  );
}
