import { seedDepartments } from '../data/seed';
import { employeeService } from './employeeService';

export const departmentService = {
  async list() {
    const employees = await employeeService.list();
    return seedDepartments.map((department) => ({
      ...department,
      headcount: employees.filter(
        (employee) => employee.departmentId === department.id,
      ).length,
    }));
  },

  async get(id) {
    return seedDepartments.find((department) => department.id === id) ?? null;
  },
};
