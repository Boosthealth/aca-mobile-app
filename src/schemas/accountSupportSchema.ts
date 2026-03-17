import { z } from "zod";

import { emailSchema, textareaSchema } from "./shared";

export const AccountSupportSchema = z.object({
  email: emailSchema,
  message: textareaSchema,
});
