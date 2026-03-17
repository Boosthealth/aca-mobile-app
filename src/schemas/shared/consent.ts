import { z } from "zod";

export const consentSchema = z
  .boolean({ error: "You must agree to the terms to continue" })
  .refine((val) => val === true, { message: "You must agree to the terms to continue" });
