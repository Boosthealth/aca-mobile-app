import { z } from "zod";

import { emailSchema, passwordSchema } from "./shared";

export const SignInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
