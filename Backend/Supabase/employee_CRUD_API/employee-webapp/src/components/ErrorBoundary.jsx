import { Component } from 'react';
import { TriangleAlert } from 'lucide-react';
import Button from './ui/Button';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'Unexpected error' };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, message: '' });
    window.location.href = '/';
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
        <span className="inline-flex size-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
          <TriangleAlert className="size-8" />
        </span>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
          Something went wrong
        </h1>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
          An unexpected error occurred while rendering this page.
          {this.state.message ? ` ${this.state.message}` : ''}
        </p>
        <Button className="mt-6" onClick={this.handleReset}>
          Reload application
        </Button>
      </div>
    );
  }
}

export default ErrorBoundary;
