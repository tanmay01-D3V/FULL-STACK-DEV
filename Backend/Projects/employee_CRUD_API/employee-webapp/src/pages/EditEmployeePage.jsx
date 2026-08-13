import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAsyncData } from '../hooks/useAsyncData';
import { employeeService } from '../services/employeeService';
import { departmentService } from '../services/departmentService';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import EmployeeForm from '../components/employees/EmployeeForm';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import Skeleton from '../components/ui/Skeleton';
import { useToast } from '../context/ToastContext';

function EditEmployeePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const { data: employee, loading, error } = useAsyncData(() =>
    employeeService.get(id),
  );
  const { data: departments = [], loading: departmentsLoading } = useAsyncData(
    () => departmentService.list(),
  );

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      const updated = await employeeService.update(id, data);
      success(`${updated.name}'s profile was updated.`);
      navigate(`/employees/${id}`);
    } catch (err) {
      toastError(err.message || 'Failed to update employee.');
      setSubmitting(false);
    }
  };

  if (loading || departmentsLoading) {
    return (
      <div className="mx-auto max-w-3xl">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-4 h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="mx-auto max-w-lg">
        <EmptyState
          title="Employee not found"
          description="The employee you're trying to edit doesn't exist."
          actionLabel="Back to employees"
          onAction={() => navigate('/employees')}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to={`/employees/${employee.id}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
      >
        <ArrowLeft className="size-4" />
        Back to profile
      </Link>

      <PageHeader
        title="Edit employee"
        description="Update the employee's personal and employment details."
      />

      <Card>
        <Card.Body>
          <EmployeeForm
            key={employee.id}
            initialData={employee}
            departments={departments}
            isSubmitting={submitting}
            onSubmit={handleSubmit}
          />
        </Card.Body>
      </Card>
    </div>
  );
}

export default EditEmployeePage;
