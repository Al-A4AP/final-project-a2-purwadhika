import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Room } from '@/types';
import { useAuthStore } from '@/stores/authStore';
import { useFilterStore } from '@/stores/filterStore';
import { getBookingBlockedReason } from './propertyDetailAccess';
import { usePropertyBookingActions } from './usePropertyBookingActions';
import { usePropertyDetailData } from './usePropertyDetailData';

export const usePropertyDetailPageState = () => {
  const route = usePropertyDetailRoute();
  const dates = usePropertyDetailDates();
  const auth = usePropertyDetailAuth();
  const data = usePropertyDetailData(route.id, dates.checkIn, dates.checkOut, route.goHome);
  const booking = usePropertyBookingActions({ ...dates, filters: dates.filters, id: route.id, navigate: route.navigate });
  const selection = useSelectedRoomState(data.property?.rooms || []);
  const handlers = usePropertyDetailHandlers(dates, booking, selection.selectRoom);
  return { ...route, ...dates, ...auth, booking, data, ...selection, ...handlers };
};

const usePropertyDetailRoute = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const goHome = useCallback(() => navigate('/'), [navigate]);
  return { goHome, id, navigate };
};

const usePropertyDetailDates = () => {
  const filters = useFilterStore();
  const [checkIn, setCheckIn] = useState(filters.check_in_date || '');
  const [checkOut, setCheckOut] = useState(filters.check_out_date || '');
  return { checkIn, checkOut, filters, setCheckIn, setCheckOut };
};

const usePropertyDetailAuth = () => {
  const { isAuthenticated, isTenant, user } = useAuthStore();
  const bookingBlockedReason = getBookingBlockedReason(isAuthenticated, user?.verified_at);
  return { bookingBlockedReason, isTenant };
};

const useSelectedRoomState = (rooms: Room[]) => {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const selectedRoom = rooms.find((r) => r.id === selectedRoomId) ?? null;
  const selectRoom = useCallback((roomId: string) => setSelectedRoomId(roomId), []);
  return { selectRoom, selectedRoom };
};

const usePropertyDetailHandlers = (
  dates: PropertyDatesState,
  booking: BookingState,
  selectRoom: (roomId: string) => void,
) => {
  const changeCheckIn = useCallback((value: string) => changeDate(value, dates.setCheckIn, booking), [booking, dates.setCheckIn]);
  const changeCheckOut = useCallback((value: string) => changeDate(value, dates.setCheckOut, booking), [booking, dates.setCheckOut]);
  const handleRoomBooking = useCallback((room: Room) => {
    selectRoom(room.id);
    booking.handleBooking(room);
  }, [booking, selectRoom]);
  return { changeCheckIn, changeCheckOut, handleRoomBooking };
};

const changeDate = (value: string, setValue: (value: string) => void, booking: BookingState) => {
  setValue(value);
  booking.clearDateError();
};

type PropertyDatesState = ReturnType<typeof usePropertyDetailDates>;
type BookingState = ReturnType<typeof usePropertyBookingActions>;

export type PropertyDetailPageState = ReturnType<typeof usePropertyDetailPageState>;
