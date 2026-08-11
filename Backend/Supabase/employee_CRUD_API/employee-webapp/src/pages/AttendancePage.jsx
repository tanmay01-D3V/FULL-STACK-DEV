import { useMemo, useState } from 'react';
import {
  CalendarCheck2,
  Clock4,
  UserX,
  Plane,
  Download,
} from 'lucide-react';
import { useAsyncData } from '../hooks/useAsyncData';
import { attendanceService } from '../services/attendanceService';
import { employeeService } from '../services/employeeService';
import { departmentService } from '../services/departmentService';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import Avatar from '../components/ui/Avatar';
import Skeleton from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import SearchInput from '../components/ui/SearchInput';
import Button from '../components/ui/Button';
import StatCard from '../components/ui/StatCard';
import EmptyState from '../components/ui/EmptyState';
import AttendanceBadge from '../components/employees/AttendanceBadge';
import { formatTime, todayISO } from '../lib/utils';
import { useToast } from '../context/ToastContext';

function AttendancePage() {
  const { info } = useToast();
  const [date, setDate] = useState(todayISO());
  const [search, setSearch] = useState('');

  const { data: records = [], loading, error, reload } = useAsyncData(
    () => attendanceService.getForDate(date),
    [date],
  );
  const { data: employees = [] } = useAsyncData(() => employeeService.list());
  const { data: departments = [] } = useAsyncData(() => departmentService.list());

  const employeeById = useMemo(
    () => new Map(employees.map((employee) => [employee.id, employee])),
    [employees],
  );
  const departmentName = (id) =>
    departments.find((department) => department.id === id)?.name || '—';

  const stats = useMemo(() => {
    const result = {
      present: 0,
      late: 0,
      on_leave: 0,
      absent: 0,
    };
    records.forEach((record) => {
      result[record.status] += 1;
    });
    return result;
  }, [records]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return records;
    return records.filter((record) => {
      const employee = employeeById.get(record.employeeId);
      return (
        employee &&
        (employee.name.toLowerCase().includes(query) ||
          employee.email.toLowerCase().includes(query) ||
          employee.employeeId.toLowerCase().includes(query))
      );
    });
  }, [records, search, employeeById]);

  const sorted = [...filtered].sort((a, b) => {
    const nameA = employeeById.get(a.employeeId)?.name || '';
    const nameB = employeeById.get(b.employeeId)?.name || '';
    return nameA.localeCompare(nameB);
  });

  const dateLabel = new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div>
      <PageHeader
        title="Attendance"
        description="Daily check-ins and attendance across the organization."
        actions={
          <Button
            variant="secondary"
            leftIcon={Download}
            onClick={() =>
              info(`Attendance report for ${date} exported successfully.`)
            }
          >
            Export
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={CalendarCheck2}
          label="Present"
          value={loading ? '—' : stats.present}
        />
        <StatCard
          icon={Clock4}
          label="Late"
          value={loading ? '—' : stats.late}
        />
        <StatCard
          icon={Plane}
          label="On leave"
          value={loading ? '—' : stats.on_leave}
        />
        <StatCard
          icon={UserX}
          label="Absent"
          value={loading ? '—' : stats.absent}
        />
      </div>

      <Card className="mt-6">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">{dateLabel}</h3>
            <p className="mt-0.5 text-xs text-slate-500">
              {loading ? 'Loading records…' : `${records.length} employees scheduled`}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="date"
              value={date}
              max={todayISO()}
              onChange={(event) => setDate(event.target.value)}
              aria-label="Select attendance date"
              className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search employees..."
              className="w-full sm:w-56"
            />
          </div>
        </div>

        {error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : loading ? (
          <Table>
            <Table.Head>
              <Table.Th>Employee</Table.Th>
              <Table.Th>Department</Table.Th>
              <Table.Th>Check-in</Table.Th>
              <Table.Th>Check-out</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Head>
            <Table.Body>
              {Array.from({ length: 6 }).map((_, index) => (
                <Table.Row key={index}>
                  <Table.Cell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="size-10 rounded-full" />
                      <div className="space-y-1.5">
                        <Skeleton className="h-3.5 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Skeleton className="h-3.5 w-24" />
                  </Table.Cell>
                  <Table.Cell>
                    <Skeleton className="h-3.5 w-16" />
                  </Table.Cell>
                  <Table.Cell>
                    <Skeleton className="h-3.5 w-16" />
                  </Table.Cell>
                  <Table.Cell>
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        ) : sorted.length === 0 ? (
          <EmptyState
            title="No attendance records"
            description={
              search
                ? 'No employees match your search for this day.'
                : 'There are no attendance records for the selected date.'
            }
          />
        ) : (
          <Table>
            <Table.Head>
              <Table.Th>Employee</Table.Th>
              <Table.Th>Department</Table.Th>
              <Table.Th>Check-in</Table.Th>
              <Table.Th>Check-out</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Head>
            <Table.Body>
              {sorted.map((record) => {
                const employee = employeeById.get(record.employeeId);
                if (!employee) return null;
                return (
                  <Table.Row key={`${date}-${record.employeeId}`}>
                    <Table.Cell>
                      <div className="flex items-center gap-3">
                        <Avatar name={employee.name} size="md" />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-slate-900">
                            {employee.name}
                          </p>
                          <p className="truncate font-mono text-xs text-slate-400">
                            {employee.employeeId}
                          </p>
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-slate-600">
                        {departmentName(employee.departmentId)}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="font-medium text-slate-700">
                        {formatTime(record.checkIn)}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="font-medium text-slate-700">
                        {formatTime(record.checkOut)}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <AttendanceBadge status={record.status} />
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        )}
      </Card>
    </div>
  );
}

export default AttendancePage;
