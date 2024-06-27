import React from 'react'
import { render, screen } from '@testing-library/react'
import { EmployeeCard } from '../components/employee-card/employee-card'
import { IEmployee } from '@/app/api/get-all-employees/route'

const mockEmployeeData = {
	"id": 1,
	"publicId": "b5e7470e-2554-47f8-a111-37f0dbf1fe1d",
	"firstName": "Gabriel",
	"lastName": "Ariza",
	"hireDate": "2024-06-24T17:51:56.000Z",
	"isActive": false,
	"departmentKey": "it",
	"phone": "+55 62 9 9277-6060",
	"address": "R. C-181, 790 QD 455 LT 1/26",
	"createdAt": new Date("2024-06-24T17:51:56.000Z"),
	"updatedAt": new Date("2024-06-24T17:51:56.000Z"),
	"department": {
		"id": 2,
		"key": "it",
		"label": "IT",
		"createdAt": new Date("2024-06-24T17:51:56.000Z"),
		"updatedAt": new Date("2024-06-24T17:51:56.000Z")
	},
	"EmployeeDepartmentHistory": [
		{
			"id": 1,
			"employeeId": 1,
			"departmentKey": "it",
			"departmentLabel": "IT",
			"createdAt": new Date("2024-06-24T17:51:56.000Z"),
			"updatedAt": new Date("2024-06-24T17:51:56.000Z")
		},
		{
			"id": 2,
			"employeeId": 1,
			"departmentKey": "po",
			"departmentLabel": "PO",
			"createdAt": new Date("2024-06-24T17:51:56.000Z"),
			"updatedAt": new Date("2024-06-24T17:51:56.000Z")
		},
		{
			"id": 3,
			"employeeId": 1,
			"departmentKey": "hr",
			"departmentLabel": "HR",
			"createdAt": new Date("2024-06-24T17:51:56.000Z"),
			"updatedAt": new Date("2024-06-24T17:51:56.000Z")
		},
		{
			"id": 4,
			"employeeId": 1,
			"departmentKey": "sm",
			"departmentLabel": "SM",
			"createdAt": new Date("2024-06-24T17:51:56.000Z"),
			"updatedAt": new Date("2024-06-24T17:51:56.000Z")
		},
		{
			"id": 5,
			"employeeId": 1,
			"departmentKey": "mg",
			"departmentLabel": "MG",
			"createdAt": new Date("2024-06-24T17:51:56.000Z"),
			"updatedAt": new Date("2024-06-24T17:51:56.000Z")
		},
		{
			"id": 6,
			"employeeId": 1,
			"departmentKey": "it",
			"departmentLabel": "IT",
			"createdAt": new Date("2024-06-24T17:51:56.000Z"),
			"updatedAt": new Date("2024-06-24T17:51:56.000Z")
		},
		{
			"id": 7,
			"employeeId": 1,
			"departmentKey": "mg",
			"departmentLabel": "MG",
			"createdAt": new Date("2024-06-24T17:51:56.000Z"),
			"updatedAt": new Date("2024-06-24T17:51:56.000Z")
		},
		{
			"id": 8,
			"employeeId": 1,
			"departmentKey": "it",
			"departmentLabel": "IT",
			"createdAt": new Date("2024-06-24T17:51:56.000Z"),
			"updatedAt": new Date("2024-06-24T17:51:56.000Z")
		},
		{
			"id": 9,
			"employeeId": 1,
			"departmentKey": "hr",
			"departmentLabel": "HR",
			"createdAt": new Date("2024-06-24T17:51:56.000Z"),
			"updatedAt": new Date("2024-06-24T17:51:56.000Z")
		},
		{
			"id": 10,
			"employeeId": 1,
			"departmentKey": "it",
			"departmentLabel": "IT",
			"createdAt": new Date("2024-06-24T17:51:56.000Z"),
			"updatedAt": new Date("2024-06-24T17:51:56.000Z")
		},
		{
			"id": 11,
			"employeeId": 1,
			"departmentKey": "it",
			"departmentLabel": "IT",
			"createdAt": new Date("2024-06-24T17:51:56.000Z"),
			"updatedAt": new Date("2024-06-24T17:51:56.000Z")
		},
		{
			"id": 12,
			"employeeId": 1,
			"departmentKey": "hr",
			"departmentLabel": "HR",
			"createdAt": new Date("2024-06-25T22:22:40.078Z"),
			"updatedAt": new Date("2024-06-25T22:22:40.078Z")
		},
		{
			"id": 13,
			"employeeId": 1,
			"departmentKey": "it",
			"departmentLabel": "IT",
			"createdAt": new Date("2024-06-25T22:22:47.021Z"),
			"updatedAt": new Date("2024-06-25T22:22:47.021Z")
		},
		{
			"id": 14,
			"employeeId": 1,
			"departmentKey": "hr",
			"departmentLabel": "HR",
			"createdAt": new Date("2024-06-25T23:21:47.057Z"),
			"updatedAt": new Date("2024-06-25T23:21:47.057Z")
		},
		{
			"id": 15,
			"employeeId": 1,
			"departmentKey": "it",
			"departmentLabel": "IT",
			"createdAt": new Date("2024-06-25T23:25:43.857Z"),
			"updatedAt": new Date("2024-06-25T23:25:43.857Z")
		},
		{
			"id": 16,
			"employeeId": 1,
			"departmentKey": "mg",
			"departmentLabel": "Manager",
			"createdAt": new Date("2024-06-25T23:26:36.620Z"),
			"updatedAt": new Date("2024-06-25T23:26:36.620Z")
		},
		{
			"id": 17,
			"employeeId": 1,
			"departmentKey": "hr",
			"departmentLabel": "HR",
			"createdAt": new Date("2024-06-25T23:26:44.312Z"),
			"updatedAt": new Date("2024-06-25T23:26:44.312Z")
		},
		{
			"id": 18,
			"employeeId": 1,
			"departmentKey": "sm",
			"departmentLabel": "Scrum Master",
			"createdAt": new Date("2024-06-25T23:26:50.579Z"),
			"updatedAt": new Date("2024-06-25T23:26:50.579Z")
		},
		{
			"id": 19,
			"employeeId": 1,
			"departmentKey": "mg",
			"departmentLabel": "Manager",
			"createdAt": new Date("2024-06-25T23:27:23.439Z"),
			"updatedAt": new Date("2024-06-25T23:27:23.439Z")
		},
		{
			"id": 20,
			"employeeId": 1,
			"departmentKey": "hr",
			"departmentLabel": "HR",
			"createdAt": new Date("2024-06-25T23:28:13.518Z"),
			"updatedAt": new Date("2024-06-25T23:28:13.518Z")
		},
		{
			"id": 21,
			"employeeId": 1,
			"departmentKey": "po",
			"departmentLabel": "Product Owner",
			"createdAt": new Date("2024-06-25T23:28:18.193Z"),
			"updatedAt": new Date("2024-06-25T23:28:18.193Z")
		},
		{
			"id": 22,
			"employeeId": 1,
			"departmentKey": "hr",
			"departmentLabel": "HR",
			"createdAt": new Date("2024-06-25T23:28:56.620Z"),
			"updatedAt": new Date("2024-06-25T23:28:56.620Z")
		},
		{
			"id": 23,
			"employeeId": 1,
			"departmentKey": "it",
			"departmentLabel": "IT",
			"createdAt": new Date("2024-06-25T23:29:07.001Z"),
			"updatedAt": new Date("2024-06-25T23:29:07.001Z")
		},
		{
			"id": 24,
			"employeeId": 1,
			"departmentKey": "hr",
			"departmentLabel": "HR",
			"createdAt": new Date("2024-06-25T23:29:35.470Z"),
			"updatedAt": new Date("2024-06-25T23:29:35.470Z")
		},
		{
			"id": 25,
			"employeeId": 1,
			"departmentKey": "mg",
			"departmentLabel": "Manager",
			"createdAt": new Date("2024-06-25T23:29:49.698Z"),
			"updatedAt": new Date("2024-06-25T23:29:49.698Z")
		},
		{
			"id": 26,
			"employeeId": 1,
			"departmentKey": "hr",
			"departmentLabel": "HR",
			"createdAt": new Date("2024-06-26T00:17:06.414Z"),
			"updatedAt": new Date("2024-06-26T00:17:06.414Z")
		},
		{
			"id": 27,
			"employeeId": 1,
			"departmentKey": "po",
			"departmentLabel": "Product Owner",
			"createdAt": new Date("2024-06-26T00:17:32.014Z"),
			"updatedAt": new Date("2024-06-26T00:17:32.014Z")
		},
		{
			"id": 28,
			"employeeId": 1,
			"departmentKey": "hr",
			"departmentLabel": "HR",
			"createdAt": new Date("2024-06-26T00:19:19.471Z"),
			"updatedAt": new Date("2024-06-26T00:19:19.471Z")
		},
		{
			"id": 29,
			"employeeId": 1,
			"departmentKey": "it",
			"departmentLabel": "IT",
			"createdAt": new Date("2024-06-26T00:22:18.505Z"),
			"updatedAt": new Date("2024-06-26T00:22:18.505Z")
		},
		{
			"id": 30,
			"employeeId": 1,
			"departmentKey": "hr",
			"departmentLabel": "HR",
			"createdAt": new Date("2024-06-26T00:23:49.999Z"),
			"updatedAt": new Date("2024-06-26T00:23:49.999Z")
		},
		{
			"id": 31,
			"employeeId": 1,
			"departmentKey": "po",
			"departmentLabel": "Product Owner",
			"createdAt": new Date("2024-06-26T00:24:10.592Z"),
			"updatedAt": new Date("2024-06-26T00:24:10.592Z")
		},
		{
			"id": 32,
			"employeeId": 1,
			"departmentKey": "hr",
			"departmentLabel": "HR",
			"createdAt": new Date("2024-06-26T00:25:18.215Z"),
			"updatedAt": new Date("2024-06-26T00:25:18.215Z")
		},
		{
			"id": 33,
			"employeeId": 1,
			"departmentKey": "sm",
			"departmentLabel": "Scrum Master",
			"createdAt": new Date("2024-06-26T00:26:31.266Z"),
			"updatedAt": new Date("2024-06-26T00:26:31.266Z")
		},
		{
			"id": 34,
			"employeeId": 1,
			"departmentKey": "it",
			"departmentLabel": "IT",
			"createdAt": new Date("2024-06-26T00:26:38.609Z"),
			"updatedAt": new Date("2024-06-26T00:26:38.609Z")
		},
		{
			"id": 35,
			"employeeId": 1,
			"departmentKey": "hr",
			"departmentLabel": "HR",
			"createdAt": new Date("2024-06-26T00:29:27.871Z"),
			"updatedAt": new Date("2024-06-26T00:29:27.871Z")
		},
		{
			"id": 36,
			"employeeId": 1,
			"departmentKey": "mg",
			"departmentLabel": "Manager",
			"createdAt": new Date("2024-06-26T00:29:32.888Z"),
			"updatedAt": new Date("2024-06-26T00:29:32.888Z")
		},
		{
			"id": 37,
			"employeeId": 1,
			"departmentKey": "hr",
			"departmentLabel": "HR",
			"createdAt": new Date("2024-06-26T00:29:45.049Z"),
			"updatedAt": new Date("2024-06-26T00:29:45.049Z")
		},
		{
			"id": 38,
			"employeeId": 1,
			"departmentKey": "sm",
			"departmentLabel": "Scrum Master",
			"createdAt": new Date("2024-06-26T00:30:41.200Z"),
			"updatedAt": new Date("2024-06-26T00:30:41.200Z")
		},
		{
			"id": 39,
			"employeeId": 1,
			"departmentKey": "it",
			"departmentLabel": "IT",
			"createdAt": new Date("2024-06-26T00:30:53.970Z"),
			"updatedAt": new Date("2024-06-26T00:30:53.970Z")
		},
		{
			"id": 40,
			"employeeId": 1,
			"departmentKey": "sm",
			"departmentLabel": "Scrum Master",
			"createdAt": new Date("2024-06-26T00:31:00.111Z"),
			"updatedAt": new Date("2024-06-26T00:31:00.111Z")
		},
		{
			"id": 41,
			"employeeId": 1,
			"departmentKey": "hr",
			"departmentLabel": "HR",
			"createdAt": new Date("2024-06-26T00:31:24.700Z"),
			"updatedAt": new Date("2024-06-26T00:31:24.700Z")
		},
		{
			"id": 42,
			"employeeId": 1,
			"departmentKey": "it",
			"departmentLabel": "IT",
			"createdAt": new Date("2024-06-26T00:31:32.160Z"),
			"updatedAt": new Date("2024-06-26T00:31:32.160Z")
		},
		{
			"id": 43,
			"employeeId": 1,
			"departmentKey": "po",
			"departmentLabel": "Product Owner",
			"createdAt": new Date("2024-06-26T00:49:18.406Z"),
			"updatedAt": new Date("2024-06-26T00:49:18.406Z")
		},
		{
			"id": 44,
			"employeeId": 1,
			"departmentKey": "sm",
			"departmentLabel": "Scrum Master",
			"createdAt": new Date("2024-06-26T00:49:31.023Z"),
			"updatedAt": new Date("2024-06-26T00:49:31.023Z")
		},
		{
			"id": 45,
			"employeeId": 1,
			"departmentKey": "it",
			"departmentLabel": "IT",
			"createdAt": new Date("2024-06-26T00:55:02.967Z"),
			"updatedAt": new Date("2024-06-26T00:55:02.967Z")
		},
		{
			"id": 46,
			"employeeId": 1,
			"departmentKey": "mg",
			"departmentLabel": "Manager",
			"createdAt": new Date("2024-06-26T00:55:17.975Z"),
			"updatedAt": new Date("2024-06-26T00:55:17.975Z")
		},
		{
			"id": 47,
			"employeeId": 1,
			"departmentKey": "hr",
			"departmentLabel": "HR",
			"createdAt": new Date("2024-06-26T00:58:41.669Z"),
			"updatedAt": new Date("2024-06-26T00:58:41.669Z")
		},
		{
			"id": 48,
			"employeeId": 1,
			"departmentKey": "it",
			"departmentLabel": "IT",
			"createdAt": new Date("2024-06-26T12:28:48.784Z"),
			"updatedAt": new Date("2024-06-26T12:28:48.784Z")
		},
		{
			"id": 49,
			"employeeId": 1,
			"departmentKey": "po",
			"departmentLabel": "Product Owner",
			"createdAt": new Date("2024-06-26T12:28:53.105Z"),
			"updatedAt": new Date("2024-06-26T12:28:53.105Z")
		},
		{
			"id": 50,
			"employeeId": 1,
			"departmentKey": "sm",
			"departmentLabel": "Scrum Master",
			"createdAt": new Date("2024-06-26T13:04:30.214Z"),
			"updatedAt": new Date("2024-06-26T13:04:30.214Z")
		},
		{
			"id": 51,
			"employeeId": 1,
			"departmentKey": "it",
			"departmentLabel": "IT",
			"createdAt": new Date("2024-06-27T01:14:36.916Z"),
			"updatedAt": new Date("2024-06-27T01:14:36.916Z")
		},
		{
			"id": 52,
			"employeeId": 1,
			"departmentKey": "po",
			"departmentLabel": "Product Owner",
			"createdAt": new Date("2024-06-27T01:14:40.597Z"),
			"updatedAt": new Date("2024-06-27T01:14:40.597Z")
		},
		{
			"id": 53,
			"employeeId": 1,
			"departmentKey": "it",
			"departmentLabel": "IT",
			"createdAt": new Date("2024-06-27T01:14:42.933Z"),
			"updatedAt": new Date("2024-06-27T01:14:42.933Z")
		}
	]
} as unknown as IEmployee

