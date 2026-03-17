import { z } from "zod";

import {
  emailSchema,
  passwordSchema,
  confirmPasswordSchema,
  nameSchema,
  phoneNumberSchema,
  consentSchema,
} from "./shared";

export const SignUpSchema = z
  .object({
    firstName: nameSchema("first"),
    lastName: nameSchema("last"),
    email: emailSchema,
    phone: phoneNumberSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
    project: z.string(),
    consentToTerms: consentSchema,
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Passwords don't match",
        code: z.ZodIssueCode.custom,
      });
    }
  });
