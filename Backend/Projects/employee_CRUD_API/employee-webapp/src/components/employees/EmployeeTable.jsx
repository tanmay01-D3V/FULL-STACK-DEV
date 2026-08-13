import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Table from '../ui/Table';
import Avatar from '../ui/Avatar';
import Skeleton from '../ui/Skeleton';
import EmptyState from '../ui/EmptyState';
import StatusBadge from './StatusBadge';
import { cn } from '../../lib/utils';

function EmployeeTable({
  employees,
  departments,
  loading,
  onEdit,
  onDelete,
  emptyAction,
}) {
  const departmentName = (id) =>
    departments.find((department) => department.id === id)?.name || '—';

  if (loading) {
    return (
      <Table>
        <Table.Head>
          <Table.Th>Employee</Table.Th>
          <Table.Th>Employee ID</Table.Th>
          <Table.Th>Department</Table.Th>
          <Table.Th>Position</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th className="text-right">Actions</Table.Th>
        </Table.Head>
        <Table.Body>
          {Array.from({ length: 8 }).map((_, index) => (
            <Table.Row key={index}>
              <Table.Cell>
                <div className="flex items-center gap-3">
                  <Skeleton className="size-10 rounded-full" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
              </Table.Cell>
              <Table.Cell>
                <Skeleton className="h-3.5 w-16" />
              </Table.Cell>
              <Table.Cell>
                <Skeleton className="h-3.5 w-24" />
              </Table.Cell>
              <Table.Cell>
                <Skeleton className="h-3.5 w-28" />
              </Table.Cell>
              <Table.Cell>
                <Skeleton className="h-5 w-16 rounded-full" />
              </Table.Cell>
              <Table.Cell>
                <Skeleton className="ml-auto h-8 w-20" />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }

  if (employees.length === 0) {
    return (
      <EmptyState
        title="No employees found"
        description="Try adjusting your search or filters, or add a new employee to get started."
        actionLabel={emptyAction?.label}
        onAction={emptyAction?.onClick}
      />
    );
  }

  return (
    <Table>
      <Table.Head>
        <Table.Th>Employee</Table.Th>
        <Table.Th>Employee ID</Table.Th>
        <Table.Th>Department</Table.Th>
        <Table.Th>Position</Table.Th>
        <Table.Th>Status</Table.Th>
        <Table.Th className="text-right">Actions</Table.Th>
      </Table.Head>
      <Table.Body>
        {employees.map((employee) => (
          <Table.Row key={employee.id}>
            <Table.Cell>
              <div className="flex items-center gap-3">
                <Link to={`/employees/${employee.id}`}>
                  <Avatar name={employee.name} size="md" />
                </Link>
                <div className="min-w-0">
                  <Link
                    to={`/employees/${employee.id}`}
                    className="block truncate font-medium text-slate-900 hover:text-indigo-600"
                  >
                    {employee.name}
                  </Link>
                  <p className="truncate text-xs text-slate-500">
                    {employee.email}
                  </p>
                </div>
              </div>
            </Table.Cell>
            <Table.Cell>
              <span className="font-mono text-xs font-medium text-slate-600">
                {employee.employeeId}
              </span>
            </Table.Cell>
            <Table.Cell>
              <span className="text-slate-600">
                {departmentName(employee.departmentId)}
              </span>
            </Table.Cell>
            <Table.Cell>
              <span className="text-slate-600">{employee.position}</span>
            </Table.Cell>
            <Table.Cell>
              <StatusBadge status={employee.status} />
            </Table.Cell>
            <Table.Cell>
              <div className="flex items-center justify-end gap-1">
                <Link
                  to={`/employees/${employee.id}`}
                  aria-label={`View ${employee.name}`}
                  className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                >
                  <Eye className="size-4" />
                </Link>
                <button
                  onClick={() => onEdit(employee)}
                  aria-label={`Edit ${employee.name}`}
                  className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  onClick={() => onDelete(employee)}
                  aria-label={`Delete ${employee.name}`}
                  className={cn(
                    'rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600',
                  )}
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

export default EmployeeTable;
