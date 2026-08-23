import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <EmptyState
        icon="✦"
        title="Page not found"
        message="The page you're looking for doesn't exist or has moved."
        action={
          <Link to="/" className="btn-primary">
            Back to home
          </Link>
        }
      />
    </section>
  );
}
