import { useEffect, useState } from 'react';
import {
  Building2,
  Palette,
  Bell,
  ShieldCheck,
  Server,
  CheckCircle2,
  XCircle,
  Loader2,
  Save,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Toggle from '../components/ui/Toggle';
import Button from '../components/ui/Button';
import { useToast } from '../context/ToastContext';
import { api, getApiBase } from '../services/api';
import { cn } from '../lib/utils';

const ACCENT_COLORS = [
  { name: 'Indigo', value: 'bg-indigo-600', ring: 'ring-indigo-600' },
  { name: 'Violet', value: 'bg-violet-600', ring: 'ring-violet-600' },
  { name: 'Emerald', value: 'bg-emerald-600', ring: 'ring-emerald-600' },
  { name: 'Sky', value: 'bg-sky-600', ring: 'ring-sky-600' },
  { name: 'Rose', value: 'bg-rose-600', ring: 'ring-rose-600' },
];

function SectionCard({ icon: Icon, title, description, children }) {
  return (
    <Card>
      <Card.Header
        title={
          <span className="flex items-center gap-2">
            <Icon className="size-4 text-slate-400" />
            {title}
          </span>
        }
        subtitle={description}
      />
      <Card.Body>{children}</Card.Body>
    </Card>
  );
}

function SettingsPage() {
  const { success, error: toastError } = useToast();
  const [connection, setConnection] = useState({
    state: 'checking',
    message: '',
  });

  useEffect(() => {
    let active = true;
    api
      .get('/employees')
      .then(() => {
        if (active) setConnection({ state: 'online', message: '' });
      })
      .catch((err) => {
        if (active) {
          setConnection({ state: 'offline', message: err.message });
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const [org, setOrg] = useState({
    name: 'PeoplePilot Inc.',
    website: 'peoplepilot.io',
    email: 'hr@peoplepilot.io',
    industry: 'Technology',
  });
  const [preferences, setPreferences] = useState({
    timezone: 'US/Pacific',
    dateFormat: 'MMM D, YYYY',
    currency: 'USD',
    accent: 'Indigo',
  });
  const [notifications, setNotifications] = useState({
    emailDigest: true,
    attendanceAlerts: true,
    newHires: true,
    payrollReminders: false,
  });
  const [password, setPassword] = useState({
    current: '',
    next: '',
    confirm: '',
  });

  const handleOrgSave = (event) => {
    event.preventDefault();
    success('Organization settings saved.');
  };

  const handlePasswordChange = (event) => {
    event.preventDefault();
    if (password.next.length < 6) {
      toastError('New password must be at least 6 characters.');
      return;
    }
    if (password.next !== password.confirm) {
      toastError('New passwords do not match.');
      return;
    }
    success('Password updated successfully.');
    setPassword({ current: '', next: '', confirm: '' });
  };

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Settings"
        description="Manage your organization profile, preferences and security."
      />

      <div className="space-y-6">
        <SectionCard
          icon={Building2}
          title="Organization"
          description="Basic information about your company."
        >
          <form onSubmit={handleOrgSave} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Company name"
                value={org.name}
                onChange={(event) =>
                  setOrg((prev) => ({ ...prev, name: event.target.value }))
                }
              />
              <Input
                label="Website"
                value={org.website}
                onChange={(event) =>
                  setOrg((prev) => ({ ...prev, website: event.target.value }))
                }
              />
              <Input
                label="HR contact email"
                type="email"
                value={org.email}
                onChange={(event) =>
                  setOrg((prev) => ({ ...prev, email: event.target.value }))
                }
              />
              <Input
                label="Industry"
                value={org.industry}
                onChange={(event) =>
                  setOrg((prev) => ({ ...prev, industry: event.target.value }))
                }
              />
            </div>
            <Button type="submit" leftIcon={Save}>
              Save organization
            </Button>
          </form>
        </SectionCard>

        <SectionCard
          icon={Palette}
          title="Preferences"
          description="Regional and display preferences."
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Select
              label="Timezone"
              value={preferences.timezone}
              onChange={(event) =>
                setPreferences((prev) => ({
                  ...prev,
                  timezone: event.target.value,
                }))
              }
            >
              <option value="US/Pacific">US/Pacific</option>
              <option value="US/Eastern">US/Eastern</option>
              <option value="Europe/London">Europe/London</option>
              <option value="Asia/Singapore">Asia/Singapore</option>
              <option value="Australia/Sydney">Australia/Sydney</option>
            </Select>
            <Select
              label="Date format"
              value={preferences.dateFormat}
              onChange={(event) =>
                setPreferences((prev) => ({
                  ...prev,
                  dateFormat: event.target.value,
                }))
              }
            >
              <option value="MMM D, YYYY">Aug 11, 2026</option>
              <option value="MM/DD/YYYY">08/11/2026</option>
              <option value="DD/MM/YYYY">11/08/2026</option>
            </Select>
            <Select
              label="Currency"
              value={preferences.currency}
              onChange={(event) =>
                setPreferences((prev) => ({
                  ...prev,
                  currency: event.target.value,
                }))
              }
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
            </Select>
          </div>

          <div className="mt-5">
            <p className="mb-2 text-sm font-medium text-slate-700">
              Accent color
            </p>
            <div className="flex items-center gap-3">
              {ACCENT_COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() =>
                    setPreferences((prev) => ({ ...prev, accent: color.name }))
                  }
                  aria-label={`Use ${color.name} accent`}
                  className={cn(
                    'size-8 rounded-full transition-all hover:scale-110',
                    color.value,
                    preferences.accent === color.name &&
                      `ring-2 ring-offset-2 ${color.ring}`,
                  )}
                />
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard
          icon={Bell}
          title="Notifications"
          description="Choose what updates you want to receive."
        >
          <div className="divide-y divide-slate-100">
            <Toggle
              label="Weekly email digest"
              description="A summary of org activity every Monday."
              checked={notifications.emailDigest}
              onChange={(value) =>
                setNotifications((prev) => ({
                  ...prev,
                  emailDigest: value,
                }))
              }
            />
            <Toggle
              label="Attendance alerts"
              description="Get notified when attendance is unusually low."
              checked={notifications.attendanceAlerts}
              onChange={(value) =>
                setNotifications((prev) => ({
                  ...prev,
                  attendanceAlerts: value,
                }))
              }
            />
            <Toggle
              label="New hire notifications"
              description="Be alerted when a new employee joins."
              checked={notifications.newHires}
              onChange={(value) =>
                setNotifications((prev) => ({
                  ...prev,
                  newHires: value,
                }))
              }
            />
            <Toggle
              label="Payroll reminders"
              description="Reminders before payroll runs."
              checked={notifications.payrollReminders}
              onChange={(value) =>
                setNotifications((prev) => ({
                  ...prev,
                  payrollReminders: value,
                }))
              }
            />
          </div>
        </SectionCard>

        <SectionCard
          icon={ShieldCheck}
          title="Security"
          description="Update your password to keep your account secure."
        >
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Input
                label="Current password"
                type="password"
                value={password.current}
                onChange={(event) =>
                  setPassword((prev) => ({
                    ...prev,
                    current: event.target.value,
                  }))
                }
                autoComplete="current-password"
              />
              <Input
                label="New password"
                type="password"
                value={password.next}
                onChange={(event) =>
                  setPassword((prev) => ({
                    ...prev,
                    next: event.target.value,
                  }))
                }
                autoComplete="new-password"
              />
              <Input
                label="Confirm new password"
                type="password"
                value={password.confirm}
                onChange={(event) =>
                  setPassword((prev) => ({
                    ...prev,
                    confirm: event.target.value,
                  }))
                }
                autoComplete="new-password"
              />
            </div>
            <Button type="submit" variant="secondary" leftIcon={Save}>
              Update password
            </Button>
          </form>
        </SectionCard>

        <SectionCard
          icon={Server}
          title="Backend integration"
          description="Connection between this app and the employee API."
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900">
                API base URL
              </p>
              <p className="mt-0.5 truncate font-mono text-xs text-slate-500">
                {getApiBase()}
              </p>
            </div>
            {connection.state === 'checking' && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                <Loader2 className="size-3.5 animate-spin" />
                Checking…
              </span>
            )}
            {connection.state === 'online' && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="size-3.5" />
                Connected
              </span>
            )}
            {connection.state === 'offline' && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700">
                <XCircle className="size-3.5" />
                Offline
              </span>
            )}
          </div>
          {connection.state === 'offline' && (
            <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {connection.message} Make sure the backend is running, then reload
              this page.
            </p>
          )}
        </SectionCard>
      </div>
    </div>
  );
}

export default SettingsPage;
