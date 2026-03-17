import { z } from "zod";

export const confirmPasswordSchema = z.string({ error: "Please confirm your password" });
