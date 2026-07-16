import { http } from "@company/hr-common-api";
import type { EmployeeSearchApi } from "@company/hr-common-ui";

export const employeeSearchApi: EmployeeSearchApi = {
  fetchCompanies: () => http.get("/employee-search/companies"),
  fetchDepartments: (companyId) => http.get(`/employee-search/companies/${companyId}/departments`),
  searchEmployees: (params) => http.get("/employee-search/employees", { params }),
  searchEmployeesByDepartment: (params) => http.get(`/employee-search/departments/${params.departmentId}/employees`, { params }),
};
