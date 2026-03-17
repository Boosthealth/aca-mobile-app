import { z } from "zod";

export const textareaSchema = z
  .string({
    error: "Enter a valid message",
  })
  .min(10, {
    error: "Enter a valid message min 10 characters.",
  })
  .max(500, {
    error: "Too many characters.",
  });
