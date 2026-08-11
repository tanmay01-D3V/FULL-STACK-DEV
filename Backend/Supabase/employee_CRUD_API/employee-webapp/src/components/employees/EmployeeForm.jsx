import { useMemo, useState } from "react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";

const EMPTY_FORM = {
  name: "",
  email: "",
  password: "",
  departmentId: "",
  position: "",
  salary: "",
};

function validate(form, requirePassword) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Full name is required.";
  if (!form.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (requirePassword && !form.password) {
    errors.password = "Password is required.";
  }
  if (!form.departmentId) errors.departmentId = "Select a department.";
  if (!form.position.trim()) errors.position = "Position is required.";
  if (form.salary === "" || form.salary === null) {
    errors.salary = "Salary is required.";
  } else if (Number(form.salary) < 0) {
    errors.salary = "Salary cannot be negative.";
  }
  return errors;
}

function EmployeeForm({ initialData, departments, isSubmitting, onSubmit }) {
  const requirePassword = !initialData;
  const [form, setForm] = useState(() =>
    initialData
      ? {
          name: initialData.name || "",
          email: initialData.email || "",
          password: "",
          departmentId: initialData.departmentId || "",
          position: initialData.position || "",
          salary: initialData.salary ?? "",
        }
      : EMPTY_FORM,
  );
  const [errors, setErrors] = useState({});

  const departmentOptions = useMemo(() => {
    const options = [...departments];
    if (
      initialData &&
      !options.some((department) => department.id === initialData.departmentId)
    ) {
      options.push({ id: initialData.departmentId, name: "Other" });
    }
    return options;
  }, [departments, initialData]);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate(form, requirePassword);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      const first = Object.keys(nextErrors)[0];
      document.getElementById(`field-${first}`)?.focus();
      return;
    }
    onSubmit({
      ...form,
      salary: Number(form.salary),
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <h3 className="text-sm font-semibold text-slate-900">Personal</h3>
          <p className="mb-4 mt-0.5 text-xs text-slate-500">
            Basic details about the employee.
          </p>
        </div>

        <Input
          id="field-name"
          label="Full name"
          placeholder="e.g. Jordan Smith"
          value={form.name}
          onChange={handleChange("name")}
          error={errors.name}
          autoComplete="name"
        />
        <Input
          id="field-email"
          label="Email address"
          type="email"
          placeholder="e.g. jordan@company.com"
          value={form.email}
          onChange={handleChange("email")}
          error={errors.email}
          autoComplete="email"
        />
        <div className="sm:col-span-2">
          <Input
            id="field-password"
            label={requirePassword ? "Password" : "New password"}
            type="password"
            placeholder={
              requirePassword
                ? "Set an initial password"
                : "Leave blank to keep unchanged"
            }
            value={form.password}
            onChange={handleChange("password")}
            error={errors.password}
            autoComplete={requirePassword ? "new-password" : "off"}
          />
        </div>

        <div className="sm:col-span-2">
          <h3 className="text-sm font-semibold text-slate-900">Employment</h3>
          <p className="mb-4 mt-0.5 text-xs text-slate-500">
            Department, role and compensation details.
          </p>
        </div>

        <Select
          label="Department"
          value={form.departmentId}
          onChange={handleChange("departmentId")}
          error={errors.departmentId}
          placeholder="Select department"
        >
          {departmentOptions.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </Select>
        <Input
          id="field-position"
          label="Position"
          placeholder="e.g. Software Engineer"
          value={form.position}
          onChange={handleChange("position")}
          error={errors.position}
        />
        <Input
          id="field-salary"
          label="Annual salary (USD)"
          type="number"
          min="0"
          step="0.01"
          placeholder="e.g. 85000"
          value={form.salary}
          onChange={handleChange("salary")}
          error={errors.salary}
        />

        <div className="flex items-end justify-end gap-2 sm:col-span-2">
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {initialData ? "Save changes" : "Create employee"}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default EmployeeForm;
