export interface Employee {
  id: string;
  employeeNo: string;
  name: string;
  organizationName: string;
  employmentStatus: "ACTIVE" | "LEAVE" | "RETIRED";
  hireDate: string;
}

export type EmployeePayload = Omit<Employee, "id">;

export interface EmployeeSearchParams {
  employeeNo?: string;
  name?: string;
  organizationId?: string;
  employmentStatus?: string;
  hireDateRange?: unknown;
}
