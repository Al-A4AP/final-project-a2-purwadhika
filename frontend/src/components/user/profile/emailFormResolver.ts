import type { FieldErrors, Resolver } from "react-hook-form";
import type { ZodIssue } from "zod";
import { emailChangeSchema, type EmailChangeInput } from "@/validations/profile";

const mapZodIssues = (issues: ZodIssue[]): FieldErrors<EmailChangeInput> =>
  issues.reduce((acc, issue) => {
    const path = issue.path[0] as keyof EmailChangeInput;
    if (path) acc[path] = { type: "manual", message: issue.message };
    return acc;
  }, {} as FieldErrors<EmailChangeInput>);

export const emailFormResolver: Resolver<EmailChangeInput> = async (data) => {
  const result = await emailChangeSchema.safeParseAsync(data);
  if (result.success) return { values: result.data, errors: {} };
  return { values: {}, errors: mapZodIssues(result.error.issues) };
};
