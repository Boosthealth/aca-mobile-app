import { z } from "zod";

import { emailSchema } from "./shared";

export const ResendVerificationSchema = z.object({
  email: emailSchema,
});
