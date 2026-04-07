import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/\d/, "Password must include at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must include at least one symbol");

const egyptianPhoneRegex = /^(?:\+20|0)?1[0125]\d{8}$/;

export const RegisterSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: passwordSchema,
    rePassword: z.string(),
    phone: z
      .string()
      .regex(egyptianPhoneRegex, "Please enter a valid Egyptian phone number"),
  })
  .refine((data) => data.password === data.rePassword, {
    path: ["rePassword"],
    message: "Passwords do not match",
  });

export const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: passwordSchema,
});

export type RegisterFormValues = z.infer<typeof RegisterSchema>;
export type LoginFormValues = z.infer<typeof LoginSchema>;
