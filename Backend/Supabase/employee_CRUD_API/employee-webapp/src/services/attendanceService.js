import { employeeService } from './employeeService';
import { daysAgoISO } from '../lib/utils';

const PRESENT_TIMES = ['08:45', '08:52', '09:00', '09:05', '09:10'];
const LATE_TIMES = ['09:22', '09:34', '09:41', '09:58'];

function pseudo(value) {
  const x = Math.sin(value) * 10000;
  return x - Math.floor(x);
}

function buildRecords(employees, date) {
  const dateSeed = [...date].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return employees.map((employee, index) => {
    const key = dateSeed * 31 + Number(employee.id) + index * 7;
    const roll = pseudo(key);

    let status = 'present';
    if (roll < 0.7) {
      status = 'present';
    } else if (roll < 0.84) {
      status = 'late';
    } else if (roll < 0.93) {
      status = 'absent';
    } else {
      status = 'on_leave';
    }

    const timeIndex = Math.floor(pseudo(key + 7) * PRESENT_TIMES.length);
    const lateIndex = Math.floor(pseudo(key + 13) * LATE_TIMES.length);

    return {
      employeeId: employee.id,
      status,
      checkIn:
        status === 'present'
          ? PRESENT_TIMES[timeIndex]
          : status === 'late'
            ? LATE_TIMES[lateIndex]
            : null,
      checkOut: status === 'present' || status === 'late' ? '18:00' : null,
    };
  });
}

export const attendanceService = {
  async getForDate(date) {
    const employees = await employeeService.list();
    return buildRecords(employees, date);
  },

  async range(days = 7) {
    const employees = await employeeService.list();
    const dates = Array.from({ length: days }, (_, i) =>
      daysAgoISO(days - 1 - i),
    );
    return dates.map((date) => ({ date, records: buildRecords(employees, date) }));
  },
};
