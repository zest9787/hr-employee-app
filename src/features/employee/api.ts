import { http } from "@company/hr-common-api";
import type { PageResponse } from "@company/hr-common-api";
import type { Employee, EmployeeSearchParams } from "../../entities/employee/types";

export const employeeApi = {
  search: (params: EmployeeSearchParams, page: { page: number; size: number }) =>
    http.get<PageResponse<Employee>>("/employees", { params: { ...params, ...page } }),
  detail: (employeeId: string) => http.get<Employee>(`/employees/${employeeId}`),
  create: (payload: Employee) => http.post<Employee>("/employees", payload),
  update: (employeeId: string, payload: Employee) => http.put<Employee>(`/employees/${employeeId}`, payload),
  remove: (employeeId: string) => http.delete<void>(`/employees/${employeeId}`),
};
