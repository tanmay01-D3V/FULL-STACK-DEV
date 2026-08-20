import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="text-center">
        <p className="font-serif text-6xl text-stone-200">404</p>
        <h2 className="mt-2 text-lg font-semibold text-stone-800">Page not found</h2>
        <p className="mt-1 text-sm text-stone-500">The page you are looking for does not exist.</p>
        <Link href="/" className="btn-primary mt-6 inline-flex">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
