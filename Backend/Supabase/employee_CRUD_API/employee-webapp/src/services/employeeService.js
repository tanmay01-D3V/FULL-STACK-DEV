import { api } from './api';
import { seedDepartments } from '../data/seed';

const FALLBACK_DEPARTMENT_ID = 'dept-other';

function departmentIdFor(name) {
  const match = seedDepartments.find((department) => department.name === name);
  return match ? match.id : FALLBACK_DEPARTMENT_ID;
}

function departmentNameFor(id) {
  const match = seedDepartments.find((department) => department.id === id);
  return match ? match.name : 'Other';
}

function toFrontend(row) {
  return {
    id: String(row.id),
    employeeId: `EMP-${row.id}`,
    name: row.name,
    email: row.email,
    phone: '',
    departmentId: departmentIdFor(row.department),
    position: row.role,
    salary: Number(row.salary) || 0,
    status: 'active',
    joiningDate: row.created_at ? String(row.created_at).slice(0, 10) : '',
  };
}

function toBackend(data) {
  const payload = {
    name: data.name.trim(),
    email: data.email.trim(),
    department: departmentNameFor(data.departmentId),
    role: data.position.trim(),
    salary: Number(data.salary),
  };
  if (data.password) {
    payload.password = data.password;
  }
  return payload;
}

function normalize(value) {
  return String(value || '').toLowerCase().trim();
}

export const employeeService = {
  async list({ search = '', departmentId = '', status = '' } = {}) {
    const rows = await api.get('/employees');
    let list = (rows || []).map(toFrontend);
    const query = normalize(search);

    if (query) {
      list = list.filter((employee) =>
        [employee.name, employee.email, employee.position, employee.employeeId]
          .some((field) => normalize(field).includes(query)),
      );
    }
    if (departmentId) {
      list = list.filter((employee) => employee.departmentId === departmentId);
    }
    if (status) {
      list = list.filter((employee) => employee.status === status);
    }
    return list.sort((a, b) => a.name.localeCompare(b.name));
  },

  async get(id) {
    const row = await api.get(`/employees/${id}`);
    return toFrontend(row);
  },

  async create(data) {
    const result = await api.post('/employees', toBackend(data));
    return toFrontend(result.employee);
  },

  async update(id, data) {
    const result = await api.put(`/employees/${id}`, toBackend(data));
    return toFrontend(result.employee);
  },

  async remove(id) {
    await api.delete(`/employees/${id}`);
    return true;
  },
};
