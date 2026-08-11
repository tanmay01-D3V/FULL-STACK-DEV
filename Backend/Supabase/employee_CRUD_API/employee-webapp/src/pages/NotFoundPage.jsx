import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <span className="inline-flex size-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
        <Compass className="size-8" />
      </span>
      <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-indigo-600">
        404 error
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-500">
        Sorry, the page you are looking for doesn't exist or has been moved.
        Let's get you back to the dashboard.
      </p>
      <Link to="/" className="mt-6">
        <Button>Back to dashboard</Button>
      </Link>
    </div>
  );
}

export default NotFoundPage;
