import { z } from "zod";

export const registerSchema = z.object({
    username: z.string().min(4, 'Username must be at least 4 characters'),
    email: z.email('Enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm password must be at least 8 characters'),
})
.refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
});

export type RegisterFormValues = z.infer<typeof registerSchema>;