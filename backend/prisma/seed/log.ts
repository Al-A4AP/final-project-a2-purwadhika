export const log = (message = '') => {
  process.stdout.write(`${message}\n`);
};

export const logError = (message: string, error: unknown) => {
  process.stderr.write(`${message}\n`);

  if (error instanceof Error) {
    process.stderr.write(`${error.stack || error.message}\n`);
    return;
  }

  process.stderr.write(`${String(error)}\n`);
};
