import { http } from "@company/hr-common-api";
import type { EmployeeSearchApi } from "@company/hr-common-ui";

function compactParams(params: Record<string, string | undefined>) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value.trim() !== ""),
  );
}

export const employeeSearchApi: EmployeeSearchApi = {
  fetchCompanies: () => http.get("/employee-search/companies"),
  fetchDepartments: (companyId) => http.get(`/employee-search/companies/${encodeURIComponent(companyId)}/departments`),
  searchEmployees: (params) => http.get("/employee-search/employees", { params: compactParams(params) }),
  searchEmployeesByDepartment: ({ companyId, departmentId }) =>
    http.get(`/employee-search/departments/${encodeURIComponent(departmentId)}/employees`, {
      params: compactParams({ companyId }),
    }),
};
