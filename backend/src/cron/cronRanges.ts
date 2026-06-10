export const getCheckInReminderRange = () => {
  const now = new Date();
  return {
    start: now,
    end: new Date(now.getTime() + 24 * 60 * 60 * 1000),
  };
};
