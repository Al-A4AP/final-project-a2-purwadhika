import type { Resolver, FieldErrors } from "react-hook-form";
import { registerSchema, type RegisterInput } from "@/validations/auth";
import type { ZodIssue } from "zod";

const mapZodIssues = (issues: ZodIssue[]): FieldErrors<RegisterInput> => {
  return issues.reduce((acc, issue) => {
    const path = issue.path[0] as keyof RegisterInput;
    if (path) {
      acc[path] = { type: "manual", message: issue.message };
    }
    return acc;
  }, {} as FieldErrors<RegisterInput>);
};

export const registerFormResolver: Resolver<RegisterInput> = async (data) => {
  const result = await registerSchema.safeParseAsync(data);
  if (result.success) {
    return { values: result.data, errors: {} };
  }
  return { values: {}, errors: mapZodIssues(result.error.issues) };
};