describe('EmployeeCard', () => {
	it('should render employee name and department', () => {
		render(<EmployeeCard employeeData={mockEmployeeData} />)
		const nameElement = screen.getByText(`${mockEmployeeData.firstName} ${mockEmployeeData.lastName}`)
		const departmentElement = screen.getByText(`(${mockEmployeeData.department.label})`)
		expect(nameElement).toBeDefined()
		expect(departmentElement).toBeDefined()
	})

	it('should render hire date', () => {
		render(<EmployeeCard employeeData={mockEmployeeData} />)
		const hireDateElement = screen.getByText(mockEmployeeData.hireDate?.toString()?.split('T')[0] || "")
		expect(hireDateElement).toBeDefined()
	})

	it('should render "View details" button', () => {
		render(<EmployeeCard employeeData={mockEmployeeData} />)
		const viewDetailsButton = screen.getByRole('button', { name: 'View details' })
		expect(viewDetailsButton).toBeDefined()
	})

	it('should render default department label when department is undefined', () => {
		const employeeDataWithoutDepartment = { ...mockEmployeeData };
		employeeDataWithoutDepartment.department = null
		render(<EmployeeCard employeeData={employeeDataWithoutDepartment} />)
		const departmentElement = screen.getByText('(department)')
		expect(departmentElement).toBeDefined()
	})

	it('should render "N/A" for hire date when hireDate is undefined', () => {
		const employeeDataWithoutHireDate = { ...mockEmployeeData, hireDate: null }
		render(<EmployeeCard employeeData={employeeDataWithoutHireDate} />)
		const hireDateElement = screen.getByText('N/A')
		expect(hireDateElement).toBeDefined()
	})
})
