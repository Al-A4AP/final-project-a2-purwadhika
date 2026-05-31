import { useEffect, useState } from "react";
import type { NavigateFunction } from "react-router-dom";
import { propertyService } from "@/services/propertyService";
import type { PropertyDetail, Room } from "@/types";
import { appendMidtransScript, removeMidtransScript } from "./midtransScript";
import { isBookingQueryComplete } from "./bookingQuery";
import type { BookingQuery } from "./bookingTypes";

export const useBookingData = (query: BookingQuery, navigate: NavigateFunction) => {
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => loadBookingEffect(query, navigate, setProperty, setRoom, setLoading), [query, navigate]);
  return { property, room, loading };
};

const loadBookingEffect = (
  query: BookingQuery,
  navigate: NavigateFunction,
  setProperty: (property: PropertyDetail) => void,
  setRoom: (room: Room | null) => void,
  setLoading: (loading: boolean) => void,
) => {
  if (!isBookingQueryComplete(query)) { navigate("/"); return; }
  const script = appendMidtransScript();
  void loadBookingData(query, navigate, setProperty, setRoom, setLoading);
  return () => removeMidtransScript(script);
};

const loadBookingData = async (query: BookingQuery, navigate: NavigateFunction, setProperty: (property: PropertyDetail) => void, setRoom: (room: Room | null) => void, setLoading: (loading: boolean) => void) => {
  try {
    const data = await propertyService.getPropertyDetail(query.propertyId!, query.checkIn!, query.checkOut!);
    setProperty(data);
    setRoom(data.rooms?.find((item) => item.id === query.roomId) ?? null);
  } catch { navigate("/"); }
  finally { setLoading(false); }
};
