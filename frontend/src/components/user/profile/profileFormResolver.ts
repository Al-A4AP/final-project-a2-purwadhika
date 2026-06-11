import type { Resolver, FieldErrors } from "react-hook-form";
import { profileSchema, type ProfileInput } from "@/validations/profile";
import type { ZodIssue } from "zod";

const mapZodIssues = (issues: ZodIssue[]): FieldErrors<ProfileInput> => {
  return issues.reduce((acc, issue) => {
    const path = issue.path[0] as keyof ProfileInput;
    if (path) {
      acc[path] = { type: "manual", message: issue.message };
    }
    return acc;
  }, {} as FieldErrors<ProfileInput>);
};

export const profileFormResolver: Resolver<ProfileInput> = async (data) => {
  const result = await profileSchema.safeParseAsync(data);
  if (result.success) {
    return { values: result.data, errors: {} };
  }
  return { values: {}, errors: mapZodIssues(result.error.issues) };
};
