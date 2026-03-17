import { z } from "zod";

export const passwordSchema = z
  .string({
    error: "Enter a valid password",
  })
  .min(8, {
    error: "Password must be at least 8 characters",
  })
  .max(40, {
    error: "Too many characters.",
  });
//   .regex(/[A-Z]/, { error: "Password must contain at least one uppercase letter" })
//   .regex(/[a-z]/, { error: "Password must contain at least one lowercase letter" })
//   .regex(/[0-9]/, { error: "Password must contain at least one number" });
