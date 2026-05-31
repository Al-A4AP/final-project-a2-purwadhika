export const getApiErrorMessage = (err: unknown, fallback: string) => {
  const error = err as { response?: { data?: { message?: string } } };
  return error.response?.data?.message || fallback;
};
