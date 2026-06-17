import type { FieldErrors, Resolver } from "react-hook-form";
import type { ZodIssue } from "zod";
import { loginSchema, type LoginInput } from "@/validations/auth";

export const loginFormResolver: Resolver<LoginInput> = async (data) => {
  const result = await loginSchema.safeParseAsync(data);
  if (result.success) return { values: result.data, errors: {} };
  return { values: {}, errors: mapLoginIssues(result.error.issues) };
};

const mapLoginIssues = (issues: ZodIssue[]): FieldErrors<LoginInput> =>
  issues.reduce((errors, issue) => {
    const field = issue.path[0] as keyof LoginInput;
    if (field) errors[field] = { type: "manual", message: issue.message };
    return errors;
  }, {} as FieldErrors<LoginInput>);
