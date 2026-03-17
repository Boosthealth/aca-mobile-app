import { z } from "zod";

import { phoneRegex } from "@/lib/utils";

export const phoneNumberSchema = z
  .string({
    error: "Phone number must be valid",
  })
  .min(1, "Phone number is required")
  .length(14, { error: "Enter a valid phone number" })
  .regex(phoneRegex, { error: "Phone number must be valid" });
