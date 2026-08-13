import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Mail,
  Phone,
  Building2,
  Briefcase,
  CalendarDays,
  Hash,
  Wallet,
  BadgeCheck,
} from 'lucide-react';
import { useState } from 'react';
import { useAsyncData } from '../hooks/useAsyncData';
import { employeeService } from '../services/employeeService';
import { departmentService } from '../services/departmentService';
import Avatar from '../components/ui/Avatar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import StatusBadge from '../components/employees/StatusBadge';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import ErrorState from '../components/ui/ErrorState';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { useToast } from '../context/ToastContext';
import { formatCurrency, formatDate } from '../lib/utils';

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p className="mt-0.5 break-words text-sm font-medium text-slate-900">
          {value || '—'}
        </p>
      </div>
    </div>
  );
}

function DetailsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-40 w-full rounded-xl" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    </div>
  );
}

function EmployeeDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { data: employee, loading, error } = useAsyncData(() =>
    employeeService.get(id),
  );
  const { data: departments = [] } = useAsyncData(() => departmentService.list());

  const department = departments.find(
    (department) => department.id === employee?.departmentId,
  );

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await employeeService.remove(employee.id);
      success(`${employee.name} was removed.`);
      navigate('/employees');
    } catch (err) {
      toastError(err.message || 'Failed to delete employee.');
      setDeleteOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <DetailsSkeleton />;

  if (error || !employee) {
    return (
      <div className="mx-auto max-w-lg">
        <EmptyState
          icon={BadgeCheck}
          title="Employee not found"
          description="The employee you're looking for doesn't exist or may have been removed."
          actionLabel="Back to employees"
          onAction={() => navigate('/employees')}
        />
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
      >
        <ArrowLeft className="size-4" />
        Back
      </button>

      <Card className="overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-indigo-600 to-violet-600" />
        <div className="px-6 pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <Avatar
                name={employee.name}
                size="xl"
                className="-mt-10 ring-4 ring-white"
              />
              <div className="pb-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-xl font-bold tracking-tight text-slate-900">
                    {employee.name}
                  </h1>
                  <StatusBadge status={employee.status} />
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {employee.position}
                  <span className="mx-2 text-slate-300">·</span>
                  <span className="font-mono text-xs">{employee.employeeId}</span>
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Link to={`/employees/${employee.id}/edit`}>
                <Button variant="secondary" leftIcon={Pencil}>
                  Edit
                </Button>
              </Link>
              <Button
                variant="danger"
                leftIcon={Trash2}
                onClick={() => setDeleteOpen(true)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <Card.Header title="Contact information" />
          <Card.Body className="space-y-4">
            <InfoRow
              icon={Mail}
              label="Email"
              value={
                <a
                  href={`mailto:${employee.email}`}
                  className="text-indigo-600 hover:text-indigo-700"
                >
                  {employee.email}
                </a>
              }
            />
            <InfoRow icon={Phone} label="Phone" value={employee.phone} />
            <InfoRow icon={Hash} label="Employee ID" value={employee.employeeId} />
          </Card.Body>
        </Card>

        <Card>
          <Card.Header title="Employment details" />
          <Card.Body className="space-y-4">
            <InfoRow
              icon={Building2}
              label="Department"
              value={department?.name || '—'}
            />
            <InfoRow icon={Briefcase} label="Position" value={employee.position} />
            <InfoRow
              icon={CalendarDays}
              label="Joining date"
              value={formatDate(employee.joiningDate)}
            />
          </Card.Body>
        </Card>

        <Card className="lg:col-span-2">
          <Card.Header
            title="Compensation"
            actions={
              <Link
                to={`/employees/${employee.id}/edit`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                <Pencil className="size-3.5" />
                Update
              </Link>
            }
          />
          <Card.Body className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
                <Wallet className="size-3.5" />
                Annual salary
              </p>
              <p className="mt-1.5 text-xl font-bold text-slate-900">
                {formatCurrency(employee.salary)}
              </p>
            </div>
            <div>
              <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
                <CalendarDays className="size-3.5" />
                Pay frequency
              </p>
              <p className="mt-1.5 text-xl font-bold text-slate-900">Monthly</p>
            </div>
            <div>
              <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
                <BadgeCheck className="size-3.5" />
                Employment type
              </p>
              <p className="mt-1.5 text-xl font-bold text-slate-900">Full-time</p>
            </div>
          </Card.Body>
        </Card>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete employee"
        message={`This will permanently delete ${employee.name}'s profile and attendance records. This action cannot be undone.`}
        confirmLabel="Delete employee"
        isLoading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  );
}

export default EmployeeDetailsPage;
