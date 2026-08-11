import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import StatusBadge from '../employees/StatusBadge';
import Skeleton from '../ui/Skeleton';
import { formatDate } from '../../lib/utils';

function RecentEmployees({ employees, departments, loading }) {
  const departmentName = (id) =>
    departments.find((department) => department.id === id)?.name || '—';

  return (
    <Card className="flex h-full flex-col">
      <Card.Header
        title="Recent hires"
        subtitle="Latest people added to the team"
        actions={
          <Link
            to="/employees"
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
          >
            View all <ArrowRight className="size-3.5" />
          </Link>
        }
      />
      <Card.Body className="flex-1">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : employees.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-500">
            No employees yet.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {[...employees]
              .sort((a, b) => new Date(b.joiningDate) - new Date(a.joiningDate))
              .map((employee) => (
              <li key={employee.id}>
                <Link
                  to={`/employees/${employee.id}`}
                  className="flex items-center gap-3 rounded-lg px-1 py-2.5 transition-colors hover:bg-slate-50"
                >
                  <Avatar name={employee.name} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {employee.name}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {employee.position} · {departmentName(employee.departmentId)}
                    </p>
                  </div>
                  <div className="hidden text-right sm:block">
                    <StatusBadge status={employee.status} />
                    <p className="mt-1 text-[11px] text-slate-400">
                      {formatDate(employee.joiningDate)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card.Body>
    </Card>
  );
}

export default RecentEmployees;
