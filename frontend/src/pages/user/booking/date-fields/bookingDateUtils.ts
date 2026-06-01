export const getTodayInput = () => toDateInput(new Date());

export const getCheckoutMinDate = (checkIn: string | null) =>
  checkIn ? addDaysInput(checkIn, 1) : getTodayInput();

export const addDaysInput = (value: string, days: number) => {
  const date = new Date(`${value}T00:00:00`);
  date.setDate(date.getDate() + days);
  return toDateInput(date);
};

export const isCheckoutAfterCheckIn = (checkIn: string, checkOut: string) =>
  new Date(`${checkOut}T00:00:00`) > new Date(`${checkIn}T00:00:00`);

const toDateInput = (date: Date) =>
  new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split("T")[0];
