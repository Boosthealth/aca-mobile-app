import { z } from "zod";

export function nameSchema(type: "first" | "last") {
  return z
    .string({
      error: type === "first" ? "Enter a valid first name" : "Enter a valid last name",
    })
    .min(2, {
      error:
        type === "first"
          ? "First name must be at least 2 characters."
          : "Last name must be at least 2 characters.",
    })
    .max(120, {
      error: "Too many characters.",
    });
}
