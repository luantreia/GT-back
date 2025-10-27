import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  phone: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const studentCreateSchema = z.object({
  name: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email().optional()
});

export const studentUpdateSchema = studentCreateSchema.partial();

export const lessonCreateSchema = z.object({
  studentId: z.string().min(1),
  start: z.string().datetime(),
  end: z.string().datetime(),
  notes: z.string().optional()
});

export const lessonUpdateSchema = z.object({
  start: z.string().datetime().optional(),
  end: z.string().datetime().optional(),
  status: z.enum(['scheduled', 'cancelled', 'completed']).optional(),
  notes: z.string().optional()
});
