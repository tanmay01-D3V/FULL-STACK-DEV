import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAsyncData } from '../hooks/useAsyncData';
import { employeeService } from '../services/employeeService';
import { departmentService } from '../services/departmentService';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import EmployeeForm from '../components/employees/EmployeeForm';
import ErrorState from '../components/ui/ErrorState';
import { useToast } from '../context/ToastContext';

function AddEmployeePage() {
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const { data: departments = [], loading, error } = useAsyncData(() =>
    departmentService.list(),
  );

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      const employee = await employeeService.create(data);
      success(`${employee.name} was added to the team.`);
      navigate(`/employees/${employee.id}`);
    } catch (err) {
      toastError(err.message || 'Failed to create employee.');
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to="/employees"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
      >
        <ArrowLeft className="size-4" />
        Back to employees
      </Link>

      <PageHeader
        title="Add employee"
        description="Create a new employee profile and add them to a department."
      />

      <Card>
        <Card.Body>
          {error ? (
            <ErrorState message={error} />
          ) : (
            <EmployeeForm
              departments={departments}
              isSubmitting={submitting}
              onSubmit={handleSubmit}
            />
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

export default AddEmployeePage;
