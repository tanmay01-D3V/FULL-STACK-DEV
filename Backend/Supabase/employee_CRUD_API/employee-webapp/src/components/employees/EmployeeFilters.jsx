import { FilterX } from 'lucide-react';
import { EMPLOYEE_STATUSES, STATUS_META } from '../../lib/constants';
import SearchInput from '../ui/SearchInput';
import Select from '../ui/Select';
import Button from '../ui/Button';

function EmployeeFilters({
  search,
  onSearchChange,
  departmentId,
  onDepartmentChange,
  status,
  onStatusChange,
  departments,
  onClear,
}) {
  const hasFilters = search || departmentId || status;

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <SearchInput
        value={search}
        onChange={onSearchChange}
        placeholder="Search by name, email, ID or role..."
        className="w-full lg:max-w-xs"
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[auto_auto_auto]">
        <Select
          value={departmentId}
          onChange={(event) => onDepartmentChange(event.target.value)}
          aria-label="Filter by department"
          className="w-full lg:w-44"
        >
          <option value="">All departments</option>
          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </Select>

        <Select
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
          aria-label="Filter by status"
          className="w-full lg:w-40"
        >
          <option value="">All statuses</option>
          {EMPLOYEE_STATUSES.map((statusOption) => (
            <option key={statusOption} value={statusOption}>
              {STATUS_META[statusOption].label}
            </option>
          ))}
        </Select>

        {hasFilters && (
          <Button
            variant="secondary"
            size="md"
            leftIcon={FilterX}
            onClick={onClear}
            className="lg:justify-center"
          >
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}

export default EmployeeFilters;
