import type { Resolver, FieldErrors } from "react-hook-form";
import type { ZodIssue } from "zod";
import { propertyFormSchema, type PropertyFormInput } from "./propertyFormSchema";

const mapZodIssues = (issues: ZodIssue[]): FieldErrors<PropertyFormInput> => {
  return issues.reduce((acc, issue) => {
    const path = issue.path[0] as keyof PropertyFormInput;
    if (path) {
      acc[path] = { type: "manual", message: issue.message };
    }
    return acc;
  }, {} as FieldErrors<PropertyFormInput>);
};

export const propertyFormResolver: Resolver<PropertyFormInput> = async (data) => {
  const result = await propertyFormSchema.safeParseAsync(data);
  if (result.success) {
    return { values: result.data, errors: {} };
  }
  return { values: {}, errors: mapZodIssues(result.error.issues) };
};
