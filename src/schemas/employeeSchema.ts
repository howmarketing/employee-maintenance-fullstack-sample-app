import { z } from 'zod';

// Base schema for common fields
const baseEmployeeSchema = z.object({
	firstName: z.string().min(1),
	lastName: z.string().min(1),
	departmentKey: z.string().min(1),
	phone: z.string().min(1),
	address: z.string().max(64),
});

// Schema for creating a new employee
export const createEmployeeSchema = baseEmployeeSchema.extend({
	hireDate: z.string().nullable(),
	isActive: z.boolean().default(true),
});

// Schema for updating an existing employee
export const updateEmployeeSchema = baseEmployeeSchema.partial().extend({
	hireDate: z.string().nullable().optional(),
	isActive: z.boolean().optional(),
});

// Full employee schema (including all fields)
export const employeeSchema = baseEmployeeSchema.extend({
	id: z.string().uuid(),
	hireDate: z.string().nullable(),
	isActive: z.boolean(),
});

export type CreateEmployeeSchema = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeSchema = z.infer<typeof updateEmployeeSchema>;
export type EmployeeSchema = z.infer<typeof employeeSchema>;
