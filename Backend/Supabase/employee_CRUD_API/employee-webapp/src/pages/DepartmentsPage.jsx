import { Building2, Users } from 'lucide-react';
import { useAsyncData } from '../hooks/useAsyncData';
import { departmentService } from '../services/departmentService';
import { employeeService } from '../services/employeeService';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Avatar from '../components/ui/Avatar';
import Skeleton from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';

function DepartmentCard({ department, employees }) {
  const members = employees
    .filter((employee) => employee.departmentId === department.id)
    .slice(0, 4);

  return (
    <Card className="flex flex-col p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <span className="inline-flex size-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Building2 className="size-5" />
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
          <Users className="size-3.5" />
          {department.headcount}
        </span>
      </div>

      <h3 className="mt-4 text-base font-semibold text-slate-900">
        {department.name}
      </h3>
      <p className="mt-1 flex-1 text-sm leading-relaxed text-slate-500">
        {department.description}
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
            Department head
          </p>
          <p className="text-sm font-medium text-slate-800">
            {department.head || '—'}
          </p>
        </div>
        {members.length > 0 && (
          <div className="flex -space-x-2">
            {members.map((member) => (
              <Avatar
                key={member.id}
                name={member.name}
                size="sm"
                className="ring-2 ring-white"
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

function DepartmentsPage() {
  const { data: departments = [], loading, error, reload } = useAsyncData(() =>
    departmentService.list(),
  );
  const { data: employees = [] } = useAsyncData(() => employeeService.list());

  return (
    <div>
      <PageHeader
        title="Departments"
        description="Headcount across the business, derived from your employee data."
      />

      {error ? (
        <Card>
          <ErrorState message={error} onRetry={reload} />
        </Card>
      ) : loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-52 rounded-xl" />
          ))}
        </div>
      ) : departments.length === 0 ? (
        <Card>
          <EmptyState
            icon={Building2}
            title="No departments yet"
            description="Add employees with a department to start organizing teams."
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {departments.map((department) => (
            <DepartmentCard
              key={department.id}
              department={department}
              employees={employees}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default DepartmentsPage;
