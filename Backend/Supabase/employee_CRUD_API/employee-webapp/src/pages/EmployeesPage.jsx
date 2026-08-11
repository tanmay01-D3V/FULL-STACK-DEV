import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAsyncData } from '../hooks/useAsyncData';
import { employeeService } from '../services/employeeService';
import { departmentService } from '../services/departmentService';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import EmployeeTable from '../components/employees/EmployeeTable';
import EmployeeFilters from '../components/employees/EmployeeFilters';
import Pagination from '../components/ui/Pagination';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import ErrorState from '../components/ui/ErrorState';
import { useToast } from '../context/ToastContext';

const PAGE_SIZE = 8;

function EmployeesPage() {
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [search, setSearch] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { data: departments = [], loading: departmentsLoading } =
    useAsyncData(() => departmentService.list());

  const { data: employees = [], loading, error, reload } = useAsyncData(
    () =>
      employeeService.list({
        search,
        departmentId,
        status,
      }),
    [search, departmentId, status],
  );

  const pageCount = Math.max(1, Math.ceil(employees.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = useMemo(
    () => employees.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [employees, currentPage],
  );

  const clearFilters = () => {
    setSearch('');
    setDepartmentId('');
    setStatus('');
    setPage(1);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const removed = await employeeService.remove(deleteTarget.id);
      if (removed) {
        success(`${deleteTarget.name} was removed.`);
      } else {
        toastError('Employee not found.');
      }
      setDeleteTarget(null);
      reload();
    } catch (err) {
      toastError(err.message || 'Failed to delete employee.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Employees"
        description="Manage your workforce, roles and employment status."
        actions={
          <Link to="/employees/new">
            <Button leftIcon={Plus}>Add employee</Button>
          </Link>
        }
      />

      {error ? (
        <Card>
          <ErrorState message={error} onRetry={reload} />
        </Card>
      ) : (
        <Card>
          <div className="border-b border-slate-100 px-5 py-4">
            <EmployeeFilters
              search={search}
              onSearchChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
              departmentId={departmentId}
              onDepartmentChange={(value) => {
                setDepartmentId(value);
                setPage(1);
              }}
              status={status}
              onStatusChange={(value) => {
                setStatus(value);
                setPage(1);
              }}
              departments={departments}
              onClear={clearFilters}
            />
          </div>

          <EmployeeTable
            employees={visible}
            departments={departments}
            loading={loading}
            onEdit={(employee) => navigate(`/employees/${employee.id}/edit`)}
            onDelete={(employee) => setDeleteTarget(employee)}
            emptyAction={
              search || departmentId || status
                ? { label: 'Clear filters', onClick: clearFilters }
                : {
                    label: 'Add your first employee',
                    onClick: () => navigate('/employees/new'),
                  }
            }
          />

          <div className="border-t border-slate-100">
            <Pagination
              page={currentPage}
              pageCount={pageCount}
              totalItems={employees.length}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
            />
          </div>
        </Card>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete employee"
        message={`Are you sure you want to delete ${deleteTarget?.name || 'this employee'}? This action removes their profile and attendance records permanently.`}
        confirmLabel="Delete employee"
        isLoading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default EmployeesPage;
