import Card from '../ui/Card';
import Skeleton from '../ui/Skeleton';

function DepartmentBreakdown({ departments, loading }) {
  const max = Math.max(...departments.map((department) => department.headcount), 1);

  return (
    <Card>
      <Card.Header
        title="Headcount by department"
        subtitle="Distribution across teams"
      />
      <Card.Body>
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-4 w-full" />
            ))}
          </div>
        ) : (
          <ul className="space-y-4">
            {departments.map((department) => (
              <li key={department.id}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">
                    {department.name}
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    {department.headcount}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-indigo-500 transition-all"
                    style={{
                      width: `${Math.max(
                        (department.headcount / max) * 100,
                        department.headcount > 0 ? 8 : 0,
                      )}%`,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card.Body>
    </Card>
  );
}

export default DepartmentBreakdown;
