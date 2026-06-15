import type { FieldErrors, Resolver } from "react-hook-form";
import type { ZodIssue } from "zod";
import { passwordSchema, type PasswordInput } from "@/validations/profile";

const mapZodIssues = (issues: ZodIssue[]): FieldErrors<PasswordInput> =>
  issues.reduce((acc, issue) => {
    const path = issue.path[0] as keyof PasswordInput;
    if (path) acc[path] = { type: "manual", message: issue.message };
    return acc;
  }, {} as FieldErrors<PasswordInput>);

export const passwordFormResolver: Resolver<PasswordInput> = async (data) => {
  const result = await passwordSchema.safeParseAsync(data);
  if (result.success) return { values: result.data, errors: {} };
  return { values: {}, errors: mapZodIssues(result.error.issues) };
};
