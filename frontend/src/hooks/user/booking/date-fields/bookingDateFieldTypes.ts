export interface BookingDateFormState {
  checkIn: string;
  checkOut: string;
  checkoutMinDate: string;
  today: string;
  setCheckIn: (value: string) => void;
  setCheckOut: (value: string) => void;
}
