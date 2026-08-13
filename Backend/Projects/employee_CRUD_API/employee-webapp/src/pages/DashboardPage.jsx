import { Link } from 'react-router-dom';
import {
  Users,
  UserCheck,
  Building2,
  CalendarCheck2,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';
import { useAsyncData } from '../hooks/useAsyncData';
import { employeeService } from '../services/employeeService';
import { departmentService } from '../services/departmentService';
import { attendanceService } from '../services/attendanceService';
import { employeeGrowth } from '../data/seed';
import StatCard from '../components/ui/StatCard';
import Card from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import GrowthChart from '../components/charts/GrowthChart';
import DepartmentBreakdown from '../components/dashboard/DepartmentBreakdown';
import RecentEmployees from '../components/dashboard/RecentEmployees';
import { todayISO } from '../lib/utils';

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-[120px] rounded-xl" />
      ))}
    </div>
  );
}

function DashboardPage() {
  const { data: employees = [], loading, error, reload } = useAsyncData(
    () => employeeService.list(),
  );
  const { data: departments = [], loading: departmentsLoading } =
    useAsyncData(() => departmentService.list());
  const { data: attendance, loading: attendanceLoading } = useAsyncData(() =>
    attendanceService.getForDate(todayISO()),
  );

  const loadingAny = loading || departmentsLoading || attendanceLoading;

  const activeCount = employees.filter(
    (employee) => employee.status === 'active',
  ).length;
  const probationCount = employees.filter(
    (employee) => employee.status === 'probation',
  ).length;

  const present = (attendance || []).filter(
    (record) => record.status === 'present' || record.status === 'late',
  ).length;

  const growthTotal = employeeGrowth.reduce((sum, point) => sum + point.count, 0);

  if (error) {
    return <ErrorState message={error} onRetry={reload} />;
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="An overview of your organization."
        actions={
          <Link to="/employees/new">
            <Button leftIcon={ArrowUpRight}>Add employee</Button>
          </Link>
        }
      />

      {loadingAny ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Users}
            label="Total employees"
            value={employees.length}
            delta={`${growthTotal} hired in 12 months`}
            deltaTone="up"
          />
          <StatCard
            icon={UserCheck}
            label="Active employees"
            value={activeCount}
            delta={`${probationCount} in probation`}
            deltaTone="up"
          />
          <StatCard
            icon={Building2}
            label="Departments"
            value={departments.length}
            delta="Across the org"
          />
          <StatCard
            icon={CalendarCheck2}
            label="Today's attendance"
            value={
              attendanceLoading || !attendance
                ? '—'
                : `${present}/${employees.length}`
            }
            delta="Present today"
            deltaTone="up"
          />
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <Card.Header
            title="Employee growth"
            subtitle="New hires over the last 12 months"
            actions={
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                <TrendingUp className="size-3.5" />
                +{employeeGrowth[employeeGrowth.length - 1].count} this month
              </span>
            }
          />
          <Card.Body>
            {loading ? (
              <Skeleton className="h-[240px] w-full" />
            ) : (
              <GrowthChart data={employeeGrowth} />
            )}
          </Card.Body>
        </Card>

        <DepartmentBreakdown
          departments={departments}
          loading={departmentsLoading}
        />
      </div>

      <div className="mt-6">
        <RecentEmployees
          employees={employees.slice(0, 6)}
          departments={departments}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default DashboardPage;
