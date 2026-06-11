import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Room } from '@/types';
import { useAuthStore } from '@/stores/authStore';
import { useFilterStore } from '@/stores/filterStore';
import { getBookingBlockedReason, isSelectedRangeUnavailable } from './propertyDetailAccess';
import { usePropertyBookingActions } from './usePropertyBookingActions';
import { usePropertyDetailData } from './usePropertyDetailData';

export const usePropertyDetailPageState = () => {
  const route = usePropertyDetailRoute();
  const dates = usePropertyDetailDates();
  const data = usePropertyDetailData(route.id, dates.checkIn, dates.checkOut, route.goHome);
  const selection = useSelectedRoomState(data.property?.rooms || []);
  const auth = usePropertyDetailAuth(selection.selectedRoom, dates.checkIn, dates.checkOut);
  const booking = usePropertyBookingActions({ ...dates, filters: dates.filters, id: route.id, navigate: route.navigate });
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

const usePropertyDetailAuth = (selectedRoom: Room | null, checkIn: string, checkOut: string) => {
  const { isAuthenticated, isTenant, user } = useAuthStore();
  let bookingBlockedReason = getBookingBlockedReason(isAuthenticated, user?.verified_at);
  if (!bookingBlockedReason) {
    if (!checkIn || !checkOut) {
      bookingBlockedReason = "Pilih tanggal check-in dan check-out";
    } else if (!selectedRoom) {
      bookingBlockedReason = "Pilih kamar terlebih dahulu";
    } else if (isSelectedRangeUnavailable(selectedRoom, checkIn, checkOut)) {
      bookingBlockedReason = "Tanggal yang dipilih tidak tersedia";
    } else if (selectedRoom.is_available === false) {
      bookingBlockedReason = selectedRoom.availability_source === 'CUSTOMER_BOOKED'
        ? "Kamar sudah dipesan pada tanggal tersebut"
        : "Tanggal yang dipilih tidak tersedia";
    }
  }
  return { bookingBlockedReason, isTenant };
};

const useSelectedRoomState = (rooms: Room[]) => {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const selectedRoom = getSelectedRoom(selectedRoomId, rooms);
  const selectRoom = useCallback((roomId: string) => setSelectedRoomId(roomId), []);
  return { selectRoom, selectedRoom };
};

const getSelectedRoom = (selectedRoomId: string | null, rooms: Room[]) =>
  rooms.find((room) => room.id === selectedRoomId) ?? getDefaultRoom(rooms);

const getDefaultRoom = (rooms: Room[]) =>
  rooms.find((room) => room.is_available !== false) || rooms[0] || null;

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
