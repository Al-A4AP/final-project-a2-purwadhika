export const getCheckInReminderRange = () => ({
  start: new Date(Date.now() + 24 * 60 * 60 * 1000),
  end: new Date(Date.now() + 25 * 60 * 60 * 1000),
});
