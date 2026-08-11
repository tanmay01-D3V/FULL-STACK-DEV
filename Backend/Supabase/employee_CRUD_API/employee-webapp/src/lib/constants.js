export const STATUS_META = {
  active: {
    label: 'Active',
    badge: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    dot: 'bg-emerald-500',
  },
  on_leave: {
    label: 'On Leave',
    badge: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    dot: 'bg-amber-500',
  },
  inactive: {
    label: 'Inactive',
    badge: 'bg-slate-100 text-slate-600 ring-slate-500/20',
    dot: 'bg-slate-400',
  },
  probation: {
    label: 'Probation',
    badge: 'bg-sky-50 text-sky-700 ring-sky-600/20',
    dot: 'bg-sky-500',
  },
};

export const ATTENDANCE_META = {
  present: {
    label: 'Present',
    badge: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    dot: 'bg-emerald-500',
  },
  late: {
    label: 'Late',
    badge: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    dot: 'bg-amber-500',
  },
  on_leave: {
    label: 'On Leave',
    badge: 'bg-violet-50 text-violet-700 ring-violet-600/20',
    dot: 'bg-violet-500',
  },
  absent: {
    label: 'Absent',
    badge: 'bg-rose-50 text-rose-700 ring-rose-600/20',
    dot: 'bg-rose-500',
  },
};

export const EMPLOYEE_STATUSES = Object.keys(STATUS_META);

export const DEPARTMENTS = ['Engineering', 'Product Design', 'Marketing', 'Sales', 'Customer Support', 'Human Resources', 'Finance', 'Operations'];

export const POSITIONS_BY_DEPARTMENT = {
  Engineering: ['Software Engineer', 'Senior Engineer', 'Frontend Engineer', 'Backend Engineer', 'DevOps Engineer', 'Engineering Manager'],
  'Product Design': ['Product Designer', 'UX Designer', 'UI Designer', 'Design Lead'],
  Marketing: ['Marketing Manager', 'Content Strategist', 'Growth Marketer', 'SEO Specialist'],
  Sales: ['Account Executive', 'Sales Manager', 'Sales Development Rep', 'Solutions Consultant'],
  'Customer Support': ['Support Specialist', 'Customer Success Manager', 'Support Lead'],
  'Human Resources': ['HR Generalist', 'Recruiter', 'HR Manager', 'People Operations'],
  Finance: ['Financial Analyst', 'Accountant', 'Finance Manager', 'Payroll Specialist'],
  Operations: ['Operations Analyst', 'Office Manager', 'Operations Manager', 'Logistics Coordinator'],
};
