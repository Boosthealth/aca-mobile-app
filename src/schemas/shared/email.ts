import { z } from "zod";

export const emailSchema = z
  .string({
    error: "Enter a valid email",
  })
  .email({ error: "Please enter a valid email address" })
  .min(2, { error: "Enter a valid email" });
