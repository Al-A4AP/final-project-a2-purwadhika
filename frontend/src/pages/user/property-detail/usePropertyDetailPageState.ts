import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Room } from '@/types';
import { useAuthStore } from '@/stores/authStore';
import { useFilterStore } from '@/stores/filterStore';
import { getBookingBlockedReason } from './propertyDetailAccess';
import { findRoomById, getSelectedRoom } from './selectedRoom';
import { usePropertyAvailabilityModal } from './usePropertyAvailabilityModal';
import { usePropertyBookingActions } from './usePropertyBookingActions';
import { usePropertyDetailData } from './usePropertyDetailData';

export const usePropertyDetailPageState = () => {
  const route = usePropertyDetailRoute();
  const dates = usePropertyDetailDates();
  const auth = usePropertyDetailAuth();
  const data = usePropertyDetailData(route.id, dates.checkIn, dates.checkOut, route.goHome);
  const booking = usePropertyBookingActions({ ...dates, filters: dates.filters, id: route.id, navigate: route.navigate });
  const availability = usePropertyAvailabilityModal();
  const selection = useSelectedRoomState(data.property?.rooms || [], availability.selectedRoomId);
  const handlers = usePropertyDetailHandlers(dates, booking, availability, selection.selectRoom);
  return { ...route, ...dates, ...auth, availability, booking, data, ...selection, ...handlers };
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

const useSelectedRoomState = (rooms: Room[], modalRoomId: string | null) => {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const selectedRoom = getSelectedRoom(rooms, selectedRoomId);
  const modalRoom = findRoomById(rooms, modalRoomId) || selectedRoom;
  const selectRoom = useCallback((roomId: string) => setSelectedRoomId(roomId), []);
  return { modalRoom, selectRoom, selectedRoom };
};

const usePropertyDetailHandlers = (dates: PropertyDatesState, booking: BookingState, availability: AvailabilityState, selectRoom: (roomId: string) => void) => {
  const changeCheckIn = useCallback((value: string) => changeDate(value, dates.setCheckIn, booking), [booking, dates.setCheckIn]);
  const changeCheckOut = useCallback((value: string) => changeDate(value, dates.setCheckOut, booking), [booking, dates.setCheckOut]);
  const openAvailability = useCallback((room: Room) => openRoomAvailability(room, availability, selectRoom), [availability, selectRoom]);
  const handleRoomBooking = useCallback((room: Room) => handleBooking(room, dates, booking, availability), [availability, booking, dates]);
  return { changeCheckIn, changeCheckOut, handleRoomBooking, openAvailability };
};

const changeDate = (value: string, setValue: (value: string) => void, booking: BookingState) => {
  setValue(value);
  booking.clearDateError();
};

const openRoomAvailability = (room: Room, availability: AvailabilityState, selectRoom: (roomId: string) => void) => {
  selectRoom(room.id);
  availability.handleCheckAvail(room);
};

const handleBooking = (room: Room, dates: PropertyDatesState, booking: BookingState, availability: AvailabilityState) => {
  if (shouldOpenAvailability(dates)) availability.handleCheckAvail(room);
  booking.handleBooking(room);
};

const shouldOpenAvailability = (dates: Pick<PropertyDatesState, 'checkIn' | 'checkOut'>) =>
  !dates.checkIn || !dates.checkOut || new Date(dates.checkOut) <= new Date(dates.checkIn);

type PropertyDatesState = ReturnType<typeof usePropertyDetailDates>;
type BookingState = ReturnType<typeof usePropertyBookingActions>;
type AvailabilityState = ReturnType<typeof usePropertyAvailabilityModal>;
