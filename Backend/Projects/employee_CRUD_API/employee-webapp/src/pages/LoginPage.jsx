import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Users,
  ShieldCheck,
  BarChart3,
  Globe2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const FEATURES = [
  { icon: Users, title: 'Employee directory', text: 'Manage profiles, roles and compensation from one place.' },
  { icon: BarChart3, title: 'Live insights', text: 'Track headcount, growth and attendance at a glance.' },
  { icon: ShieldCheck, title: 'Secure access', text: 'Role-based access controls keep your data safe.' },
  { icon: Globe2, title: 'Works everywhere', text: 'Fully responsive — desktop, tablet and mobile.' },
];

function LoginPage() {
  const { login } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};

    if (!email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = 'Enter a valid email address.';
    }
    if (!password) nextErrors.password = 'Password is required.';
    if (password && password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    const name = email.split('@')[0].replace(/[._]/g, ' ');
    login(email, name);
    success(`Welcome back, ${name}!`);
    navigate(from, { replace: true });
  };

  const handleDemo = () => {
    setEmail('admin@peoplepilot.io');
    setPassword('demo1234');
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="hidden w-1/2 flex-col justify-between overflow-hidden bg-slate-900 p-12 lg:flex">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex size-10 items-center justify-center rounded-xl bg-indigo-500 text-white">
            <Users className="size-5" />
          </span>
          <div className="leading-tight">
            <p className="text-base font-bold text-white">PeoplePilot</p>
            <p className="text-xs font-medium text-slate-400">
              Employee Management System
            </p>
          </div>
        </div>

        <div className="max-w-md">
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-white">
            Run your people operations like a well-oiled machine.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            Everything HR needs to manage employees, departments and attendance
            in one modern workspace.
          </p>

          <ul className="mt-10 space-y-6">
            {FEATURES.map((feature) => (
              <li key={feature.title} className="flex items-start gap-4">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-indigo-300">
                  <feature.icon className="size-4.5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {feature.title}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-400">
                    {feature.text}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} PeoplePilot Inc. All rights reserved.
        </p>
      </div>

      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <Users className="size-5" />
            </span>
            <div className="leading-tight">
              <p className="text-base font-bold text-slate-900">PeoplePilot</p>
              <p className="text-xs font-medium text-slate-500">
                Employee Management
              </p>
            </div>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Sign in to your account
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Enter your credentials to access the dashboard.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            <Input
              label="Email address"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              error={errors.email}
              autoComplete="email"
            />
            <div>
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  error={errors.password}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-[34px] text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex cursor-pointer items-center gap-2 text-slate-600">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                  className="size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                Remember me
              </label>
              <button
                type="button"
                className="font-medium text-indigo-600 hover:text-indigo-700"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              isLoading={submitting}
              disabled={submitting}
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-500">
              Demo credentials — any email works. Try:
            </p>
            <button
              onClick={handleDemo}
              className="mt-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              admin@peoplepilot.io / demo1234
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don&apos;t have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Contact your administrator
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
